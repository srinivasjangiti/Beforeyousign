# Architecture Overview — BeforeYouSign
### Phase 0 Deliverable | Deep Detail Version

---

## 1. What Is BeforeYouSign?

BeforeYouSign is a **full-stack, serverless, AI-powered Legal Intelligence Platform** that democratizes access to expert-level legal document review. It allows anyone — individual, startup, or enterprise legal team — to upload a contract (PDF, DOCX, or TXT) and receive, in under 30 seconds, a detailed AI-generated breakdown of:

- Risk score (0–100)
- Identified red flags (uncapped liabilities, auto-renewal traps, IP grabs, etc.)
- Clause-by-clause plain-language explanations
- Negotiation strategies and safer alternative language
- Portfolio-level semantic similarity across all past contracts

The platform solves **five core problems** in the legal industry:

| Problem | How BeforeYouSign Solves It |
|---|---|
| High cost of legal counsel | Instant AI analysis at zero per-review cost |
| Time inefficiency (days → seconds) | LLM returns full analysis in ~10–45 seconds |
| Information asymmetry | Plain-language summaries + red flag detection |
| Scattered, fragmented workflows | Unified platform: upload, analyze, chat, draft, sign, store |
| No historical analytics | Semantic portfolio discovery across all past contracts |

---

## 2. System Architecture

