// ============================================================
// sep24-service.ts — SEP-24: Interactive Deposit & Withdrawal
//
// SEP-24 enables fiat-to-crypto on-ramping (deposit) and
// crypto-to-fiat off-ramping (withdrawal) through an
// anchor-hosted interactive web UI.
//
// The flow:
//   1. Client authenticates via SEP-10 → obtains JWT.
//   2. Client POSTs to /transactions/deposit/interactive
//      or /transactions/withdraw/interactive with the JWT.
//   3. Anchor responds with a URL to an interactive web page
//      where the user completes KYC, enters bank details, etc.
//   4. Client polls /transaction?id=<id> for status updates.
//
// This module wraps Steps 2–4 with clean TypeScript interfaces.
//
// Reference: https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md
// ============================================================

import fetch from "node-fetch";
import { resolveAnchorToml } from "./toml-resolver";
import { authenticate } from "./sep10-auth";
import { CLIENT_PUBLIC_KEY } from "./config";

// ---------------------------------------------------------------
// Types
// ---------------------------------------------------------------

/** Parameters for initiating a SEP-24 interactive deposit. */
export interface DepositParams {
  /** The asset code to deposit (e.g. "USDC", "XLM"). */
  asset_code: string;

  /**
   * The Stellar asset issuer address.
   * Required for non-native assets. For XLM, leave undefined.
   */
  asset_issuer?: string;

  /** The fiat amount the user wants to deposit (optional hint). */
  amount?: string;

  /** Email hint for the anchor's KYC flow (optional). */
  email_address?: string;
}

/** Parameters for initiating a SEP-24 interactive withdrawal. */
export interface WithdrawParams {
  /** The asset code to withdraw (e.g. "USDC"). */
  asset_code: string;

  /** The Stellar asset issuer address (required for non-native). */
  asset_issuer?: string;

  /** The withdrawal amount in the asset's units (optional hint). */
  amount?: string;

  /** The withdrawal destination type, e.g. "bank_account". */
  dest?: string;
}

/** The anchor's response to a deposit/withdraw initiation. */
export interface InteractiveResponse {
  /** The type of response — always "interactive_customer_info_needed". */
  type: string;

  /** The URL the end-user should be redirected to. */
  url: string;

  /** The unique transaction ID to track this operation. */
  id: string;
}

/** A single transaction's status from the /transaction endpoint. */
export interface TransactionStatus {
  id: string;
  kind: "deposit" | "withdrawal";
  status:
    | "incomplete"
    | "pending_user_transfer_start"
    | "pending_anchor"
    | "pending_stellar"
    | "pending_external"
    | "completed"
    | "error";
  status_eta?: number;
  amount_in?: string;
  amount_out?: string;
  amount_fee?: string;
  started_at?: string;
  completed_at?: string;
  stellar_transaction_id?: string;
  external_transaction_id?: string;
  message?: string;
  more_info_url?: string;
}

// ---------------------------------------------------------------
// initiateDeposit — Start a SEP-24 interactive deposit
// ---------------------------------------------------------------

/**
 * Initiates a SEP-24 interactive deposit.
 *
 * The anchor will return a URL to a hosted web page where the
 * user can complete KYC and provide payment details (e.g. bank
 * transfer, credit card).
 *
 * After the user completes the flow, the anchor will credit the
 * user's Stellar account with the corresponding crypto asset.
 *
 * @param params  Deposit parameters (asset code, optional amount).
 * @returns       An InteractiveResponse containing the redirect URL.
 *
 * @example
 * ```ts
 * const result = await initiateDeposit({ asset_code: "USDC" });
 * console.log("Redirect user to:", result.url);
 * console.log("Track with ID:", result.id);
 * ```
 */
