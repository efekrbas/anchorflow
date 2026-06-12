// ============================================================
// index.ts — AnchorFlow Express HTTP Server
//
// This is the entry point for the AnchorFlow backend service.
// It exposes RESTful API routes that proxy requests to the
// Stellar Anchor SEP services.
//
// Routes:
//   GET  /health                   → Service health check
//
//   POST /auth/sep10               → Trigger SEP-10 authentication
//
//   GET  /anchor/sep24/info        → Query SEP-24 /info
//   GET  /anchor/sep31/info        → Query SEP-31 /info
//
//   POST /sep24/deposit            → Initiate SEP-24 deposit
//   POST /sep24/withdraw           → Initiate SEP-24 withdrawal
//   GET  /sep24/transaction/:id    → Poll SEP-24 transaction status
//
//   POST /sep31/payment            → Initiate SEP-31 cross-border payment
//   GET  /sep31/transaction/:id    → Poll SEP-31 transaction status
//
// Usage:
//   npm run dev    — Starts with ts-node for development
//   npm run build  — Compiles to JS
//   npm start      — Runs compiled JS
// ============================================================

import express, { Request, Response, NextFunction } from "express";
import { PORT, CLIENT_PUBLIC_KEY, ANCHOR_DOMAIN } from "./config";

// ── SEP Service Imports ──
import { authenticate, clearAuthCache } from "./sep10-auth";
import { getSep24Info, getSep31Info } from "./anchor-info";
import {
  initiateDeposit,
  initiateWithdraw,
  getTransactionStatus,
} from "./sep24-service";
import {
  initiatePayment,
  getPaymentStatus,
} from "./sep31-service";

// ---------------------------------------------------------------
// Express App Initialization
// ---------------------------------------------------------------

const app = express();

// Parse JSON request bodies (for POST routes)
app.use(express.json());

// ---------------------------------------------------------------
// Middleware: Request Logger
// ---------------------------------------------------------------

app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ---------------------------------------------------------------
// Middleware: Async Error Wrapper
//
// Express doesn't natively catch errors from async route handlers.
// This wrapper ensures that any thrown error is forwarded to the
// Express error handler instead of crashing the process.
// ---------------------------------------------------------------

type AsyncHandler = (req: Request, res: Response) => Promise<void>;

function asyncHandler(fn: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };
}

// ===============================================================
// ROUTES
// ===============================================================

// ---------------------------------------------------------------
// GET /health — Simple health check
// ---------------------------------------------------------------

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "anchorflow-stellar-service",
    account: CLIENT_PUBLIC_KEY,
    anchor_domain: ANCHOR_DOMAIN,
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------
// POST /auth/sep10 — Trigger SEP-10 Authentication
//
// Performs the full challenge/sign/submit flow and returns the JWT.
// The JWT is also cached internally for reuse by other routes.
// ---------------------------------------------------------------

app.post(
  "/auth/sep10",
  asyncHandler(async (_req: Request, res: Response) => {
    const jwt = await authenticate();
    res.json({
      success: true,
      message: "SEP-10 authentication successful.",
      jwt,
    });
  })
);

// ---------------------------------------------------------------
// POST /auth/sep10/clear — Clear the cached JWT
// ---------------------------------------------------------------

app.post("/auth/sep10/clear", (_req: Request, res: Response) => {
  clearAuthCache();
  res.json({
    success: true,
    message: "Auth cache cleared. Next request will re-authenticate.",
  });
});

// ---------------------------------------------------------------
// GET /anchor/sep24/info — Query SEP-24 anchor capabilities
// ---------------------------------------------------------------

app.get(
  "/anchor/sep24/info",
  asyncHandler(async (_req: Request, res: Response) => {
    const info = await getSep24Info();
    res.json({ success: true, data: info });
  })
);

// ---------------------------------------------------------------
// GET /anchor/sep31/info — Query SEP-31 anchor capabilities
// ---------------------------------------------------------------

app.get(
  "/anchor/sep31/info",
  asyncHandler(async (_req: Request, res: Response) => {
    const info = await getSep31Info();
    res.json({ success: true, data: info });
  })
);

// ---------------------------------------------------------------
// POST /sep24/deposit — Initiate an interactive deposit
//
// Request body:
//   {
//     "asset_code": "USDC",
//     "asset_issuer": "GA5ZSE...",   // optional
//     "amount": "100.00",            // optional
//     "email_address": "user@x.com"  // optional
//   }
// ---------------------------------------------------------------

