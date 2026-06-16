# AnchorFlow System Architecture

AnchorFlow is designed as a scalable, non-custodial micro-remittance platform leveraging the Stellar network and Soroban smart contracts. 

The architecture is divided into three primary layers: the Frontend Client, the Backend Anchor Service, and the On-Chain Smart Contracts.

---

## 1. Frontend Client (Dashboard)

The frontend is a lightweight, static client served globally via Vercel Edge Network.

- **Technology Stack:** HTML5, Tailwind CSS v3, Vanilla JavaScript.
- **Wallet Integration:** Integrates with Freighter and other Stellar wallets via `@stellar/freighter-api`.
- **Blockchain Interaction:** Uses `stellar-sdk` to read Horizon network data (balances, transaction history) and simulate/invoke Soroban smart contracts directly from the browser.
- **Design Pattern:** Glassmorphism UI with real-time DOM updates to ensure a seamless "Web2-like" user experience for non-technical users.

## 2. Backend Anchor Service (SEP Integration)

The backend acts as the compliance and liquidity bridge between fiat and the Stellar network.

- **Technology Stack:** Node.js, Express, TypeScript.
- **SEP-10 (Authentication):** Handles cryptographic challenge/response flows to verify user wallet ownership without requiring email/passwords.
- **SEP-24 (Hosted Deposit/Withdrawal):** Provides interactive web flows for users to deposit fiat (e.g., via bank transfer) and receive Stellar USDC/XLM, and vice versa.
- **SEP-31 (Cross-Border Payments):** Exposes APIs for sending partners to initiate compliant cross-border remittance transactions.
- **Compliance:** Integrates mock KYC/AML checks before authorizing large escrow releases.

## 3. On-Chain Smart Contracts (Soroban)

The core business logic for secure remittances is handled completely on-chain to remove counterparty risk.

- **Language:** Rust (compiled to WebAssembly).
- **Escrow Logic:** 
  1. Sender deposits funds (XLM/USDC) into the Soroban contract.
  2. Funds are locked.
  3. The platform (Arbiter) verifies off-chain fulfillment (e.g., cash pickup in destination country).
  4. Arbiter calls the `release` function, transferring funds to the receiver and deducting a micro-fee for the platform.
- **Security:** Built with strict authorization checks using `soroban_sdk::auth`.

---

## Data Flow Diagram

```text
[ User Wallet ] <--(SEP-10/24)--> [ Anchor Backend ] <--(Fiat)--> [ Traditional Bank ]
      |                                  |
   (Sign TX)                        (API Calls)
      |                                  |
      v                                  v
[ Stellar RPC / Horizon ] <====> [ Soroban Escrow Contract ]
```

## Future Roadmap
- Transition from Horizon API to the new Stellar RPC infrastructure for all reads.
- Implement Passkeys (WebAuthn) for wallet-less onboarding.
- Decentralize the Arbiter role using a multi-sig oracle network.
