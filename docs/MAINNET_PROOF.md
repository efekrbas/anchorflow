# Transaction Proof — AnchorFlow

**Product:** AnchorFlow
**Network:** Stellar Testnet
**Period:** June 2026

---

## Transaction Proof

| Field | Value |
|-------|-------|
| **Network** | Stellar Testnet |
| **TX Hash** | `b502cc155c2edfd89eb9d6c47d25e257acec1bb7db142c506e141d29ca6dae9e` |
| **Ledger** | 3121042 |
| **Type** | Payment (XLM) |
| **Amount** | 10 XLM |
| **Memo** | AnchorFlow-TestTX |
| **Date** | 2026-06-16 |
| **Explorer Link** | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/b502cc155c2edfd89eb9d6c47d25e257acec1bb7db142c506e141d29ca6dae9e) |

### Public Key Used
```
GAJ7PXVTF2ECVDRXFIFDD4ZUI6WEU6RDDG7YP2ISZND66Y735OC76BBK
```

---

## Escrow Smart Contract (Testnet Deployment)

The AnchorFlow Soroban escrow smart contract has been deployed and tested on Stellar Testnet. The contract supports:

- **Deposit** — Lock funds into escrow
- **Release** — Transfer funds to receiver + platform fee
- **Refund** — Return funds to sender

Contract interactions are verified through the Soroban RPC and Stellar Horizon Testnet API.

---

## Verification

All transactions are publicly verifiable:
- **Stellar Expert (Testnet):** https://stellar.expert/explorer/testnet
- **Horizon Testnet API:** https://horizon-testnet.stellar.org/transactions/b502cc155c2edfd89eb9d6c47d25e257acec1bb7db142c506e141d29ca6dae9e

---

> **Note:** AnchorFlow is currently operating on Stellar Testnet. Mainnet migration is planned for Phase 3 of the roadmap upon completion of a security audit.
