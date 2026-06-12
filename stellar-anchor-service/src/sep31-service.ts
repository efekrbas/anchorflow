// ============================================================
// sep31-service.ts — SEP-31: Cross-Border Payments API
//
// SEP-31 enables "direct payment" (cross-border remittance)
// flows where a sending anchor delivers funds to a receiving
// anchor on behalf of a user.
//
// The flow:
//   1. Sending client authenticates via SEP-10 → obtains JWT.
//   2. GET  /info           → discover supported assets & fields.
//   3. POST /transactions   → create a new cross-border payment
//      (includes receiver details, amount, asset).
//   4. The anchor returns a Stellar account + memo.  The sender
//      then submits a Stellar payment to that account.
//   5. GET  /transactions/:id → poll for status updates.
//
// This module wraps Steps 3–5.
//
// Reference: https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0031.md
// ============================================================

import fetch from "node-fetch";
import { resolveAnchorToml } from "./toml-resolver";
import { authenticate } from "./sep10-auth";

// ---------------------------------------------------------------
// Types
// ---------------------------------------------------------------

/** Fields describing the person or entity receiving the payment. */
export interface ReceiverFields {
  /** Full legal name of the receiver. */
  first_name?: string;
  last_name?: string;

  /** Receiver's email (some anchors require this for notifications). */
  email?: string;

  /** Receiver's bank account or mobile money identifier. */
  bank_account?: string;
  bank_routing?: string;

  /** For mobile-money corridors. */
  mobile_number?: string;

  /** Country code (ISO 3166-1 alpha-2). */
  country?: string;

  /** Any additional fields the anchor requires (pass-through). */
  [key: string]: string | undefined;
}

/** Parameters for initiating a SEP-31 cross-border payment. */
export interface CrossBorderPaymentParams {
  /** The amount to send in the asset's units (e.g. "100.00"). */
  amount: string;

  /** The asset code (e.g. "USDC"). */
  asset_code: string;

  /** The asset issuer (G-address, required for non-native). */
  asset_issuer?: string;

  /** KYC/destination fields about the person receiving the funds. */
  receiver: ReceiverFields;

  /** Optional: fields about the sender for compliance. */
  sender?: ReceiverFields;
}

/** The anchor's response after creating a SEP-31 transaction. */
export interface CrossBorderTransactionResponse {
  /** The unique anchor-assigned transaction ID. */
  id: string;

  /**
   * The Stellar account address the sender should pay into.
   * This is the anchor's receiving account on the Stellar network.
   */
  stellar_account_id: string;

  /**
   * A memo to attach to the Stellar payment transaction so the
   * anchor can match the on-chain payment to this transaction.
   */
  stellar_memo: string;

  /** The memo type — typically "hash" or "text". */
  stellar_memo_type: "text" | "hash" | "id";
}

/** Status of a SEP-31 transaction, returned by GET /transactions/:id. */
export interface CrossBorderTransactionStatus {
  id: string;
  status:
    | "pending_sender"
    | "pending_stellar"
    | "pending_receiver"
    | "pending_external"
    | "completed"
    | "error";
  status_eta?: number;
  amount_in?: string;
  amount_out?: string;
  amount_fee?: string;
  stellar_transaction_id?: string;
  external_transaction_id?: string;
  message?: string;
  started_at?: string;
  completed_at?: string;
}

// ---------------------------------------------------------------
// initiatePayment — Create a SEP-31 cross-border payment
// ---------------------------------------------------------------

/**
 * Creates a new cross-border payment via SEP-31.
 *
 * The anchor will return a Stellar account + memo.  After calling
 * this function, the sending institution must submit a Stellar
 * payment transaction to that account with the given memo.
 *
 * @param params  Payment parameters (amount, asset, receiver info).
 * @returns       Transaction details including the Stellar account to pay.
 *
 * @example
 * ```ts
 * const tx = await initiatePayment({
 *   amount: "100.00",
 *   asset_code: "USDC",
 *   asset_issuer: "GA5ZSE...",
 *   receiver: {
 *     first_name: "Jane",
 *     last_name: "Doe",
 *     bank_account: "123456789",
 *     country: "NG",
 *   },
 * });
 * console.log("Send USDC to:", tx.stellar_account_id);
 * console.log("With memo:", tx.stellar_memo);
 * ```
 */
export async function initiatePayment(
  params: CrossBorderPaymentParams
): Promise<CrossBorderTransactionResponse> {
  // ── Authenticate with the receiving anchor via SEP-10 ──
  const jwt = await authenticate();
  const toml = await resolveAnchorToml();
  const url = `${toml.DIRECT_PAYMENT_SERVER}/transactions`;

  console.log(
    `[sep31] Initiating cross-border payment: ` +
      `${params.amount} ${params.asset_code}`
  );

  // ── Build the request body ──
  // SEP-31 POST /transactions expects a JSON body with the
  // payment amount, asset, and nested "fields" objects for
  // receiver (and optionally sender) KYC data.
  const body: Record<string, unknown> = {
    amount: params.amount,
    asset_code: params.asset_code,
    fields: {
      transaction: {
        receiver_routing_number: params.receiver.bank_routing,
        receiver_account_number: params.receiver.bank_account,
      },
      receiver: { ...params.receiver },
    },
  };

  // Include asset_issuer for non-native assets
  if (params.asset_issuer) {
    body.asset_issuer = params.asset_issuer;
  }

  // Include sender fields if provided (some anchors require it)
  if (params.sender) {
    (body.fields as Record<string, unknown>).sender = { ...params.sender };
  }

  // ── POST the transaction ──
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(
      `[sep31] Payment initiation failed: ${res.status} — ${errorBody}`
    );
  }

  const data = (await res.json()) as CrossBorderTransactionResponse;

  console.log(`[sep31] Cross-border payment created successfully.`);
  console.log(`  Transaction ID      : ${data.id}`);
  console.log(`  Pay to Stellar Acct : ${data.stellar_account_id}`);
  console.log(`  Memo (${data.stellar_memo_type}): ${data.stellar_memo}`);

  return data;
}

// ---------------------------------------------------------------
// getPaymentStatus — Check the status of a SEP-31 transaction
// ---------------------------------------------------------------

/**
 * Queries the status of a previously initiated SEP-31 transaction.
 *
 * After the on-chain Stellar payment is submitted, poll this
 * endpoint to track whether the anchor has completed delivery
 * to the receiver's off-chain account (bank, mobile money, etc.).
 *
 * @param transactionId  The ID returned by initiatePayment.
 * @returns              Current transaction status.
 *
 * @example
 * ```ts
 * const status = await getPaymentStatus("tx-uuid-here");
 * if (status.status === "completed") {
 *   console.log("Delivery confirmed!");
 * }
 * ```
 */
export async function getPaymentStatus(
  transactionId: string
): Promise<CrossBorderTransactionStatus> {
  const jwt = await authenticate();
  const toml = await resolveAnchorToml();
  const url = `${toml.DIRECT_PAYMENT_SERVER}/transactions/${transactionId}`;

  console.log(`[sep31] Polling payment status: ${transactionId}`);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(
      `[sep31] Status query failed: ${res.status} — ${errorBody}`
    );
  }

  const data = (await res.json()) as {
    transaction: CrossBorderTransactionStatus;
  };

  console.log(
    `[sep31] Transaction ${transactionId} → status: ${data.transaction.status}`
  );

  return data.transaction;
}