app.post(
  "/sep24/deposit",
  asyncHandler(async (req: Request, res: Response) => {
    const { asset_code, asset_issuer, amount, email_address } = req.body;

    if (!asset_code) {
      res.status(400).json({ error: "asset_code is required." });
      return;
    }

    const result = await initiateDeposit({
      asset_code,
      asset_issuer,
      amount,
      email_address,
    });

    res.json({
      success: true,
      message:
        "Deposit initiated. Redirect the user to the interactive URL " +
        "to complete KYC and provide payment details.",
      data: result,
    });
  })
);

// ---------------------------------------------------------------
// POST /sep24/withdraw — Initiate an interactive withdrawal
//
// Request body:
//   {
//     "asset_code": "USDC",
//     "asset_issuer": "GA5ZSE...",  // optional
//     "amount": "50.00",            // optional
//     "dest": "bank_account"        // optional
//   }
// ---------------------------------------------------------------

app.post(
  "/sep24/withdraw",
  asyncHandler(async (req: Request, res: Response) => {
    const { asset_code, asset_issuer, amount, dest } = req.body;

    if (!asset_code) {
      res.status(400).json({ error: "asset_code is required." });
      return;
    }

    const result = await initiateWithdraw({
      asset_code,
      asset_issuer,
      amount,
      dest,
    });

    res.json({
      success: true,
      message:
        "Withdrawal initiated. Redirect the user to the interactive URL " +
        "to complete the off-ramp flow.",
      data: result,
    });
  })
);

// ---------------------------------------------------------------
// GET /sep24/transaction/:id — Poll a SEP-24 transaction status
// ---------------------------------------------------------------

app.get(
  "/sep24/transaction/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const status = await getTransactionStatus(id);

    res.json({ success: true, data: status });
  })
);

// ---------------------------------------------------------------
// POST /sep31/payment — Initiate a SEP-31 cross-border payment
//
// Request body:
//   {
//     "amount": "100.00",
//     "asset_code": "USDC",
//     "asset_issuer": "GA5ZSE...",
//     "receiver": {
//       "first_name": "Jane",
//       "last_name": "Doe",
//       "bank_account": "123456789",
//       "country": "NG"
//     },
//     "sender": { ... }  // optional
//   }
// ---------------------------------------------------------------

app.post(
  "/sep31/payment",
  asyncHandler(async (req: Request, res: Response) => {
    const { amount, asset_code, asset_issuer, receiver, sender } = req.body;

    // ── Validate required fields ──
    if (!amount || !asset_code || !receiver) {
      res.status(400).json({
        error: "amount, asset_code, and receiver are required.",
      });
      return;
    }

    const result = await initiatePayment({
      amount,
      asset_code,
      asset_issuer,
      receiver,
      sender,
    });

    res.json({
      success: true,
      message:
        "Cross-border payment created. Send a Stellar payment to the " +
        "specified account with the given memo to complete the transfer.",
      data: result,
    });
  })
);

// ---------------------------------------------------------------
// GET /sep31/transaction/:id — Poll a SEP-31 transaction status
// ---------------------------------------------------------------

app.get(
  "/sep31/transaction/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const status = await getPaymentStatus(id);

    res.json({ success: true, data: status });
  })
);

// ===============================================================
// ERROR HANDLER
// ===============================================================

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[error]", err.message);
  res.status(500).json({
    success: false,
    error: err.message,
  });
});

// ===============================================================
// START SERVER
// ===============================================================

app.listen(PORT, () => {
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║       AnchorFlow — Stellar Anchor Service       ║");
  console.log("╠══════════════════════════════════════════════════╣");
  console.log(`║  Server    : http://localhost:${PORT}              ║`);
  console.log(`║  Account   : ${CLIENT_PUBLIC_KEY.slice(0, 12)}...  ║`);
  console.log(`║  Anchor    : ${ANCHOR_DOMAIN.padEnd(35)}║`);
  console.log(`║  Network   : ${process.env.STELLAR_NETWORK ?? "testnet"}                          ║`);
  console.log("╠══════════════════════════════════════════════════╣");
  console.log("║  Routes:                                        ║");
  console.log("║  GET  /health                                   ║");
  console.log("║  POST /auth/sep10                               ║");
  console.log("║  GET  /anchor/sep24/info                        ║");
  console.log("║  GET  /anchor/sep31/info                        ║");
  console.log("║  POST /sep24/deposit                            ║");
  console.log("║  POST /sep24/withdraw                           ║");
  console.log("║  GET  /sep24/transaction/:id                    ║");
  console.log("║  POST /sep31/payment                            ║");
  console.log("║  GET  /sep31/transaction/:id                    ║");
  console.log("╚══════════════════════════════════════════════════╝");
});

export default app;
