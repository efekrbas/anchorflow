// AnchorFlow - Stellar Transaction Proof Script
// Works on TESTNET (free) using Friendbot
const StellarSdk = require('@stellar/stellar-sdk');

async function main() {
  const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

  // Generate a fresh keypair
  const keypair = StellarSdk.Keypair.random();
  console.log("Public Key:", keypair.publicKey());
  console.log("Secret Key:", keypair.secret());

  // Fund with Friendbot (free testnet XLM)
  console.log("\nFunding account with Friendbot...");
  const fetch = require('node-fetch');
  const friendbotRes = await fetch(`https://friendbot.stellar.org?addr=${keypair.publicKey()}`);
  if (!friendbotRes.ok) {
    console.error("Friendbot failed:", await friendbotRes.text());
    return;
  }
  console.log("Account funded!");

  // Load the account
  const account = await server.loadAccount(keypair.publicKey());
  console.log("Balance:", account.balances[0].balance, "XLM");

  // Build a payment transaction (send to self)
  console.log("\nBuilding transaction...");
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: keypair.publicKey(),
      asset: StellarSdk.Asset.native(),
      amount: "10",
    }))
    .addMemo(StellarSdk.Memo.text("AnchorFlow-TestTX"))
    .setTimeout(30)
    .build();

  transaction.sign(keypair);

  console.log("Submitting transaction...");
  const response = await server.submitTransaction(transaction);
  console.log("\n✅ SUCCESS!");
  console.log("TX Hash:", response.hash);
  console.log("Ledger:", response.ledger);
  console.log("\nView on Stellar Expert:");
  console.log(`https://stellar.expert/explorer/testnet/tx/${response.hash}`);
}

main().catch(console.error);
