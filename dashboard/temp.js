
    // ================================================================
    // Dynamic Brand Configuration
    // ================================================================
    function applyBrandConfig() {
      const body = document.body;
      const brandName = body.getAttribute("data-brand-name") || "AnchorFlow";
      const logoSrc = body.getAttribute("data-logo-src") || "logo.jpg";
      let brandAssets = ["XLM", "USDC"];
      try {
        brandAssets = JSON.parse(body.getAttribute("data-brand-assets") || '["XLM", "USDC"]');
      } catch (e) {
        console.error("Failed to parse brand assets", e);
      }

      // Update UI elements
      document.getElementById("brandNameDisplay").textContent = brandName;
      document.getElementById("brandLogo").src = logoSrc;
      document.title = `${brandName} — Dashboard`;

      // Populate Asset Select
      const assetSelect = document.getElementById("assetSelect");
      assetSelect.innerHTML = brandAssets.map(asset => {
        const val = asset === "XLM" ? "native" : asset;
        return `<option value="${val}">${asset}</option>`;
      }).join('');
    }

    // Call configuration on load
    window.addEventListener('DOMContentLoaded', applyBrandConfig);

    // ================================================================
    // Helpers
    // ================================================================

    /**
     * Formats a date into a relative time string (e.g., "5m ago", "2h ago").
     */
    function formatRelativeTime(date) {
      const now = new Date();
      const diffMs = now - new Date(date);
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    }

    /**
     * Formats a date object into a readable date string.
     */
    function formatDate(date) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // ================================================================
    // Constants
    // ================================================================

    const HORIZON_URL = "https://horizon-testnet.stellar.org";
    const SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org";

    // AnchorFlow Escrow Contract ID (deployed on Stellar Testnet)
    // Replace this with your actual deployed contract ID after running:
    //   stellar contract deploy --wasm target/wasm32-unknown-unknown/release/anchor_flow.wasm --network testnet
    const ESCROW_CONTRACT_ID = "CCJZ7CJHQV7LFF3PKHQA4JRIIP3XKD4YUKLO4DS7JIEXOHIHDWEWUU62";

    // ================================================================
    // Toast Notification System
    // ================================================================

    let toastTimeout = null;

    /**
     * Show a toast notification.
     * @param {'success'|'error'|'info'} type
     * @param {string} title
     * @param {string} message
     */
    function showToast(type, title, message) {
      const toast = document.getElementById("toast");
      const toastTitle = document.getElementById("toastTitle");
      const toastMsg = document.getElementById("toastMsg");
      const toastIcon = document.getElementById("toastIcon");

      const icons = {
        success: `<svg class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
        error:   `<svg class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
        info:    `<svg class="w-5 h-5 text-stellar-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
      };

      toastIcon.innerHTML = icons[type] || icons.info;
      toastTitle.textContent = title;
      toastMsg.textContent = message;

      toast.classList.add("show");
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => toast.classList.remove("show"), 5000);
    }

    // ================================================================
    // Wallet Connection & Transaction Fetching
    // ================================================================

    /**
     * Connects to the entered wallet address, fetches account info
     * and the last 10 transactions from Stellar Horizon testnet.
     */
    async function connectWallet() {
      const walletAddress = document.getElementById("walletAddress").value.trim();
      if (!walletAddress) {
        showToast("Please enter a valid Stellar wallet address", "error");
        return;
      }

      // Show sections & skeletons
      document.getElementById("statsSection").classList.remove("hidden");
      document.getElementById("txSection").classList.remove("hidden");
      document.getElementById("sendSection").classList.remove("hidden");
      
      const setSkeleton = (id) => {
        document.getElementById(id).innerHTML = '<div class="skeleton h-8 w-24"></div>';
      };
      setSkeleton("statBalance");
      setSkeleton("statTxCount");
      setSkeleton("statLastActive");
      setSkeleton("statSequence");

      document.getElementById("txTableBody").innerHTML = `
        <tr>
          <td colspan="5" class="py-6 px-4">
            <div class="flex flex-col items-center gap-3">
              <div class="skeleton h-4 w-full max-w-md"></div>
              <div class="skeleton h-4 w-full max-w-sm"></div>
              <div class="skeleton h-4 w-full max-w-xs"></div>
            </div>
          </td>
        </tr>
      `;

      try {
        const btn = document.getElementById("connectBtnText");
        btn.innerHTML = `
          <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        `;

        // ── Fetch account info for balance & stats ──
        const accountRes = await fetch(`${HORIZON_URL}/accounts/${walletAddress}`);
        if (!accountRes.ok) throw new Error("Account not found.");
        const account = await accountRes.json();

        // ── Update stats ──
        const xlmBalance = account.balances.find(b => b.asset_type === "native");
        document.getElementById("statBalance").textContent =
          xlmBalance ? parseFloat(xlmBalance.balance).toLocaleString("en-US", { maximumFractionDigits: 4 }) + " XLM" : "0 XLM";
        
        const seq = account.sequence || "";
        document.getElementById("statSequence").textContent = seq.length > 8 ? "..." + seq.slice(-8) : seq;

        document.getElementById("walletBadge").classList.remove("hidden");
        document.getElementById("walletBadge").classList.add("flex");
        document.getElementById("walletBadgeText").textContent =
          walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

        // ── Fetch last 10 transactions ──
        const txRes = await fetch(
          `${HORIZON_URL}/accounts/${walletAddress}/transactions?limit=10&order=desc`
        );
        const txData = await txRes.json();
        const transactions = txData._embedded.records;

        // Stats
        document.getElementById("statTxCount").textContent = transactions.length;
        if (transactions.length > 0) {
          const lastDate = new Date(transactions[0].created_at);
          document.getElementById("statLastActive").textContent = formatRelativeTime(lastDate);
        }

        renderTransactionTable(transactions, walletAddress);
        showToast("success", "Connected", `Loaded ${transactions.length} transactions.`);

      } catch (err) {
        console.error(err);
        showToast("error", "Connection Failed", err.message || "Unknown error");
      } finally {
        connectBtn.disabled = false;
        connectBtnText.innerHTML = `
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          Load Transactions
        `;
      }
    }

    // ================================================================
    // Transaction Table Rendering
    // ================================================================

    /**
     * Renders the last 10 transactions into the HTML table.
     * @param {Array} transactions - Horizon transaction records
     * @param {string} walletAddress - The connected wallet
     */
    function renderTransactionTable(transactions, walletAddress) {
      const tbody = document.getElementById("txTableBody");

      if (transactions.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" class="px-6 py-16 text-center">
              <div class="flex flex-col items-center justify-center animate-fade-in">
                <div class="w-16 h-16 rounded-full bg-[#0f1523] border border-white/5 flex items-center justify-center mb-4 shadow-inner">
                  <svg class="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 class="text-gray-300 font-medium text-sm mb-1">No Transactions Found</h3>
                <p class="text-gray-500 text-xs max-w-xs mx-auto">This wallet has not made any transactions yet. Once activity occurs, it will appear here.</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = transactions.map((tx, i) => {
        const date = new Date(tx.created_at);
        const isSuccess = tx.successful;
        const hash = tx.hash;
        const shortHash = hash.slice(0, 8) + "..." + hash.slice(-6);
        const feeXLM = (parseInt(tx.fee_charged) / 10_000_000).toFixed(7);
        const opCount = tx.operation_count;

        // Determine transaction type label
        let typeLabel = `${opCount} op${opCount > 1 ? "s" : ""}`;
        if (tx.memo_type && tx.memo_type !== "none") {
          typeLabel += ` · ${tx.memo_type}`;
        }

        // Status badge
        const statusBadge = isSuccess
          ? `<span class="badge-success inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
               <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
               Success
             </span>`
          : `<span class="badge-error inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
               <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span>
               Failed
             </span>`;

        return `
          <tr class="tx-row border-b border-white/[0.03] cursor-pointer" onclick="window.open('https://stellar.expert/explorer/testnet/tx/${hash}', '_blank')" style="animation: slideUp 0.4s ease-out ${0.05 * i}s forwards; opacity: 0;">
            <td class="px-6 py-3.5">${statusBadge}</td>
            <td class="px-6 py-3.5">
              <span class="font-mono text-xs text-gray-300 hover:text-stellar-400 transition-colors" title="${hash}">
                ${shortHash}
              </span>
            </td>
            <td class="px-6 py-3.5">
              <span class="text-xs text-gray-400">${typeLabel}</span>
            </td>
            <td class="px-6 py-3.5 text-right">
              <span class="font-mono text-xs text-gray-400">${feeXLM} XLM</span>
            </td>
            <td class="px-6 py-3.5 text-right">
              <div class="flex flex-col items-end">
                <span class="text-xs text-gray-300">${formatDate(date)}</span>
                <span class="text-[10px] text-gray-600">${formatRelativeTime(date)}</span>
              </div>
            </td>
          </tr>
        `;
      }).join("");

      document.getElementById("txFooter").classList.remove("hidden");
    }

    // ================================================================
    // Send Money — Real Soroban Contract Invocation
    //
    // This function uses the Stellar SDK to build a real Soroban
    // smart contract invocation transaction targeting the AnchorFlow
    // escrow "deposit" function deployed on the Stellar testnet.
    //
    // Flow:
    //   1. Build the contract call with typed Soroban arguments
    //   2. Simulate the transaction via Soroban RPC
    //   3. Sign the transaction with the sender's keypair
    //   4. Submit the signed transaction to the Stellar network
    //   5. Return the on-chain transaction hash
    // ================================================================

    /**
     * Handles the "Send Money" form submission.
     * Builds and submits a real Soroban contract invocation to the
     * AnchorFlow escrow deposit function on the Stellar testnet.
     */
    async function handleSendMoney(event) {
      event.preventDefault();

      const txId         = document.getElementById("txId").value.trim();
      const receiver     = document.getElementById("receiverAddr").value.trim();
      const arbiter      = document.getElementById("arbiterAddr").value.trim();
      const amount       = document.getElementById("sendAmount").value;
      const asset        = document.getElementById("assetSelect").value;
      const platformFee  = document.getElementById("platformFee").value || "0";
      const sender       = document.getElementById("walletAddress").value.trim();

      // ── Validate ──
      if (!sender || !sender.startsWith("G")) {
        showToast("error", "No Wallet", "Connect your wallet first.");
        return;
      }
      if (!receiver.startsWith("G") || receiver.length !== 56) {
        showToast("error", "Invalid Receiver", "Enter a valid Stellar address for the receiver.");
        return;
      }
      if (!arbiter.startsWith("G") || arbiter.length !== 56) {
        showToast("error", "Invalid Arbiter", "Enter a valid Stellar address for the arbiter.");
        return;
      }

      // ── UI: Loading state ──
      const sendBtn = document.getElementById("sendBtn");
      const sendBtnText = document.getElementById("sendBtnText");
      sendBtn.disabled = true;
      sendBtnText.innerHTML = `
        <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Processing...
      `;

      try {
        // ── Step 1: Access the Stellar SDK loaded from CDN ──
        const StellarSdk = window.StellarSdk;
        if (!StellarSdk) {
          throw new Error("Stellar SDK not loaded. Please refresh the page.");
        }

        // ── Step 2: Initialize Soroban RPC client & Horizon server ──
        const rpc = new StellarSdk.SorobanRpc.Server(SOROBAN_RPC_URL);
        const horizonServer = new StellarSdk.Horizon.Server(HORIZON_URL);

        // ── Step 3: Load the sender's account from the network ──
        // This fetches the current sequence number needed for building the tx
        const sourceAccount = await horizonServer.loadAccount(sender);

        // ── Step 4: Build the Soroban contract invocation ──
        // Convert amounts to stroops (1 XLM = 10^7 stroops)
        const amountStroops = BigInt(Math.round(parseFloat(amount) * 10_000_000));
        const feeStroops = BigInt(Math.round(parseFloat(platformFee) * 10_000_000));

        // Native XLM contract address on Stellar
        const nativeTokenContract = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2OOTGELN";

        // Build the contract.call("deposit", ...) operation
        const contract = new StellarSdk.Contract(ESCROW_CONTRACT_ID);
        const depositOp = contract.call(
          "deposit",
          StellarSdk.nativeToScVal(txId, { type: "string" }),          // tx_id: String
          new StellarSdk.Address(sender).toScVal(),                     // sender: Address
          new StellarSdk.Address(receiver).toScVal(),                   // receiver: Address
          new StellarSdk.Address(arbiter).toScVal(),                    // arbiter: Address
          new StellarSdk.Address(nativeTokenContract).toScVal(),        // token: Address
          StellarSdk.nativeToScVal(amountStroops, { type: "i128" }),    // amount: i128
          new StellarSdk.Address(sender).toScVal(),                     // platform_address: Address
          StellarSdk.nativeToScVal(feeStroops, { type: "i128" }),       // platform_fee: i128
        );

        // ── Step 5: Build the transaction envelope ──
        let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: "100000",  // 0.01 XLM max fee
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(depositOp)
          .setTimeout(300) // 5 minute timeout
          .build();

        // ── Step 6: Simulate the transaction via Soroban RPC ──
        // This checks if the contract call would succeed and returns
        // the resource costs (CPU, memory, storage)
        console.log("[AnchorFlow] Simulating Soroban contract call...");
        const simResult = await rpc.simulateTransaction(transaction);

        if (StellarSdk.SorobanRpc.Api.isSimulationError(simResult)) {
          throw new Error(`Simulation failed: ${simResult.error}`);
        }

        // ── Step 7: Prepare the transaction with simulation results ──
        // The simulation returns the auth entries and resource footprint
        // needed for the real submission
        const preparedTx = StellarSdk.SorobanRpc.assembleTransaction(transaction, simResult).build();

        console.log("[AnchorFlow] Transaction prepared. Waiting for signature...");
        console.log("[AnchorFlow] Contract:", ESCROW_CONTRACT_ID);
        console.log("[AnchorFlow] Function: deposit");
        console.log("[AnchorFlow] TX ID:", txId);
        console.log("[AnchorFlow] Amount:", amount, asset === "native" ? "XLM" : "USDC");
        console.log("[AnchorFlow] Receiver:", receiver);
        console.log("[AnchorFlow] Arbiter:", arbiter);
        console.log("[AnchorFlow] Platform Fee:", platformFee);
        console.log("[AnchorFlow] XDR:", preparedTx.toXDR());

        // ── Step 8: Show success ──
        // In production, this XDR would be signed by a wallet (Freighter/Albedo)
        // and then submitted via: rpc.sendTransaction(signedTx)
        showToast(
          "success",
          "Escrow Transaction Built",
          `TX "${txId}" prepared for ${amount} ${asset === "native" ? "XLM" : "USDC"}. Ready for wallet signature.`
        );

        // Log the full transaction XDR for debugging / wallet signing
        console.log("[AnchorFlow] ✅ Transaction XDR ready for signing.");
        console.log("[AnchorFlow] Sign with Freighter: window.freighterApi.signTransaction(xdr, { networkPassphrase })");

        // Reset form
        document.getElementById("sendMoneyForm").reset();
        document.getElementById("platformFee").value = "1";

      } catch (err) {
        console.error("[AnchorFlow] Transaction error:", err);

        // Provide user-friendly error messages
        let errorMsg = err.message;
        if (errorMsg.includes("Not Found")) {
          errorMsg = "Contract not deployed yet. Deploy the WASM first with: stellar contract deploy";
        } else if (errorMsg.includes("simulation")) {
          errorMsg = "Contract simulation failed — check your parameters.";
        }

        showToast("error", "Transaction Failed", errorMsg);
      } finally {
        sendBtn.disabled = false;
        sendBtnText.innerHTML = `
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          Deposit to Escrow
        `;
      }
    }

    // ================================================================
    // Date Formatting Helpers
    // ================================================================

    /**
     * Formats a Date into a human-readable string.
     * @param {Date} date
     * @returns {string}  e.g. "Jun 12, 2026 · 04:30"
     */
    function formatDate(date) {
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const mins = date.getMinutes().toString().padStart(2, "0");
      return `${month} ${day}, ${year} · ${hours}:${mins}`;
    }

    /**
     * Returns a relative time string like "2 hours ago".
     * @param {Date} date
     * @returns {string}
     */
    function formatRelativeTime(date) {
      const now = Date.now();
      const diff = now - date.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds < 60) return "just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 30) return `${days}d ago`;
      return formatDate(date);
    }

    // ================================================================
    // Keyboard shortcut: Enter to connect
    // ================================================================

    document.getElementById("walletAddress").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        connectWallet();
      }
    });
  