// Run with: node mainnet-tx.js
// MAKE SURE YOU USE A REAL FUNDED SECRET KEY
const StellarSdk = require('@stellar/stellar-sdk');

async function main() {
  // Use public network
  const server = new StellarSdk.Horizon.Server("https://horizon.stellar.org");
  
  // REPLACE WITH YOUR SECRET KEY
  const sourceSecretKey = "S..."; // Do not commit real keys!
  
  try {
    const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
    
    console.log("Building transaction...");
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.PUBLIC,
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: sourceKeypair.publicKey(), // Send to self as a test
        asset: StellarSdk.Asset.native(),
        amount: "0.000001",
      }))
      .setTimeout(30)
      .build();
      
    transaction.sign(sourceKeypair);
    
    console.log("Submitting transaction...");
    const response = await server.submitTransaction(transaction);
    console.log("Success! Hash:", response.hash);
  } catch (e) {
    console.error("Error:", e);
  }
}

// main();