export async function initiateDeposit(
  params: DepositParams
): Promise<InteractiveResponse> {
  // ── Authenticate first (SEP-10) ──
  const jwt = await authenticate();
  const toml = await resolveAnchorToml();
  const url = `${toml.TRANSFER_SERVER_SEP0024}/transactions/deposit/interactive`;

  console.log(`[sep24] Initiating deposit for ${params.asset_code}`);

  // ── Build the form data ──
  // SEP-24 expects application/x-www-form-urlencoded or
  // multipart/form-data.  We use URLSearchParams for simplicity.
  const formData = new URLSearchParams();
  formData.append("asset_code", params.asset_code);
  formData.append("account", CLIENT_PUBLIC_KEY);

  // Optional fields — only include if provided
  if (params.asset_issuer) formData.append("asset_issuer", params.asset_issuer);
  if (params.amount) formData.append("amount", params.amount);
  if (params.email_address) formData.append("email_address", params.email_address);

  // ── POST to the anchor's deposit endpoint ──
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[sep24] Deposit initiation failed: ${res.status} — ${body}`);
  }

  const data = (await res.json()) as InteractiveResponse;

  console.log(`[sep24] Deposit initiated successfully.`);
  console.log(`  Transaction ID : ${data.id}`);
  console.log(`  Interactive URL: ${data.url}`);

  return data;
}

// ---------------------------------------------------------------
// initiateWithdraw — Start a SEP-24 interactive withdrawal
// ---------------------------------------------------------------

/**
 * Initiates a SEP-24 interactive withdrawal (off-ramp).
 *
 * The anchor returns a URL where the user enters their bank
 * details or other off-ramp destination.  The user then sends
 * the crypto asset to the anchor's Stellar account, and the
 * anchor disburses fiat.
 *
 * @param params  Withdrawal parameters.
 * @returns       An InteractiveResponse containing the redirect URL.
 *
 * @example
 * ```ts
 * const result = await initiateWithdraw({
 *   asset_code: "USDC",
 *   amount: "50.00",
 * });
 * console.log("Redirect user to:", result.url);
 * ```
 */
export async function initiateWithdraw(
  params: WithdrawParams
): Promise<InteractiveResponse> {
  const jwt = await authenticate();
  const toml = await resolveAnchorToml();
  const url = `${toml.TRANSFER_SERVER_SEP0024}/transactions/withdraw/interactive`;

  console.log(`[sep24] Initiating withdrawal for ${params.asset_code}`);

  const formData = new URLSearchParams();
  formData.append("asset_code", params.asset_code);
  formData.append("account", CLIENT_PUBLIC_KEY);

  if (params.asset_issuer) formData.append("asset_issuer", params.asset_issuer);
  if (params.amount) formData.append("amount", params.amount);
  if (params.dest) formData.append("dest", params.dest);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[sep24] Withdraw initiation failed: ${res.status} — ${body}`);
  }

  const data = (await res.json()) as InteractiveResponse;

  console.log(`[sep24] Withdrawal initiated successfully.`);
  console.log(`  Transaction ID : ${data.id}`);
  console.log(`  Interactive URL: ${data.url}`);

  return data;
}

// ---------------------------------------------------------------
// getTransactionStatus — Poll a SEP-24 transaction
// ---------------------------------------------------------------

/**
 * Queries the status of a previously initiated SEP-24 transaction.
 *
 * Use this to poll the anchor for updates after the user has
 * completed the interactive flow.
 *
 * @param transactionId  The ID returned by initiateDeposit/initiateWithdraw.
 * @returns              The current transaction status.
 *
 * @example
 * ```ts
 * const status = await getTransactionStatus("abc123");
 * if (status.status === "completed") {
 *   console.log("Funds arrived! Stellar TX:", status.stellar_transaction_id);
 * }
 * ```
 */
export async function getTransactionStatus(
  transactionId: string
): Promise<TransactionStatus> {
  const jwt = await authenticate();
  const toml = await resolveAnchorToml();
  const url = `${toml.TRANSFER_SERVER_SEP0024}/transaction?id=${transactionId}`;

  console.log(`[sep24] Polling transaction status: ${transactionId}`);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `[sep24] Transaction status query failed: ${res.status} — ${body}`
    );
  }

  const data = (await res.json()) as { transaction: TransactionStatus };

  console.log(`[sep24] Transaction ${transactionId} → status: ${data.transaction.status}`);

  return data.transaction;
}
