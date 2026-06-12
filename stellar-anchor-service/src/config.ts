// ============================================================
// config.ts — Centralised configuration for the AnchorFlow
//             Stellar backend service.
//
// Loads environment variables from .env and exposes typed,
// validated configuration objects used across all SEP modules.
// ============================================================

import dotenv from "dotenv";
import {
  Keypair,
  Networks,
} from "@stellar/stellar-sdk";

// Load .env before anything else
dotenv.config();

// ---------------------------------------------------------------
// Helper: read an env var or throw with a clear message
// ---------------------------------------------------------------
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Copy .env.example → .env and fill in all values.`
    );
  }
  return value;
}

// ---------------------------------------------------------------
// Stellar Network Configuration
// ---------------------------------------------------------------
const networkName = (process.env.STELLAR_NETWORK ?? "testnet").toLowerCase();

/** The Stellar network passphrase (determines which chain we sign for). */
export const NETWORK_PASSPHRASE =
  networkName === "public" ? Networks.PUBLIC : Networks.TESTNET;

/** Horizon server URL — the RPC gateway to the Stellar ledger. */
export const HORIZON_URL =
  networkName === "public"
    ? "https://horizon.stellar.org"
    : "https://horizon-testnet.stellar.org";

// ---------------------------------------------------------------
// Client Keypair
// ---------------------------------------------------------------

/** The secret key of the account we use to authenticate with anchors. */
export const CLIENT_SECRET = requireEnv("STELLAR_SECRET_KEY");

/** Derived Keypair instance (contains both public + secret). */
export const CLIENT_KEYPAIR = Keypair.fromSecret(CLIENT_SECRET);

/** The G-address of the client account. */
export const CLIENT_PUBLIC_KEY = CLIENT_KEYPAIR.publicKey();

// ---------------------------------------------------------------
// Anchor Configuration
// ---------------------------------------------------------------

/**
 * The "home domain" of the Stellar Anchor we want to interact with.
 * The stellar.toml file is served at:
 *   https://<ANCHOR_DOMAIN>/.well-known/stellar.toml
 *
 * That TOML tells us where the SEP-10, SEP-24, and SEP-31 servers live.
 */
export const ANCHOR_DOMAIN = requireEnv("ANCHOR_DOMAIN");

/** Convenience URL to the anchor's stellar.toml */
export const TOML_URL = `https://${ANCHOR_DOMAIN}/.well-known/stellar.toml`;

// ---------------------------------------------------------------
// Server
// ---------------------------------------------------------------

/** Port for the Express HTTP server. */
export const PORT = parseInt(process.env.PORT ?? "3001", 10);