### 2.1 Layer Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                     BROWSER (Client Layer)                      │
│                                                                 │
│  React 19 Components  →  Clerk.js Auth UI  →  Tailwind CSS 4   │
│  Next.js App Router (RSC + Client Components)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             │ (RSC streaming / fetch)
┌────────────────────────────▼────────────────────────────────────┐
│              VERCEL SERVERLESS EDGE FUNCTIONS                   │
│           (Next.js 16 API Route Handlers)                       │
│                                                                 │
│  /api/analyze        → Contract analysis (60s timeout)          │
│  /api/analyze-advanced → Deep analysis + ML insights            │
│  /api/drafting       → AI contract generation (60s timeout)     │
│  /api/chat           → RAG conversational Q&A                   │
│  /api/negotiate      → Negotiation strategy generation          │
│  /api/negotiate-live → Real-time negotiation session            │
│  /api/detect-clauses → Clause category detection (45s timeout)  │
│  /api/extract-text   → Raw text extraction microservice         │
│  /api/contracts      → CRUD for contract repository             │
│  /api/dashboard      → Aggregated portfolio analytics           │
│  /api/ml/*           → ONNX embedding + similarity endpoints    │
│  /api/share          → Share link generation                    │
│  /api/templates      → Template library endpoints               │
│  /api/collaboration  → Collab & approval workflow               │
│  /api/lifecycle      → Contract lifecycle management            │
│  /api/playbook       → Negotiation playbook CRUD                │
│  /api/pdf/*          → PDF utility tools                        │
└────┬─────────────────────────────────────────────────┬──────────┘
     │                                                 │
     ▼                                                 ▼
┌─────────────────────┐                 ┌──────────────────────────┐
│   AI LAYER          │                 │   DATA PERSISTENCE LAYER │
│                     │                 │                          │
│  NVIDIA NIM API     │                 │  Prisma ORM v5           │
│  ─────────────      │                 │  ──────────────          │
│  Model: Llama 3.3   │                 │  PostgreSQL (Supabase)   │
│   70B Instruct      │                 │                          │
│  (primary)          │                 │  Tables:                 │
│                     │                 │  - users                 │
│  Fallback:          │                 │  - contracts             │
│  Llama 3.1 70B      │                 │  - analyses              │
│                     │                 │  - contract_versions     │
│  Fast tasks:        │                 │  - comments              │
│  Llama 3.1 8B       │                 │  - contract_collaborators│
│                     │                 │  - approval_workflows    │
│  Google Gemini      │                 │  - lawyers               │
│  (alternate)        │                 │  - consultations         │
│                     │                 │  - templates             │
│  ─────────────      │                 │  - notifications         │
│  LOCAL ML ENGINE    │                 │  - api_keys / webhooks   │
│                     │                 │  - audit_log             │
│  @xenova/transformers│                │  - analyzed_contracts    │
│  MiniLM-L6-v2 ONNX │                 │                          │
│  384-dim embeddings │                 └──────────────────────────┘
│                     │
│  In-memory Cache    │
│  (24h TTL Map)      │
│                     │
│  LEDGAR Corpus      │
│  (250 clauses)      │
└─────────────────────┘
```

---

## 3. The Dual AI Pipeline — Core Architectural Decision

This is the **most important architectural decision** in the project.

### Why Two Pipelines?

A pure LLM approach has a critical weakness: it is **non-deterministic**. Ask the same question twice, get slightly different answers. You cannot reliably compute an exact similarity score or perform mathematical comparisons with an LLM.

The solution is a **dual pipeline**:

```
Uploaded Contract Text
         │
         ├──────────────────────────────────────────────────────────┐
         │                                                          │
         ▼                                                          ▼
 PIPELINE 1: GENERATIVE AI                           PIPELINE 2: LOCAL ML (ONNX)
 ─────────────────────────                           ──────────────────────────
 NVIDIA NIM → Llama 3.3 70B                          @xenova/transformers
                                                      MiniLM-L6-v2 model
 What it does:                                        
 • Deep contextual reasoning                         What it does:
 • Clause extraction & classification                • Converts text → 384-dim vector
 • Risk scoring (0–100)                              • Cosine similarity search
 • Plain-language explanations                       • k-NN clause classification
 • Red flag identification                           • Industry benchmark comparison
 • Negotiation strategy generation                   • Portfolio semantic clustering
 • Contract drafting                                 
 • RAG chat Q&A                                      Characteristics:
                                                      • Deterministic (same input = same output)
 Characteristics:                                    • Sub-10ms cache hit latency
 • ~10–45 second response time                       • Runs locally in Node.js (no API cost)
 • 100,000 char context window                       • 23MB ONNX model (downloaded once)
 • 4,096 max output tokens                           
 • External API (costs money)                        Data source: LEDGAR legal corpus
                                                      (250 pre-embedded standard clauses)
```

### How They Work Together

```
User uploads contract PDF
        │
        ▼
1. Text Extraction
   └── PDF  → pdf-parse
   └── DOCX → mammoth.js
   └── TXT  → direct read
        │
        ▼
2. Text sanitization
   (remove unprintable chars, normalize whitespace, truncate to 100,000 chars)
        │
        ├────────────────────────────────────────┐
        ▼                                        ▼
3a. LLM Analysis (Llama 3.3 70B)         3b. ONNX Embedding (MiniLM)
    - Build prompt with jurisdiction           - getEmbedding(text)
    - Call NVIDIA NIM API                      - Returns number[384]
    - Parse JSON response                      - Stored in 24h TTL Map
    - Returns full analysis                         │
        │                                           ▼
        │                                    Cosine similarity vs
        │                                    LEDGAR corpus vectors
        │                                    → k-NN classification
        │                                    → Risk benchmark %
        │                                    → Safer clause recommendation
        │                                           │
        └──────────────────────┬────────────────────┘
                               ▼
4. Combined Result Returned to Client
   - riskScore, clauses, redFlags (from LLM)
   - mlInsights, benchmarking (from ONNX)
        │
        ▼
5. Async DB write (Prisma → Supabase PostgreSQL)
   (Does NOT block the API response — fire and forget)
```

---

## 4. Entry Points — Where Does Execution Begin?

| Entry Point | File | What Happens |
|---|---|---|
| **Browser request** | `app/layout.tsx` | ClerkProvider wraps entire app; Navbar + Footer rendered; JSON-LD SEO schemas injected |
| **Landing page** | `app/page.tsx` | 29KB React component with hero, features, testimonials, CTA |
| **Any API call** | `app/api/*/route.ts` | Next.js Route Handler; runs as Vercel serverless function |
| **Auth middleware** | Auth provided by Clerk.js + `auth.ts` (NextAuth fallback) | Session validation on protected routes |
| **DB access** | `lib/prisma.ts` | Singleton Prisma Client instance |
| **LLM call** | `lib/nvidia-client.ts` | Central `createNvidiaClient()` using `openai` SDK pointed at NVIDIA endpoint |
| **ONNX embedding** | `lib/ml/embeddings.ts` | `EmbeddingsPipeline.getInstance()` — lazy-loads 23MB ONNX model once per cold start |
| **Semantic search** | `lib/ml/retrieval.ts` | `findSimilarClause()` — embeds query, runs cosine similarity on LEDGAR |
| **Portfolio cache** | `lib/ml/portfolio-cache.ts` | `getCachedEmbedding()` / `setCachedEmbedding()` — 24h TTL Map |

---

## 5. Security Architecture

Security is implemented in **multiple defensive layers**:

| Layer | Mechanism | What It Protects |
|---|---|---|
| **API Key Isolation** | NVIDIA_API_KEY, CLERK_SECRET_KEY, DATABASE_URL never sent to client | Prevents credential theft |
| **HTTP Security Headers** | CSP, HSTS, X-Frame-Options, Referrer-Policy (in `next.config.ts`) | XSS, clickjacking, MITM |
| **Payload Sanitization** | All PDF/DOCX text stripped of unprintable chars before LLM prompt | Prompt injection defense |
| **File Size Limits** | 10MB for chat, 20MB for PDF utilities | Denial-of-Wallet / DoS protection |
| **Character Limit** | 100,000 chars max sent to LLM | Context window overflow + cost control |
| **XSS Sanitization** | DOMPurify on AI-generated HTML before rendering | Cross-Site Scripting |
| **Auth** | Clerk.js session validation | Unauthorized access to private routes |
| **Audit Logging** | `audit_log` DB table tracks all actions | Forensic trail |

---

## 6. Performance Architecture

| Optimization | Mechanism | Impact |
|---|---|---|
| **Async DB writes** | `prisma.create()` called after API response returned | User sees result instantly; DB write happens in background |
| **ONNX model caching** | `globalThis.pipelinePromise` singleton pattern | Model loaded once per process; subsequent calls are instant |
| **Embedding TTL cache** | In-memory Map, 24h TTL, FIFO eviction at 500 entries | Cache hit = <10ms vs ~500ms cold embed |
| **Client-side PDF export** | `window.print()` instead of server-side puppeteer | Zero server CPU; no extra deps |
| **Streaming responses** | Where applicable, LLM responses streamed | Reduces perceived TTFB |
| **React Compiler** | `reactCompiler: true` in `next.config.ts` | Auto-memoization of components |
| **Image compression** | `sharp` library | Optimized image delivery |
| **DNS prefetch** | `app/layout.tsx` preconnects to NVIDIA, fonts, Clerk | Reduces TCP handshake time |

---

## 7. Deployment Architecture

```
GitHub Repository (main branch)
        │
        ▼ (webhook on push)
