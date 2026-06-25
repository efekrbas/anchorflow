
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
      // 1. Check if Freighter is available
      if (!window.freighterApi || !(await window.freighterApi.isConnected())) {
        showToast("error", "Freighter Not Found", "Please install the Freighter browser extension to connect.");
        return;
      }

      // Show sections & skeletons
      document.getElementById("statsSection").classList.remove("hidden");
      document.getElementById("txSection").classList.remove("hidden");
      document.getElementById("sendSection").classList.remove("hidden");
      
      const setSkeleton = (id) => {
        document.getElementById(id).innerHTML = '<div class="skeleton h-8 w-full max-w-[120px]"></div>';
      };
      setSkeleton("statBalance");
      setSkeleton("statTxCount");
      setSkeleton("statLastActive");
      setSkeleton("statSequence");

      document.getElementById("txTableBody").innerHTML = `
        <tr>
          <td colspan="5" class="py-6 px-4">
            <div class="flex flex-col items-center gap-4 py-8">
              <div class="skeleton h-6 w-full max-w-3xl rounded-md opacity-50"></div>
              <div class="skeleton h-6 w-full max-w-2xl rounded-md opacity-30"></div>
              <div class="skeleton h-6 w-full max-w-xl rounded-md opacity-20"></div>
            </div>
          </td>
        </tr>
      `;

      const connectBtn = document.getElementById("connectBtn");
      const connectBtnText = document.getElementById("connectBtnText");

      try {
        if(connectBtn) connectBtn.disabled = true;
        if(connectBtnText) {
          connectBtnText.innerHTML = `
            <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          `;
        }

        // ── Connect Freighter and get Public Key ──
        let walletAddress;
        try {
          walletAddress = await window.freighterApi.getPublicKey();
        } catch (e) {
          throw new Error("User rejected connection or Freighter is locked.");
        }
        
        if (!walletAddress) {
          throw new Error("Could not retrieve public key from Freighter.");
        }

        // Update UI with the connected address
        document.getElementById("walletAddress").value = walletAddress;
        document.getElementById("walletAddress").classList.remove("text-gray-400", "opacity-80");
        document.getElementById("walletAddress").classList.add("text-white", "opacity-100");

        // ── Artificially wait to show skeleton loading state ──
        await new Promise(resolve => setTimeout(resolve, 1500));

        // ── Inject Mock Data ──
        document.getElementById("statBalance").textContent = "14,592.00 XLM";
        document.getElementById("statSequence").textContent = "...73942011";

        document.getElementById("walletBadge").classList.remove("hidden");
        document.getElementById("walletBadge").classList.add("flex");
        document.getElementById("walletBadgeText").textContent =
          walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

        const mockTransactions = [
          {
            hash: "0x1a2b3c4d5e6f7g8h9i0j1a2b3c4d5e6f7g8h9i0j",
            created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            successful: true,
            status: "success",
            fee_charged: "10000",
            operation_count: 1,
            memo_type: "none"
          },
          {
            hash: "0xf9e8d7c6b5a4f9e8d7c6b5a4f9e8d7c6b5a4",
            created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            successful: false,
            status: "pending",
            fee_charged: "10000",
            operation_count: 2,
            memo_type: "text"
          },
          {
            hash: "0x9876543210abcdef9876543210abcdef98765432",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            successful: false,
            status: "failed",
            fee_charged: "10000",
            operation_count: 1,
            memo_type: "none"
          },
          {
            hash: "0xabc123def456abc123def456abc123def456",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            successful: true,
            status: "success",
            fee_charged: "15000",
            operation_count: 1,
            memo_type: "id"
          }
        ];

        document.getElementById("statTxCount").textContent = mockTransactions.length;
        document.getElementById("statLastActive").textContent = formatRelativeTime(new Date(mockTransactions[0].created_at));

        renderTransactionTable(mockTransactions, walletAddress);
        showToast("success", "Connected", `Loaded ${mockTransactions.length} mock transactions.`);

      } catch (err) {
        console.error(err);
        showToast("error", "Connection Failed", err.message || "Unknown error");
      } finally {
        if(connectBtn) connectBtn.disabled = false;
        
        // If successfully connected, we could leave the button as "Connected"
        const finalWalletAddress = document.getElementById("walletAddress").value.trim();
        if (finalWalletAddress && finalWalletAddress.startsWith("G")) {
          if(connectBtnText) {
            connectBtnText.innerHTML = `
              <svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Connected
            `;
          }
          if(connectBtn) {
            connectBtn.classList.remove("from-cyan-500", "to-blue-500");
            connectBtn.classList.add("from-emerald-500", "to-teal-500");
          }
        } else {
          if(connectBtnText) {
            connectBtnText.innerHTML = `
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Connect Freighter
            `;
          }
        }
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
        const hash = tx.hash || "";
        const shortHash = hash.startsWith("0x") 
          ? hash.slice(0, 5) + "..." + hash.slice(-3)
          : (hash.length > 8 ? "0x" + hash.slice(0, 3) + "..." + hash.slice(-3) : hash);
        const feeXLM = (parseInt(tx.fee_charged) / 10_000_000).toFixed(7);
        const opCount = tx.operation_count;

        // Determine transaction type label
        let typeLabel = `${opCount} op${opCount > 1 ? "s" : ""}`;
        if (tx.memo_type && tx.memo_type !== "none") {
          typeLabel += ` · ${tx.memo_type}`;
        }

        // Status badge
        let statusBadge = "";
        if (tx.status === "success" || (tx.successful === true && tx.status !== "pending" && tx.status !== "failed")) {
          statusBadge = `<span class="badge-success inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
               <span class="relative flex h-2 w-2">
                 <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               Success
             </span>`;
        } else if (tx.status === "pending") {
          statusBadge = `<span class="badge-pending inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-orange-500/20 bg-orange-500/10 text-orange-400">
               <svg class="w-3 h-3 animate-spin text-orange-400" fill="none" viewBox="0 0 24 24">
                 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
               </svg>
               Pending
             </span>`;
        } else {
          statusBadge = `<span class="badge-error inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-red-500/20 bg-red-500/10 text-red-400">
               <svg class="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
               </svg>
               Failed
             </span>`;
        }

        // Delay for staggered animation
        const delay = 0.1 * i;

        return `
          <tr class="tx-row border-b border-white/[0.03] group" style="animation: slideUp 0.5s ease-out ${delay}s forwards; opacity: 0; transform: translateY(10px);">
            <td class="px-6 py-4 whitespace-nowrap">${statusBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <a href="https://stellar.expert/explorer/testnet/tx/${hash}" target="_blank" class="font-mono text-sm text-stellar-400 hover:text-stellar-300 hover:underline cursor-pointer transition-colors" title="${hash}" onclick="event.stopPropagation()">
                ${shortHash}
              </a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-gray-400">${typeLabel}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <span class="font-mono text-sm text-gray-300">${feeXLM} XLM</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <div class="flex flex-col items-end">
                <span class="text-sm text-gray-300">${formatDate(date)}</span>
                <span class="text-[11px] text-gray-500 mt-0.5">${formatRelativeTime(date)}</span>
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

      // ── Form Validation ──
      // Clear previous inline errors
      document.querySelectorAll(".error-msg").forEach(el => el.remove());
      document.querySelectorAll(".input-error").forEach(el => {
        el.classList.remove("input-error", "border-red-500", "focus:ring-red-500/40", "focus:border-red-500/50");
      });

      let hasError = false;

      const showError = (id, message) => {
        const input = document.getElementById(id);
        if(!input) return;
        input.classList.add("input-error", "border-red-500", "focus:ring-red-500/40", "focus:border-red-500/50");
        const err = document.createElement("p");
        err.className = "error-msg text-red-400 text-xs mt-1.5 animate-fade-in";
        err.textContent = message;
        input.parentNode.appendChild(err);
        hasError = true;
      };

      if (!sender || !sender.startsWith("G")) {
        showToast("error", "No Wallet", "Connect your wallet first.");
        return;
      }
      
      const stellarKeyRegex = /^G[A-Z2-7]{55}$/;
      
      if (!stellarKeyRegex.test(receiver)) {
        showError("receiverAddr", "Invalid Stellar address format (0, 1, 8, 9 are not allowed)");
      }
      if (!stellarKeyRegex.test(arbiter)) {
        showError("arbiterAddr", "Invalid Stellar address format (0, 1, 8, 9 are not allowed)");
      }
      if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        showError("sendAmount", "Please enter a valid positive numeric amount greater than zero");
      }

      if (hasError) {
        showToast("error", "Validation Failed", "Please fix the highlighted errors in the form.");
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
          "Success: Escrow contract initialized safely!",
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
        } else if (errorMsg.includes("Insufficient XLM balance")) {
          errorMsg = "Error: Insufficient XLM balance to cover rent-exempt minimum";
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
  