#![cfg(test)]

use super::*;
use soroban_sdk::testutils::{Address as _, Events};
use soroban_sdk::{token, Address, Env, String};

fn create_token_contract<'a>(e: &Env, admin: &Address) -> token::Client<'a> {
    token::Client::new(e, &e.register_stellar_asset_contract(admin.clone()))
}

#[test]
fn test_escrow_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, AnchorFlowContract);
    let client = AnchorFlowContractClient::new(&env, &contract_id);

    let sender = Address::generate(&env);
    let receiver = Address::generate(&env);
    let arbiter = Address::generate(&env);
    let platform = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let token = create_token_contract(&env, &token_admin);
    let token_admin_client = token::StellarAssetClient::new(&env, &token.address);

    // Mint some tokens to sender
    token_admin_client.mint(&sender, &1000);

    let tx_id = String::from_str(&env, "tx123");
    let amount = 900;
    let platform_fee = 100;

    // 1. Deposit
    client.deposit(
        &tx_id,
        &sender,
        &receiver,
        &arbiter,
        &token.address,
        &amount,
        &platform,
        &platform_fee,
    );

    assert_eq!(token.balance(&sender), 0);
    assert_eq!(token.balance(&contract_id), 1000);

    // 2. Release
    client.release(&tx_id, &arbiter);

    assert_eq!(token.balance(&contract_id), 0);
    assert_eq!(token.balance(&receiver), 900);
    assert_eq!(token.balance(&platform), 100);

    // Verify events
    let events = env.events().all();
    assert!(events.len() > 0);
}

#[test]
fn test_escrow_refund() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, AnchorFlowContract);
    let client = AnchorFlowContractClient::new(&env, &contract_id);

    let sender = Address::generate(&env);
    let receiver = Address::generate(&env);
    let arbiter = Address::generate(&env);
    let platform = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let token = create_token_contract(&env, &token_admin);
    let token_admin_client = token::StellarAssetClient::new(&env, &token.address);

    token_admin_client.mint(&sender, &1000);

    let tx_id = String::from_str(&env, "tx123");
    let amount = 900;
    let platform_fee = 100;

    // 1. Deposit
    client.deposit(
        &tx_id,
        &sender,
        &receiver,
        &arbiter,
        &token.address,
        &amount,
        &platform,
        &platform_fee,
    );

    assert_eq!(token.balance(&sender), 0);
    assert_eq!(token.balance(&contract_id), 1000);

    // 2. Refund
    client.refund(&tx_id, &arbiter);

    assert_eq!(token.balance(&contract_id), 0);
    assert_eq!(token.balance(&sender), 1000);
    assert_eq!(token.balance(&receiver), 0);
    assert_eq!(token.balance(&platform), 0);
}

#[test]
#[should_panic(expected = "HostError: Error(Contract, #3)")] // NotAuthorized
fn test_release_unauthorized() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, AnchorFlowContract);
    let client = AnchorFlowContractClient::new(&env, &contract_id);

    let sender = Address::generate(&env);
    let receiver = Address::generate(&env);
    let arbiter = Address::generate(&env);
    let malicious = Address::generate(&env);
    let platform = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let token = create_token_contract(&env, &token_admin);
    let token_admin_client = token::StellarAssetClient::new(&env, &token.address);
    token_admin_client.mint(&sender, &1000);

    let tx_id = String::from_str(&env, "tx123");

    client.deposit(
        &tx_id,
        &sender,
        &receiver,
        &arbiter,
        &token.address,
        &900,
        &platform,
        &100,
    );

    // Malicious user tries to release (panics)
    client.release(&tx_id, &malicious);
}
