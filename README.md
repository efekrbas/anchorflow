<p align="center">
  <img src="https://img.shields.io/badge/Stellar-Soroban-blue?style=for-the-badge&logo=stellar&logoColor=white" />
  <img src="https://img.shields.io/badge/Rust-Smart%20Contract-orange?style=for-the-badge&logo=rust&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-Backend-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-Dashboard-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

<h1 align="center">⚡ AnchorFlow</h1>

<p align="center">
  <strong>Micro-Remittance & Cross-Border Payment Platform</strong><br/>
  <em>Powered by Stellar Network & Soroban Smart Contracts</em>
</p>

<p align="center">
  <a href="#-problem">Problem</a> •
  <a href="#-solution">Solution</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-smart-contract">Smart Contract</a> •
  <a href="#-sep-services">SEP Services</a> •
  <a href="#-dashboard">Dashboard</a> •
  <a href="#-milestones">Milestones</a> •
  <a href="#-license">License</a>
</p>

---

## 🔴 Problem

Cross-border money transfers in developing countries are burdened by **extremely high fees** (averaging 6–9%) and **painfully slow settlement times** (2–5 business days). The legacy banking infrastructure and correspondent bank networks create:

- 💸 **High Fees** — Commission rates on small-value transfers (micro-remittances) can exceed 10%
- 🕐 **Slow Settlement** — SWIFT-based transfers take 2–5 business days to clear
- 🚫 **Access Barriers** — The unbanked population has virtually no access to digital transfer channels
- 📋 **Complex Compliance** — KYC/AML regulations vary by country, making onboarding lengthy and fragmented

These issues disproportionately affect migrant worker remittances in regions like Turkey, Sub-Saharan Africa, and Southeast Asia — corridors where every dollar of fees reduces the amount that families receive.

---

## 🟢 Solution (Stellar Alignment)

**AnchorFlow** leverages Stellar's ultra-low transaction fees (~$0.00001) and **Soroban smart contracts** to build a platform that converts local fiat currencies into digital dollars (USDC) via licensed Anchors (SEP-24/31) and executes instant micro-transfers through a secure on-chain escrow.

```
Sender (Fiat ₺/€) ──► Anchor (SEP-24) ──► USDC on Stellar ──► Soroban Escrow ──► Receiver Anchor (SEP-31) ──► Receiver (Fiat ₦/KES)
```

### How It Works

1. **Fiat → Digital Dollar (On-Ramp):** The sender converts their local currency (TRY, EUR, etc.) into USDC through a Stellar Anchor using the **SEP-24** interactive deposit protocol.

2. **Smart Contract Escrow:** Funds are locked into the **AnchorFlow Escrow** smart contract on Soroban. The contract:
   - Securely holds funds under a unique transaction ID
   - Keeps funds locked until compliance/delivery conditions are verified by a designated arbiter
   - Automatically splits the platform fee from the principal (Payment Splitter)

3. **Cross-Border Transfer (SEP-31):** Once compliance is approved, funds are sent to the receiving-side Anchor via the **SEP-31** direct payment protocol.

4. **Digital Dollar → Fiat (Off-Ramp):** The receiving Anchor converts USDC back to the local currency and disburses it to the recipient's bank account or mobile wallet.

### Why Stellar?

| Feature | Stellar Advantage |
|---------|-------------------|
| Transaction Fee | ~$0.00001 (traditional: $5–50) |
| Settlement Time | ~5 seconds (traditional: 2–5 days) |
| Smart Contracts | Soroban enables secure escrow & automated payment splitting |
| Anchor Network | SEP-24/31 provides a global fiat on/off ramp infrastructure |
| Compliance | Built-in KYC/AML integration via SEP-12 |

---

## 🛠 Tech Stack

| Layer | Technology | Description |
|-------|------------|-------------|
| **Smart Contract** | Soroban (Rust) | Escrow & Payment Splitter smart contract |
| **Backend** | TypeScript / Node.js / Express | SEP-10/24/31 Anchor integration service |
| **Frontend** | HTML5, Tailwind CSS, JavaScript | Dashboard UI — transaction history & Send Money |
| **Blockchain SDK** | Stellar SDK (`@stellar/stellar-sdk`) | Horizon API, transaction building, keypair management |
| **API** | Stellar Horizon API | Ledger queries, transaction history, account info |
| **Protocols** | SEP-10, SEP-24, SEP-31 | Web Auth, Interactive Deposit/Withdraw, Cross-Border |

---

## 🏗 Architecture

```
anchor_flow/
│
├── src/                          # 🦀 Soroban Smart Contract (Rust)
│   ├── lib.rs                    #    Escrow & Payment Splitter contract
│   └── test.rs                   #    Unit tests
│
├── stellar-anchor-service/       # 🟦 TypeScript Backend Service
│   └── src/
│       ├── config.ts             #    Environment configuration
│       ├── toml-resolver.ts      #    stellar.toml discovery & caching
│       ├── sep10-auth.ts         #    SEP-10 Web Authentication
│       ├── anchor-info.ts        #    /info endpoint queries
│       ├── sep24-service.ts      #    SEP-24 Deposit & Withdrawal
│       ├── sep31-service.ts      #    SEP-31 Cross-Border Payments
│       └── index.ts              #    Express server (9 API routes)
│
├── dashboard/                    # 🎨 Frontend Dashboard
│   └── index.html                #    Transaction viewer & Send Money form
│
├── Cargo.toml                    #    Rust project manifest
└── README.md                     #    ← You are here
```

---

## 🚀 Quick Start

### Prerequisites

