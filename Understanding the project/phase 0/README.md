# Phase 0 — Initial Audit (Foundation)
## BeforeYouSign Project

**Completed:** 2026-07-03  
**Objective:** Build a complete mental map of the project before reading a single line of code.

---

## ✅ Deliverables

| # | Deliverable | File | What's Inside |
|---|---|---|---|
| 1 | Architecture Overview | [01_architecture_overview.md](./01_architecture_overview.md) | Full system diagram, dual AI pipeline deep-dive, entry points, security layers, performance optimizations, deployment pipeline, architectural debt |
| 2 | Tech Stack Document | [02_tech_stack.md](./02_tech_stack.md) | Every technology with version + purpose + how it works internally; complete dependency map; NVIDIA model hierarchy; ONNX pipeline internals; dual auth explanation |
| 3 | Feature Map | [03_feature_map.md](./03_feature_map.md) | All 59 features across 14 categories; each feature explained with how it works technically; user archetypes; honest completion status per feature |
| 4 | User Flow Diagram | [04_user_flow_diagram.md](./04_user_flow_diagram.md) | 8 complete user journeys traced step-by-step with exact API calls, DB operations, error handling; page-role access matrix; contract state machine |

---

## 🧠 What Is This Project?

**BeforeYouSign** is a full-stack, serverless, AI-powered **Legal Intelligence Platform**.

- Anyone uploads a contract (PDF, DOCX, TXT)
- In under 30 seconds: instant AI risk score, red flags, clause explanations, negotiation strategies
- Built for: individuals, startups, lawyers, enterprise legal teams
- Tagline: *"Analyze any contract. Free. In 30 seconds."*

**Live URL:** https://beforeyousign.vercel.app

---

## 🏗️ Architecture in 3 Lines

1. **Frontend:** React 19 + Next.js 16 App Router + Tailwind CSS 4 — deployed on Vercel
2. **AI Brain:** NVIDIA NIM (Llama 3.3 70B) for generative analysis + MiniLM ONNX (local, 23MB) for semantic ML
3. **Data:** Supabase PostgreSQL via Prisma ORM — 22 DB tables covering the full contract lifecycle

---

## 🔑 The Most Important Thing to Understand: The Dual Pipeline

This is what makes BeforeYouSign technically interesting. Two completely different AI systems run in parallel:

| | Pipeline 1: Generative AI | Pipeline 2: Local ML (ONNX) |
|---|---|---|
| **Technology** | NVIDIA NIM → Llama 3.3 70B | @xenova/transformers → MiniLM-L6-v2 |
| **Where it runs** | External API (NVIDIA cloud) | Locally in Node.js process |
| **What it produces** | Risk score, clause explanations, red flags, drafts, chat | 384-dim embedding vectors |
| **Use case** | Deep contextual legal reasoning | Cosine similarity, k-NN, benchmarking |
| **Latency** | 10–45 seconds | <10ms (cached), ~500ms (cold) |
| **Deterministic?** | No (LLM is probabilistic) | Yes (same input = same output) |
| **Cost** | Per-API-call (NVIDIA billing) | Free (runs locally) |

---

## 📊 Scale of the Codebase

| Metric | Count |
|---|---|
| Page routes (`app/` directory) | 41 |
| API routes (`app/api/`) | 19 |
| React components (`components/`) | 45 |
| Library files (`lib/`) | 59 |
| Database tables | 22 |
| Features identified | ~59 |
| Largest component | `AnalysisResult.tsx` (221KB) |
| Largest lib file | `smart-template-builder.ts` (60KB) |
| Largest data file | `templates-data.ts` (121KB) |

---

## 🚩 Critical Observations (Read Before Touching Code)

### 1. Auth Is Split — Know Before Touching Any Auth Code
Both **Clerk.js** (frontend) and **NextAuth.js** (backend) run simultaneously. API routes were **intentionally decoupled from auth** during Phase 2/3 to unblock features. This means:
- Many `/api/` routes currently have **no auth protection**
- The NextAuth credentials provider uses an **in-memory user Map** (not a real DB table)
- Clerk is the source of truth for the user session in the UI

### 2. Two Analysis DB Models — Know Which One to Query
- `analyzed_contracts` table → used by early API routes (`/api/dashboard`, `/api/contracts`), simpler schema
- `analyses` table → the full-featured proper schema
- Early dashboard/repository code queries `analyzed_contracts`, newer features use `analyses`

### 3. Docs vs Code Discrepancy — Trust The Code
- `README.md` and `Major_Project.md` say "Llama 3.1 405B"
- Actual `lib/nvidia-client.ts` uses `meta/llama-3.3-70b-instruct` (primary) and `meta/llama-3.1-8b-instruct` (fast)
- Docs were written earlier; code reflects actual deployed configuration

### 4. ONNX Embedding Cache Is Ephemeral
- The 24h TTL in-memory Map cache lives in the Node.js process memory
- On every Vercel cold start, the cache is wiped
- First semantic search request after cold start takes ~500ms (embedding generation)
- Cache hits are <10ms

### 5. `templates-data.ts` Is 121KB of In-Memory Data
- Template data is hardcoded in a massive TypeScript file, not in the database
- This impacts bundle size and startup time
- Templates DB table exists but is not yet the primary data source

### 6. 41 Page Routes — Many May Be Stubs
- The `app/` directory has 41 route folders
- Not all are fully implemented — some likely have UI without working backend
- Known partial features: notifications, blockchain, voice, some collaboration features

---

## 📁 Key Files to Know (Top 10)

| File | Why It Matters |
|---|---|
| `app/layout.tsx` | Root of entire app — ClerkProvider, ErrorBoundary, SEO, Navbar |
| `app/page.tsx` (29KB) | Landing page — entry point for all users |
| `app/api/analyze/route.ts` | Core feature — the analysis endpoint |
| `lib/nvidia-client.ts` | All LLM calls go through here — model config, JSON repair |
| `lib/contract-analyzer.ts` | Analysis prompt builder + retry logic |
| `lib/ml/embeddings.ts` | ONNX embedding singleton pipeline |
| `lib/ml/retrieval.ts` | k-NN semantic search + risk-aware recommendation engine |
| `lib/ml/portfolio-cache.ts` | 24h TTL embedding cache implementation |
| `prisma/schema.prisma` | Full database schema — 22 models, 499 lines |
| `auth.ts` | NextAuth config — shows the dual-auth problem clearly |

---

## ➡️ Next Step: Phase 1

**Phase 1 — Entry Point & Routing Analysis**  
Goal: Trace the exact execution path from browser request → Next.js router → first meaningful code → API response. Map all 19 API routes and understand what's actually connected vs. what's a stub.
