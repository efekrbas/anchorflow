// ============================================================
// toml-resolver.ts — Resolves a Stellar Anchor's stellar.toml
//
// Every compliant Stellar Anchor publishes a TOML file at:
//   https://<domain>/.well-known/stellar.toml
//
// This file advertises the URLs for its SEP services:
//   - WEB_AUTH_ENDPOINT   → SEP-10 authentication
//   - TRANSFER_SERVER_SEP0024 → SEP-24 interactive deposit/withdraw
//   - DIRECT_PAYMENT_SERVER   → SEP-31 cross-border payments
//
// We parse this TOML (it's simple enough to do with regex for
// the fields we need) and cache the result in memory.
// ============================================================

import fetch from "node-fetch";
import { TOML_URL } from "./config";

// ---------------------------------------------------------------
// Types
// ---------------------------------------------------------------

/** The subset of stellar.toml fields that AnchorFlow cares about. */
export interface AnchorToml {
  /** SEP-10 challenge endpoint (e.g. https://anchor.example.com/auth) */
  WEB_AUTH_ENDPOINT: string;

  /** SEP-24 transfer server (interactive deposit / withdrawal) */
  TRANSFER_SERVER_SEP0024: string;

  /** SEP-31 direct payment server (cross-border) */
  DIRECT_PAYMENT_SERVER: string;

  /** The Stellar public key the anchor uses to sign SEP-10 challenges */
  SIGNING_KEY: string;
}

// ---------------------------------------------------------------
// In-memory cache so we don't re-fetch the TOML on every request
// ---------------------------------------------------------------
let cachedToml: AnchorToml | null = null;

// ---------------------------------------------------------------
// parseStellarToml — lightweight key=value TOML parser
// ---------------------------------------------------------------

/**
 * Parses a minimal subset of a stellar.toml file.
 *
 * Full TOML parsing libraries exist, but for the handful of
 * top-level string fields we need, a simple regex is fine and
 * avoids an extra dependency.
 */
function parseStellarToml(raw: string): AnchorToml {
  // Helper: extract a top-level KEY = "value" pair
  const extract = (key: string): string => {
    //  Match:  KEY = "some value"   (with optional whitespace)
    const regex = new RegExp(`^${key}\\s*=\\s*"([^"]+)"`, "m");
    const match = raw.match(regex);
    if (!match) {
      throw new Error(
        `stellar.toml is missing required field: ${key}. ` +
          `Make sure the anchor at ${TOML_URL} is SEP-compliant.`
      );
    }
    return match[1];
  };

  return {
    WEB_AUTH_ENDPOINT: extract("WEB_AUTH_ENDPOINT"),
    TRANSFER_SERVER_SEP0024: extract("TRANSFER_SERVER_SEP0024"),
    DIRECT_PAYMENT_SERVER: extract("DIRECT_PAYMENT_SERVER"),
    SIGNING_KEY: extract("SIGNING_KEY"),
  };
}

// ---------------------------------------------------------------
// resolveAnchorToml — fetch + parse + cache
// ---------------------------------------------------------------

/**
 * Fetches the anchor's `stellar.toml`, parses it, and caches the
 * result. Subsequent calls return the cached copy unless `force`
 * is set to `true`.
 *
 * @param force  If true, bypass the cache and re-fetch.
 * @returns      The parsed AnchorToml object.
 *
 * @example
 * ```ts
 * const toml = await resolveAnchorToml();
 * console.log(toml.WEB_AUTH_ENDPOINT);
 * // → "https://testanchor.stellar.org/auth"
 * ```
 */
export async function resolveAnchorToml(
  force = false
): Promise<AnchorToml> {
  // Return cached version if available
  if (cachedToml && !force) {
    return cachedToml;
  }

  console.log(`[toml-resolver] Fetching stellar.toml from ${TOML_URL}`);

  const response = await fetch(TOML_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch stellar.toml: HTTP ${response.status} ${response.statusText}`
    );
  }

  const raw = await response.text();
  cachedToml = parseStellarToml(raw);

  console.log("[toml-resolver] Resolved anchor endpoints:");
  console.log(`  WEB_AUTH_ENDPOINT        = ${cachedToml.WEB_AUTH_ENDPOINT}`);
  console.log(`  TRANSFER_SERVER_SEP0024  = ${cachedToml.TRANSFER_SERVER_SEP0024}`);
  console.log(`  DIRECT_PAYMENT_SERVER    = ${cachedToml.DIRECT_PAYMENT_SERVER}`);
  console.log(`  SIGNING_KEY              = ${cachedToml.SIGNING_KEY}`);

  return cachedToml;
}
