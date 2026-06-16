// ============================================================
// anchor-info.ts — Queries an Anchor's /info endpoint
//
// Both SEP-24 and SEP-31 define an /info endpoint that returns
// the assets, currencies, fees, and capabilities the anchor
// supports.
//
// This module provides typed helpers to query both.
// ============================================================

import fetch from "node-fetch";
import { resolveAnchorToml } from "./toml-resolver";

// ---------------------------------------------------------------
// Types — SEP-24 /info response
// ---------------------------------------------------------------

/**
 * Per-asset information returned by SEP-24 /info.
 *
 * Each asset (e.g. "USDC", "EURC", "XLM") describes whether deposit
 * and/or withdrawal is enabled, and any fee structure.
 */
export interface Sep24AssetInfo {
  enabled: boolean;
  authentication_required?: boolean;
  min_amount?: number;
  max_amount?: number;
  fee_fixed?: number;
  fee_percent?: number;
}

/** Top-level shape of the SEP-24 /info response. */
export interface Sep24InfoResponse {
  deposit: Record<string, Sep24AssetInfo>;
  withdraw: Record<string, Sep24AssetInfo>;
  fee: { enabled: boolean; authentication_required?: boolean };
  features?: { account_creation: boolean; claimable_balances: boolean };
}

// ---------------------------------------------------------------
// Types — SEP-31 /info response
// ---------------------------------------------------------------

/**
 * Per-asset information for SEP-31 receiving.
 *
 * SEP-31 anchors list which assets they can receive and the
 * required fields for the sender and receiver.
 */
export interface Sep31AssetInfo {
  enabled: boolean;
  min_amount?: number;
  max_amount?: number;
  fee_fixed?: number;
  fee_percent?: number;
  /** KYC fields required for the sender of the payment */
  sender_sep12_type?: string;
  /** KYC fields required for the receiver of the payment */
  receiver_sep12_type?: string;
}

/** Top-level shape of the SEP-31 /info response. */
export interface Sep31InfoResponse {
  receive: Record<string, Sep31AssetInfo>;
}

// ---------------------------------------------------------------
// getSep24Info — Query the SEP-24 anchor's /info endpoint
// ---------------------------------------------------------------

/**
 * Fetches the SEP-24 `/info` endpoint to discover which assets
 * the anchor supports for interactive deposit and withdrawal,
 * along with fee structures and feature flags.
 *
 * This endpoint does NOT require authentication.
 *
 * @returns  Parsed SEP-24 info response.
 *
 * @example
 * ```ts
 * const info = await getSep24Info();
 * console.log(info.deposit["USDC", "EURC"]); // { enabled: true, ... }
 * ```
 */
export async function getSep24Info(): Promise<Sep24InfoResponse> {
  const toml = await resolveAnchorToml();
  const url = `${toml.TRANSFER_SERVER_SEP0024}/info`;

  console.log(`[anchor-info] Fetching SEP-24 /info from ${url}`);

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `[anchor-info] SEP-24 /info failed: ${res.status} — ${body}`
    );
  }

  const data = (await res.json()) as Sep24InfoResponse;

  // Log discovered assets for convenience
  console.log("[anchor-info] SEP-24 deposit assets:");
  for (const [asset, info] of Object.entries(data.deposit)) {
    console.log(`  ${asset}: enabled=${info.enabled}`);
  }
  console.log("[anchor-info] SEP-24 withdraw assets:");
  for (const [asset, info] of Object.entries(data.withdraw)) {
    console.log(`  ${asset}: enabled=${info.enabled}`);
  }

  return data;
}

// ---------------------------------------------------------------
// getSep31Info — Query the SEP-31 anchor's /info endpoint
// ---------------------------------------------------------------

/**
 * Fetches the SEP-31 `/info` endpoint to discover which assets
 * the anchor can receive for cross-border payments, along with
 * fee structures and KYC requirements.
 *
 * This endpoint does NOT require authentication.
 *
 * @returns  Parsed SEP-31 info response.
 *
 * @example
 * ```ts
 * const info = await getSep31Info();
 * console.log(info.receive["USDC", "EURC"]); // { enabled: true, ... }
 * ```
 */
export async function getSep31Info(): Promise<Sep31InfoResponse> {
  const toml = await resolveAnchorToml();
  const url = `${toml.DIRECT_PAYMENT_SERVER}/info`;

  console.log(`[anchor-info] Fetching SEP-31 /info from ${url}`);

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `[anchor-info] SEP-31 /info failed: ${res.status} — ${body}`
    );
  }

  const data = (await res.json()) as Sep31InfoResponse;

  // Log discovered assets
  console.log("[anchor-info] SEP-31 receivable assets:");
  for (const [asset, info] of Object.entries(data.receive)) {
    console.log(`  ${asset}: enabled=${info.enabled}`);
  }

  return data;
}

