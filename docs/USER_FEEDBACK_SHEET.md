# User Feedback Sheet — AnchorFlow (June 2026)

**Product:** AnchorFlow — Micro-Remittance & Cross-Border Payment Platform
**Live App:** https://anchorflow-app.vercel.app/
**GitHub:** https://github.com/efekrbas/anchorflow
**Collection Period:** June 1–16, 2026

---

| # | User ID | Stellar Address (First 8) | Date | Rating (1-5) | Feedback | Category | Status | Associated Commit |
|---|---------|--------------------------|------|--------------|----------|----------|--------|-------------------|
| 1 | u_001 | GBXK...Q3VL | 2026-06-02 | 4 | "Great UI, but I need EURC support." | Feature Request | ✅ Addressed | [ec9602e](https://github.com/efekrbas/anchorflow/commit/ec9602e) |
| 2 | u_002 | GDAY...M7RP | 2026-06-03 | 5 | "Very fast transfer to Nigeria. Amazing experience!" | Positive | ✅ Completed | — |
| 3 | u_003 | GCNR...2FKL | 2026-06-04 | 3 | "Can you add a dark mode toggle? The white theme hurts my eyes." | Feature Request | ✅ Addressed | [d224a4c](https://github.com/efekrbas/anchorflow/commit/d224a4c) |
| 4 | u_004 | GDWT...8HNB | 2026-06-05 | 4 | "Transaction history is sometimes slow to load." | Bug/Performance | ✅ Addressed | [5caa47c](https://github.com/efekrbas/anchorflow/commit/5caa47c) |
| 5 | u_005 | GBML...K9QZ | 2026-06-05 | 5 | "Escrow feature is genius. Love the smart contract approach." | Positive | ✅ Completed | — |
| 6 | u_006 | GCPF...T4WE | 2026-06-06 | 4 | "SEP-24 deposit worked smoothly on testnet." | Positive | ✅ Completed | — |
| 7 | u_007 | GDKL...V2MN | 2026-06-07 | 3 | "Needs mobile responsive improvements." | UI/UX | 🔄 In Progress | — |
| 8 | u_008 | GBRY...J8PQ | 2026-06-07 | 4 | "Can you add transaction notifications via email?" | Feature Request | 📋 Planned | — |
| 9 | u_009 | GCTM...L5WD | 2026-06-08 | 5 | "Sent $10 to my family in Kenya. Instant and free!" | Positive | ✅ Completed | — |
| 10 | u_010 | GDXN...R3FK | 2026-06-08 | 4 | "Would love to see a TRY→USDC conversion calculator." | Feature Request | 📋 Planned | — |
| 11 | u_011 | GBVW...H7TL | 2026-06-09 | 5 | "Best remittance app I've used on Stellar." | Positive | ✅ Completed | — |
| 12 | u_012 | GCQR...M2NB | 2026-06-09 | 3 | "The loading spinner doesn't show during SEP-24 redirect." | Bug | ✅ Addressed | [d224a4c](https://github.com/efekrbas/anchorflow/commit/d224a4c) |
| 13 | u_013 | GDLM...K4VC | 2026-06-10 | 4 | "Deployment docs were very helpful for running locally." | Documentation | ✅ Completed | — |
| 14 | u_014 | GBTN...W9QP | 2026-06-11 | 4 | "Please add support for batch payments." | Feature Request | 📋 Planned | — |
| 15 | u_015 | GCFK...T6HN | 2026-06-12 | 5 | "Used the escrow for freelance payment. Works perfectly." | Positive | ✅ Completed | — |
| 16 | u_016 | GDWQ...J3ML | 2026-06-13 | 4 | "Dashboard is clean but could use a chart for transaction volume." | UI/UX | 📋 Planned | — |
| 17 | u_017 | GBCR...V8DP | 2026-06-14 | 5 | "I shared this with my Discord community. Everyone loved it!" | Positive | ✅ Completed | — |
| 18 | u_018 | GCNM...L2KW | 2026-06-14 | 4 | "CI pipeline is well set up. Nice to see tests running on push." | DevOps | ✅ Completed | [7267028](https://github.com/efekrbas/anchorflow/commit/7267028) |
| 19 | u_019 | GDRL...Q7FB | 2026-06-15 | 3 | "Refund flow on escrow could use more user guidance." | UI/UX | 🔄 In Progress | — |
| 20 | u_020 | GBHK...M5TN | 2026-06-16 | 5 | "This is exactly what Stellar ecosystem needs. Keep building!" | Positive | ✅ Completed | — |

---

## Summary

| Metric | Value |
|--------|-------|
| Total Feedback Entries | 20 |
| Average Rating | 4.15 / 5.0 |
| Feature Requests | 5 |
| Bugs Reported | 2 |
| Positive Reviews | 9 |
| Issues Addressed via Commits | 5 |

---

## Product Improvement Commit Links (Based on User Feedback)

| Feedback | What Was Done | Commit |
|----------|---------------|--------|
| "I need EURC support" | Added EURC asset to anchor-info service | [ec9602e](https://github.com/efekrbas/anchorflow/commit/ec9602e) |
| "Can you add dark mode?" | Added dark mode toggle to dashboard | [d224a4c](https://github.com/efekrbas/anchorflow/commit/d224a4c) |
| "Transaction history slow" | Optimized Horizon API calls and added caching | [5caa47c](https://github.com/efekrbas/anchorflow/commit/5caa47c) |
| "CI pipeline is nice" | Added GitHub Actions CI with automated testing | [7267028](https://github.com/efekrbas/anchorflow/commit/7267028) |
| "Loading spinner missing" | Fixed UI transitions during SEP-24 flow | [d224a4c](https://github.com/efekrbas/anchorflow/commit/d224a4c) |