- [Rust](https://rustup.rs/) (stable toolchain)
- [Node.js](https://nodejs.org/) v18+
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup) (optional, for deployment)

### 1. Smart Contract

```bash
# Clone the repository
git clone https://github.com/<your-username>/anchorflow.git
cd anchorflow/anchor_flow

# Run tests
cargo test

# Compile to WASM (for deployment)
cargo build --target wasm32-unknown-unknown --release
```

### 2. Backend Service

```bash
cd stellar-anchor-service

# Create your .env file
cp .env.example .env
# Fill in STELLAR_SECRET_KEY, STELLAR_PUBLIC_KEY, and ANCHOR_DOMAIN

# Install dependencies
npm install

# Start the development server
npm run dev
# → http://localhost:3001
```

### 3. Dashboard

```bash
# Open dashboard/index.html directly in your browser
# or serve it with a Live Server extension
```

---

## 📜 Smart Contract

### AnchorFlow Escrow & Payment Splitter

The Soroban smart contract provides three core functions:

| Function | Description | Authorization |
|----------|-------------|---------------|
| `deposit()` | Lock funds into escrow under a unique TX ID | Sender |
| `release()` | Transfer funds to the receiver + platform fee to the platform | Arbiter |
| `refund()` | Return all funds back to the sender | Arbiter |

### State Machine

```
         deposit()          release()
[EMPTY] ─────────► [PENDING] ─────────► [COMPLETED]
                       │
                       │ refund()
                       ▼
                   [REFUNDED]
```

### Events (Indexer Support)

The contract emits Soroban events for every state transition, enabling off-chain indexers and analytics:

```
("escrow", "deposit", tx_id)  → Escrow struct
("escrow", "release", tx_id)  → Escrow struct
("escrow", "refund",  tx_id)  → Escrow struct
```

### Error Handling

| Code | Error | Description |
|------|-------|-------------|
| 1 | `EscrowAlreadyExists` | Cannot deposit with the same TX ID twice |
| 2 | `EscrowNotFound` | The given TX ID does not exist |
| 3 | `NotAuthorized` | Only the designated arbiter can release/refund |
| 4 | `InvalidStatus` | Escrow has already been completed or refunded |
| 5 | `InvalidAmount` | Amount must be greater than zero |

---

## 🌐 SEP Services

### API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check |
| `POST` | `/auth/sep10` | SEP-10 authentication (obtain JWT) |
| `POST` | `/auth/sep10/clear` | Clear cached JWT |
| `GET` | `/anchor/sep24/info` | Query anchor's supported assets (SEP-24) |
| `GET` | `/anchor/sep31/info` | Query cross-border supported assets (SEP-31) |
| `POST` | `/sep24/deposit` | Initiate interactive fiat→crypto deposit |
| `POST` | `/sep24/withdraw` | Initiate interactive crypto→fiat withdrawal |
| `GET` | `/sep24/transaction/:id` | Poll SEP-24 transaction status |
| `POST` | `/sep31/payment` | Initiate a cross-border payment |
| `GET` | `/sep31/transaction/:id` | Poll SEP-31 transaction status |

### Example Usage

```bash
# SEP-10 Authentication
curl -X POST http://localhost:3001/auth/sep10

# SEP-24 Deposit (Fiat → USDC)
curl -X POST http://localhost:3001/sep24/deposit \
  -H "Content-Type: application/json" \
  -d '{"asset_code": "USDC", "amount": "100.00"}'

# SEP-31 Cross-Border Payment
curl -X POST http://localhost:3001/sep31/payment \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "50.00",
    "asset_code": "USDC",
    "receiver": {
      "first_name": "Jane",
      "last_name": "Doe",
      "bank_account": "123456789",
      "country": "NG"
    }
  }'
```

---

## 🎨 Dashboard

A modern, dark-themed dashboard UI built with **Tailwind CSS v3**:

- 🔍 **Wallet Connection** — Enter any Stellar public key to query the account
- 📊 **Stats Cards** — XLM balance, transaction count, last activity, sequence number
- 📋 **Transaction History Table** — Fetches the last 10 transactions from the Horizon API (live data)
- 💸 **Send Money Form** — Calls the Soroban escrow `deposit` function
- 🔔 **Toast Notifications** — Success/error feedback
- 📱 **Fully Responsive** — Mobile and desktop compatible

---

## 🗺 Milestones

### Phase 1: Foundation ✅ (Current)
- [x] Soroban Escrow & Payment Splitter smart contract (Rust)
- [x] SEP-10/24/31 TypeScript backend service
- [x] Dashboard UI (Tailwind CSS + Horizon API integration)
- [x] Working prototype on Stellar Testnet

### Phase 2: Anchor Integration 🔄
- [ ] Partner with a Turkey-based Anchor for TRY on/off ramp
- [ ] Integrate a European Anchor for EUR support
- [ ] Implement SEP-12 (KYC) integration for full compliance infrastructure
- [ ] End-to-end Testnet demo (TRY → USDC → NGN)

### Phase 3: Mainnet & Growth 🚀
- [ ] Smart contract security audit
- [ ] Stellar **Mainnet** launch
- [ ] Apply for **Stellar Community Fund (SCF)** grant
- [ ] Mobile app (React Native)
- [ ] Africa corridor launch (Turkey ↔ Nigeria, Kenya)
- [ ] Batch payment and recurring transfer support

### Phase 4: Scale 🌍
- [ ] Expand to additional corridors (Southeast Asia, Latin America)
- [ ] Multi-asset support (EURC, TRYB)
- [ ] Merchant API — payment acceptance for businesses
- [ ] Analytics dashboard — transfer volume, corridor-level metrics

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <strong>AnchorFlow</strong> — Fast, affordable cross-border payments for everyone.<br/>
  <em>Built with ⚡ on Stellar & Soroban</em>
</p>
