#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, token, Address, Env, String,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    EscrowAlreadyExists = 1,
    EscrowNotFound = 2,
    NotAuthorized = 3,
    InvalidStatus = 4,
    InvalidAmount = 5,
}

#[contracttype]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum EscrowStatus {
    Pending = 0,
    Completed = 1,
    Refunded = 2,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Escrow {
    pub sender: Address,
    pub receiver: Address,
    pub arbiter: Address,
    pub token: Address,
    pub amount: i128,
    pub platform_address: Address,
    pub platform_fee: i128,
    pub status: EscrowStatus,
}

#[contracttype]
pub enum DataKey {
    Escrow(String), // Unique Transaction ID
}

#[contract]
pub struct AnchorFlowContract;

#[contractimpl]
impl AnchorFlowContract {
    /// Deposit funds and create a new escrow transaction.
    /// `tx_id` should be a unique identifier for the transaction.
    pub fn deposit(
        env: Env,
        tx_id: String,
        sender: Address,
        receiver: Address,
        arbiter: Address,
        token: Address,
        amount: i128,
        platform_address: Address,
        platform_fee: i128,
    ) -> Result<(), Error> {
        sender.require_auth();

        if amount <= 0 || platform_fee < 0 {
            return Err(Error::InvalidAmount);
        }

        let total_deposit = amount + platform_fee;
        
        let key = DataKey::Escrow(tx_id.clone());
        if env.storage().persistent().has(&key) {
            return Err(Error::EscrowAlreadyExists);
        }

        // Transfer funds from sender to the contract
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&sender, &env.current_contract_address(), &total_deposit);

        let escrow = Escrow {
            sender,
            receiver,
            arbiter,
            token,
            amount,
            platform_address,
            platform_fee,
            status: EscrowStatus::Pending,
        };

        env.storage().persistent().set(&key, &escrow);

        // Emit Event
        env.events().publish(
            (symbol_short!("escrow"), symbol_short!("deposit"), tx_id),
            escrow,
        );

        Ok(())
    }

    /// Release funds to the receiver and the platform. Only the arbiter can call this.
    pub fn release(env: Env, tx_id: String, caller: Address) -> Result<(), Error> {
        caller.require_auth();

        let key = DataKey::Escrow(tx_id.clone());
        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(Error::EscrowNotFound)?;

        if caller != escrow.arbiter {
            return Err(Error::NotAuthorized);
        }

        if escrow.status != EscrowStatus::Pending {
            return Err(Error::InvalidStatus);
        }

        // Update status
        escrow.status = EscrowStatus::Completed;
        env.storage().persistent().set(&key, &escrow);

        let token_client = token::Client::new(&env, &escrow.token);

        // Transfer amount to receiver
        if escrow.amount > 0 {
            token_client.transfer(
                &env.current_contract_address(),
                &escrow.receiver,
                &escrow.amount,
            );
        }

        // Transfer fee to platform
        if escrow.platform_fee > 0 {
            token_client.transfer(
                &env.current_contract_address(),
                &escrow.platform_address,
                &escrow.platform_fee,
            );
        }

        // Emit Event
        env.events().publish(
            (symbol_short!("escrow"), symbol_short!("release"), tx_id),
            escrow,
        );

        Ok(())
    }

    /// Refund funds back to the sender. Only the arbiter can call this.
    pub fn refund(env: Env, tx_id: String, caller: Address) -> Result<(), Error> {
        caller.require_auth();

        let key = DataKey::Escrow(tx_id.clone());
        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(Error::EscrowNotFound)?;

        if caller != escrow.arbiter {
            return Err(Error::NotAuthorized);
        }

        if escrow.status != EscrowStatus::Pending {
            return Err(Error::InvalidStatus);
        }

        // Update status
        escrow.status = EscrowStatus::Refunded;
        env.storage().persistent().set(&key, &escrow);

        let total_deposit = escrow.amount + escrow.platform_fee;

        // Transfer funds back to sender
        let token_client = token::Client::new(&env, &escrow.token);
        if total_deposit > 0 {
            token_client.transfer(
                &env.current_contract_address(),
                &escrow.sender,
                &total_deposit,
            );
        }

        // Emit Event
        env.events().publish(
            (symbol_short!("escrow"), symbol_short!("refund"), tx_id),
            escrow,
        );

        Ok(())
    }
}

mod test;
