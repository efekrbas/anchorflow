// ============================================================
// sep10-auth.ts — SEP-10: Web Authentication
//
// SEP-10 defines a challenge/response protocol that lets a
// client prove it controls a Stellar account without ever
// revealing its secret key.
//
// The flow:
//   1. GET  <WEB_AUTH_ENDPOINT>?account=G...
//      → Anchor returns a Stellar "challenge" transaction
//        (a specially crafted manage_data operation).
//
//   2. Client signs the challenge with its secret key.
//
//   3. POST <WEB_AUTH_ENDPOINT>  { transaction: <signed XDR> }
//      → Anchor verifies the signature and returns a JWT.
//
//   4. The JWT is used as a Bearer token for all subsequent
//      SEP-24 and SEP-31 requests.
//
// Reference: https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md
// ============================================================

import fetch from "node-fetch";
import {
  Keypair,
  TransactionBuilder,
  Networks,
} from "@stellar/stellar-sdk";

import {
  CLIENT_KEYPAIR,
  CLIENT_PUBLIC_KEY,
  NETWORK_PASSPHRASE,
} from "./config";
import { resolveAnchorToml } from "./toml-resolver";

// ---------------------------------------------------------------
// In-memory JWT cache
// We store the token and its approximate expiry so we can reuse
// it across requests without re-authenticating every time.
// ---------------------------------------------------------------
let cachedJwt: string | null = null;
let jwtExpiresAt: number = 0; // Unix timestamp in ms

// ---------------------------------------------------------------
// authenticate — Full SEP-10 flow
// ---------------------------------------------------------------

/**
 * Performs the complete SEP-10 authentication handshake:
 *   1. Fetches the challenge from the anchor's WEB_AUTH_ENDPOINT.
 *   2. Signs the challenge transaction with the client keypair.
 *   3. Submits the signed transaction back to the anchor.
 *   4. Returns (and caches) the resulting JWT.
 *
 * If a valid cached JWT exists, it is returned immediately.
 *
 * @returns  A JWT string suitable for use as `Authorization: Bearer <jwt>`.
 *
 * @example
 * ```ts
 * const jwt = await authenticate();
 * // Use jwt in subsequent SEP-24/SEP-31 calls
 * ```
 */
export async function authenticate(): Promise<string> {
  // ── Return cached token if still valid (with 60s safety margin) ──
  if (cachedJwt && Date.now() < jwtExpiresAt - 60_000) {
    console.log("[sep10] Reusing cached JWT.");
    return cachedJwt;
  }

  const toml = await resolveAnchorToml();
  const authEndpoint = toml.WEB_AUTH_ENDPOINT;

  console.log(`[sep10] Starting authentication against ${authEndpoint}`);

  // ── Step 1: Request the challenge transaction ──────────────────
  // The anchor creates a Stellar transaction containing a
  // manage_data operation with the anchor's domain.  It is NOT
  // submitted to the network — it is only used to prove identity.
  const challengeUrl = `${authEndpoint}?account=${CLIENT_PUBLIC_KEY}`;
  console.log(`[sep10] GET ${challengeUrl}`);

  const challengeRes = await fetch(challengeUrl);
  if (!challengeRes.ok) {
    const body = await challengeRes.text();
    throw new Error(
      `[sep10] Challenge request failed: ${challengeRes.status} — ${body}`
    );
  }

  const challengeJson = (await challengeRes.json()) as {
    transaction: string;
    network_passphrase: string;
  };

  // Sanity-check: make sure the anchor is on the same network
  if (challengeJson.network_passphrase !== NETWORK_PASSPHRASE) {
    throw new Error(
      `[sep10] Network mismatch! Expected "${NETWORK_PASSPHRASE}" ` +
        `but anchor returned "${challengeJson.network_passphrase}".`
    );
  }

  console.log("[sep10] Received challenge transaction. Signing...");

  // ── Step 2: Deserialize and sign the challenge ──────────────────
  // The challenge comes as base64-encoded XDR (envelope).
  // We deserialize it, sign it with our secret key, and
  // serialize it back to XDR.
  const transaction = TransactionBuilder.fromXDR(
    challengeJson.transaction,
    NETWORK_PASSPHRASE
  );

  // Sign with our keypair — this proves we control the account
  transaction.sign(CLIENT_KEYPAIR);

  // Re-serialize to XDR for submission
  const signedXdr = transaction.toXDR();

  // ── Step 3: Submit the signed challenge for a JWT ───────────────
  console.log("[sep10] Submitting signed challenge...");

  const tokenRes = await fetch(authEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transaction: signedXdr }),
  });

  if (!tokenRes.ok) {
    const body = await tokenRes.text();
    throw new Error(
      `[sep10] Token request failed: ${tokenRes.status} — ${body}`
    );
  }

  const tokenJson = (await tokenRes.json()) as { token: string };
  const jwt = tokenJson.token;

  // ── Step 4: Cache the JWT ───────────────────────────────────────
  // SEP-10 JWTs typically expire in ~5 minutes (300s).
  // We cache it with a conservative 4-minute window.
  cachedJwt = jwt;
  jwtExpiresAt = Date.now() + 4 * 60 * 1000;

  console.log("[sep10] Authentication successful. JWT obtained.");

  return jwt;
}

/**
 * Clears the cached JWT. Useful for testing or when the anchor
 * invalidates tokens server-side.
 */
export function clearAuthCache(): void {
  cachedJwt = null;
  jwtExpiresAt = 0;
  console.log("[sep10] Auth cache cleared.");
}
