# AnchorFlow Smart Contract Architecture

The core of AnchorFlow is a Soroban smart contract written in Rust.

## State Machine
- `EMPTY`: Initial state.
- `PENDING`: Funds locked by Sender.
- `COMPLETED`: Funds released by Arbiter.
- `REFUNDED`: Funds refunded by Arbiter.

## Functions
1. `deposit(env, from, to, amount)`
2. `release(env, tx_id)`
3. `refund(env, tx_id)`