Vercel Build Pipeline
        │
        ├── npm install
        ├── prisma generate (Prisma Client codegen)
        ├── next build (TypeScript check → RSC compilation → static optimization)
        └── Deploy to Vercel Edge Network
                │
                ├── Static assets → Vercel CDN (global edge)
                ├── API routes → Vercel Serverless Functions (US regions)
                │   ├── /api/analyze    → maxDuration: 60s
                │   ├── /api/drafting   → maxDuration: 60s
                │   ├── /api/negotiate  → maxDuration: 60s
                │   └── /api/detect-clauses → maxDuration: 45s
                └── Live URL: https://beforeyousign.vercel.app

Database:
  Supabase (hosted PostgreSQL)
    ├── DATABASE_URL  → connection pooled (PgBouncer)
    └── DIRECT_URL    → direct connection (for migrations)

Schema sync:
  Manual: npx prisma db push (run during deployment window)
```

---

## 8. Development Maturity Timeline

The project was built across 3 internal phases before reaching current state:

| Phase | State | Description |
|---|---|---|
| **Phase 1 (Prototype)** | ~45–50% mature | UI built, AI analysis working, but: everything mocked, no DB, no real auth connection, 6,000 char limit, chat was regex-only |
| **Phase 2 (Hardening)** | ~75–80% mature | Context limit expanded to 100,000 chars, real RAG chat, OOM protection, JSON repair engine added, build stabilized |
| **Phase 3 (Max ROI)** | ~88–92% mature | DB activated (contracts/dashboard/drafts live), export suite added, version comparison activated, ML pipeline added |

---

## 9. Known Architectural Debt

| Issue | Details | Risk |
|---|---|---|
| **Dual Auth** | Both Clerk.js and NextAuth.js coexist; APIs were "decoupled" from strict auth during development to unblock features | Auth bypass in API routes — must be secured before production scale |
| **In-memory cache** | Embedding cache lives in Node.js process memory; dies on cold start | Cache bypass on every Vercel cold start; adds ~500ms latency |
| **Schema overloading** | Drafts stored in `AnalyzedContract` with `contractType: "Draft"` instead of a dedicated table | Mixing analysis and drafts in one table creates query complexity |
| **Mock user DB** | `auth.ts` has a `Map<string, User>` in-memory store for credentials auth | Not persisted — resets on server restart; not production-safe |
| **Large `templates-data.ts`** | `lib/templates-data.ts` is 121KB — a massive in-memory data dump | Bundle size impact; should be moved to DB |
| **41 page routes** | Many may be UI stubs without full backend integration | Unknown which routes are complete vs placeholder |
