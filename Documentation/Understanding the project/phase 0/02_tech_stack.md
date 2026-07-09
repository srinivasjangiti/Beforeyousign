# Tech Stack Document — BeforeYouSign
### Phase 0 Deliverable | Deep Detail Version

---

## Overview

BeforeYouSign is written entirely in **TypeScript**. It runs on **Next.js 16 App Router** — a fullstack framework that handles both the React UI (frontend) and the serverless API (backend) in one codebase. All backend logic runs as **Vercel Serverless Functions** — there is no dedicated always-on server.

---

## Layer 1: Frontend

### Framework — Next.js 16.0.7 (App Router)

Next.js is the backbone. It provides:

- **App Router** (`app/` directory) — file-system-based routing where every `page.tsx` is a route
- **React Server Components (RSC)** — components that render on the server and send only HTML to the browser (no JS shipped for those components)
- **Client Components** — interactive components marked with `"use client"` that run in the browser
- **API Route Handlers** — `app/api/*/route.ts` files that become serverless endpoints
- **React Compiler** — enabled in `next.config.ts` (`reactCompiler: true`) for automatic component memoization
- **Image optimization** via `sharp`

### UI Library — React 19.2.0

The UI is built entirely in React. State management uses only built-in React hooks (`useState`, `useEffect`, `useRef`, `useCallback`) — no Redux, no Zustand, no external state library.

### Styling — Tailwind CSS 4.x

Utility-first CSS framework. Version 4 is a major rewrite of Tailwind — it uses a CSS-native approach (no `tailwind.config.js` needed, config is done in CSS). PostCSS is configured via `postcss.config.mjs`.

> **Note:** Despite the docs saying Next.js 14 in `Major_Project.md`, the actual `package.json` shows `"next": "16.0.7"` and `"react": "19.2.0"` — the docs are outdated. The actual code is on newer versions.

### Icons — Lucide React 0.556.0

A library of clean, scalable SVG icons. Used throughout the UI for all iconography.

### Charts — Recharts 2.15.0

React-based charting library using SVG. Used in:
- `components/AdvancedAnalyticsDashboard.tsx`
- `components/AnalyticsDashboard.tsx`
- `components/UserDashboard.tsx`
- `components/BusinessIntelligenceDashboard.tsx`
- `components/PredictiveAnalyticsDashboard.tsx`

Renders risk distribution charts, portfolio health visualizations, trend graphs.

### File Upload — react-dropzone 14.3.8

Drag-and-drop file upload zone used in `components/FileUpload.tsx`. Handles MIME type validation (PDF, DOCX, TXT), file size enforcement, and visual feedback.

### PDF Generation — jsPDF 3.0.4 + html2canvas 1.4.1

Used together to:
1. `html2canvas` renders a DOM element into a canvas
2. `jsPDF` embeds that canvas into a PDF

Used in analysis export workflows (`components/AnalysisResult.tsx`).

**Note:** For basic PDF export, `window.print()` is used instead (zero-dependency, native browser, avoids server CPU spikes). jsPDF is used for more complex layouts.

### PDF Manipulation — pdf-lib 1.17.1

Low-level PDF manipulation library used to:
- Embed e-signatures into PDFs
- Programmatically modify PDF metadata
- Used in `components/ESignature.tsx` and PDF tools

### DOCX Export — docx 9.5.1

Generates real Microsoft Word `.docx` files (Office Open XML). Used to export:
- Analysis results
- Generated contract drafts

### Version Comparison — diff-match-patch 1.0.5

Google's diff engine. Used in `lib/version-compare.ts` and `components/VersionComparisonViewer.tsx` to compute character-level diffs between contract versions and highlight additions/deletions.

---

## Layer 2: Backend (API Routes)

### Runtime

All backend code runs as **Node.js Serverless Functions on Vercel**. There is no Express.js, no Fastify — Next.js Route Handlers (the `route.ts` files inside `app/api/`) are the entire backend.

### API Design

All routes follow REST patterns:
- `POST /api/analyze` → upload + analyze a contract
- `POST /api/drafting` → generate a new contract
- `GET /api/contracts` → fetch user's contract repository
- `GET /api/dashboard` → fetch aggregated analytics
- `POST /api/chat` → RAG conversation with a contract
- `POST /api/negotiate` → AI negotiation strategy
- `POST /api/ml/...` → ONNX embedding + semantic search
- etc.

**Function timeouts** (configured in `vercel.json`):
- `/api/analyze` → 60 seconds
- `/api/analyze-advanced` → 60 seconds
- `/api/drafting` → 60 seconds
- `/api/negotiate` → 60 seconds
- `/api/detect-clauses` → 45 seconds

### Document Parsing

| Parser | Library | Input | Output |
|---|---|---|---|
| PDF parser | `pdf-parse` 2.4.5 | `.pdf` binary | raw text string |
| DOCX parser | `mammoth` 1.11.0 | `.docx` binary | HTML or raw text |
| TXT | Native Node.js | `.txt` | raw text string |

Flow: File received via `multipart/form-data` → parsed into `Buffer` → text extracted → sanitized → sent to LLM.

### JSON Repair Engine

Located in `lib/nvidia-client.ts` → `repairTruncatedJson()`.

LLMs sometimes return truncated JSON (e.g., cut off mid-string if token limit hit). This function:
1. Walks the raw string character by character
2. Tracks open `{`, `[`, `"` via a stack
3. Closes any unclosed strings, arrays, objects
4. Removes trailing commas
5. Returns best-effort repaired JSON

This was a **critical fix in Phase 2** that stopped fatal `JSON.parse()` crashes.

### Exponential Backoff

In `lib/contract-analyzer.ts`:
- If NVIDIA returns 429 (rate limit) or 503 (overloaded), the system retries
- Delay = `750ms × 2^(attempt-1)` — starts at 750ms, doubles each retry
- Configured via `ANALYZE_MAX_RETRIES` env var

---

## Layer 3: Database

### ORM — Prisma 5.22.0

Prisma is the data access layer. It provides:
- **Schema** (`prisma/schema.prisma`) — declarative type-safe model definitions
- **Prisma Client** — auto-generated TypeScript client for all DB queries
- **Migrations** (`prisma/migrations/`) — version-controlled schema changes

The Prisma client is instantiated as a singleton in `lib/prisma.ts` to avoid creating too many DB connections in serverless environments.

### Database — PostgreSQL (via Supabase)

- **Supabase** hosts the PostgreSQL database
- Two connection URLs:
  - `DATABASE_URL` → goes through Supabase's **PgBouncer** connection pooler (required for serverless, which creates many short-lived connections)
  - `DIRECT_URL` → direct connection (used for Prisma migrations)

### Schema — Full Table List

| Table | Purpose |
|---|---|
| `users` | All user accounts (email, name, password hash, role, risk tolerance, settings) |
| `accounts` | OAuth provider accounts linked to users (GitHub, Google tokens) |
| `contracts` | Uploaded contract files (content, filename, status, version, lock state) |
| `analyses` | Full AI analysis results per contract (risk score, red flags, clauses, ML insights, benchmarking, negotiation insights) |
| `contract_versions` | Version history of every contract edit with content diffs |
| `comments` | Threaded comments on specific clauses (with mentions, reactions, resolution state) |
| `contract_collaborators` | Per-contract per-user permission grants (edit, comment, approve, share, delete) |
| `approval_workflows` | Multi-stage approval chains for contracts (stages stored as JSON, current stage tracked) |
| `activities` | Audit trail of all user actions (analyze, draft, share, etc.) |
| `api_keys` | Developer API keys with rate limits (per-minute, per-hour, per-day) |
| `api_usage` | Usage logs per API key (endpoint, method, status, response time) |
| `webhooks` | Outbound webhook configurations with event filters and secrets |
| `webhook_deliveries` | Delivery history for each webhook (status, response, retry count) |
| `lawyers` | Lawyer profiles (bar number, jurisdiction, practice areas, hourly rate, ratings) |
| `consultations` | Booked lawyer consultations (lawyer, client, contract, price, meeting URL) |
| `templates` | Legal contract templates (premium/free, category, clauses, price, rating) |
| `template_purchases` | Transaction records for premium template purchases |
| `bookmarks` | User bookmarks for contracts, templates, lawyers |
| `share_links` | Secure analysis share links (password-protected, expiry, view count) |
| `notifications` | In-app notifications (type, message, read state, link) |
| `audit_log` | Security audit trail (action, resource, IP, user agent, result) |
| `analyzed_contracts` | ⚠️ Legacy/parallel table from Phase 1 — simpler schema used by early API routes |

> **Important:** Two analysis tables exist — `analyses` (full schema, the proper one) and `analyzed_contracts` (simpler legacy table from Phase 1). Early API routes (`/api/dashboard`, `/api/contracts`) query `analyzed_contracts`. Newer features use `analyses`. This is a known inconsistency.

---

## Layer 4: AI / Machine Learning

### Pipeline 1 — NVIDIA NIM (Generative AI)

**Model Hierarchy** (defined in `lib/nvidia-client.ts`):

```typescript
const NVIDIA_MODELS = {
  primary:  'meta/llama-3.3-70b-instruct',  // Best quality, used for analysis/drafting
  fallback: 'meta/llama-3.1-70b-instruct',  // High quality backup
  fast:     'meta/llama-3.1-8b-instruct',   // Used for quick tasks / clause detection
};
```

> **Note:** README says "405B" but actual code uses 70B and 8B models. The 405B reference is in the documentation/marketing; the actual `nvidia-client.ts` uses 70B as primary.

**How the NVIDIA client works:**
```
lib/nvidia-client.ts
    │
    ├── createNvidiaClient()
    │   └── new OpenAI({ apiKey, baseURL: 'https://integrate.api.nvidia.com/v1' })
    │       ← Uses the openai npm package but pointed at NVIDIA's OpenAI-compatible endpoint
    │
    ├── generateText(prompt, model, temperature, maxTokens)
    │   └── chat.completions.create() with AbortController timeout
    │
    ├── generateWithSystem(systemPrompt, userPrompt, ...)
    │   └── Messages: [{ role: 'system' }, { role: 'user' }]
    │
    ├── parseJsonResponse<T>(text)
    │   └── Strip markdown fences → JSON.parse → fallback to repairTruncatedJson
    │
    └── repairTruncatedJson(text)
        └── Stack-based parser that closes unclosed JSON structures
```

**Analysis Prompt Structure** (from `lib/contract-analyzer.ts`):
```
You are an expert contract lawyer. Analyze the contract below...
JURISDICTION: {jurisdictionName}
CONTRACT TEXT: {up to 100,000 chars of contract text}
INSTRUCTIONS: {detailed rules about output format constraints}
REQUIRED OUTPUT FORMAT: {massive JSON schema with clauses, redFlags, insights, metadata}
```

**Output JSON structure:**
- `summary` — 2-sentence plain-English overview
- `riskScore` — integer 0–100
- `clauses[]` — each with: title, original text, plain language, risk level, category, concerns, fairness score, industry comparison, negotiation strategy
- `redFlags[]` — each with: type, severity, title, description, affected clauses, recommendation
- `recommendations[]` — top 5 action items
- `suggestedActions[]` — 3 immediate next steps
- `insights` — missing clauses, contradictions, unusual terms, strengths to keep
- `metadata` — document type, parties, dates, governing law, contract value, auto-renewal

### Pipeline 2 — Local ONNX (Deterministic ML)

**Model:** `Xenova/all-MiniLM-L6-v2` (23MB ONNX file, auto-downloaded on first use)

**Runtime:** `@xenova/transformers` 2.17.2 — Transformers.js, which runs ONNX models in Node.js (same models as HuggingFace Python, but compiled for JavaScript)

**Files in `lib/ml/`:**

| File | Purpose |
|---|---|
| `embeddings.ts` | Singleton pipeline; `getEmbedding(text)` → `number[384]`; `getEmbeddingsBatch(texts[])` → `number[][]` |
| `similarity.ts` | `cosineSimilarity(a, b)` — dot product of normalized vectors; `similarityToPercentage(sim)` |
| `retrieval.ts` | `findSimilarClause(text, topK, currentRisk)` — full semantic search pipeline against LEDGAR |
| `portfolio-cache.ts` | `getCachedEmbedding(id)` / `setCachedEmbedding(id, embedding)` — 24h TTL Map with hit/miss metrics |
| `portfolio-similarity.ts` | Computes semantic neighbors across entire user portfolio |
| `clustering.ts` | Groups portfolio contracts by semantic similarity |

**How embedding works (`embeddings.ts`):**
```typescript
// Singleton pattern - model loaded once per process
const globalForPipeline = globalThis as { pipelinePromise: Promise<FeatureExtractionPipeline> };

class EmbeddingsPipeline {
  static model = 'Xenova/all-MiniLM-L6-v2';
  static async getInstance() {
    if (!globalForPipeline.pipelinePromise) {
      globalForPipeline.pipelinePromise = pipeline('feature-extraction', this.model);
    }
    return globalForPipeline.pipelinePromise;
  }
}

// pooling: 'mean' — average all token embeddings into one vector
// normalize: true — L2 normalize so cosine similarity = dot product
const output = await extractor(text, { pooling: 'mean', normalize: true });
return Array.from(output.data); // number[384]
```

**How semantic search works (`retrieval.ts`):**
```
Input: clause text string
   │
   ▼
1. Embed query → number[384]
   │
   ▼
2. For every clause in LEDGAR corpus:
   → Look up its pre-computed embedding from data/legal-precedents-embeddings.json
   → Compute cosineSimilarity(queryVector, dbVector)
   → Push to results[]
   │
   ▼
3. Sort results by similarity DESC
   │
   ▼
4. k-NN Category Prediction:
   → Take top-K results
   → Count category votes (majority wins)
   → confidence = (winner votes / K) × 100
   │
   ▼
5. Risk-Aware Recommendation:
   → Take top 20 similar clauses
   → Filter: only those with riskBenchmark < currentClauseRisk
   → Sort: similarity DESC, risk ASC
   → Return safest high-similarity alternative
   │
   ▼
6. Cache result (key = first 50 chars + topK + currentRisk)
   → FIFO eviction when cache > 500 entries
```

**LEDGAR Corpus:**
- Source: Open-source legal clause dataset
- Location: `data/legal-precedents.json` + `data/legal-precedents-embeddings.json`
- Size: ~250 clauses (Phase 1 corpus; roadmap targets 5,000)
- Each entry: `{ id, category, text, risk_score_benchmark, source }`

**Google Gemini (Alternate LLM):**
- `@google/generative-ai` 0.21.0 is in `package.json`
- `GEMINI_API_KEY` and `GOOGLE_AI_API_KEY` in `.env.example`
- Not the primary pipeline but available as a fallback provider

---

## Layer 5: Authentication

BeforeYouSign has **two auth systems running simultaneously** — a deliberate (if messy) architectural choice made to avoid a risky mid-project rewrite.

### Primary: Clerk.js (`@clerk/nextjs` 6.37.3)

- Handles the **frontend** UI (sign-in modal, user button, session management)
- `<ClerkProvider>` wraps the entire app in `app/layout.tsx`
- Provides `currentUser()` and `auth()` hooks for server components
- Handles OAuth (Google, GitHub) flow management and session tokens
- Full user management UI out of the box
- Production-ready, managed external service

**Environment variables:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY  ← browser-safe key
CLERK_SECRET_KEY                   ← server-only secret
```

### Legacy/Fallback: NextAuth.js v5 Beta (`next-auth` 5.0.0-beta.30)

- Originally the **backend** auth (API route protection)
- Configured in `auth.ts` with:
  - GitHub OAuth provider
  - Google OAuth provider
  - Credentials provider (email + password)
- Uses JWT sessions (30-day expiry)
- **Critical problem:** In-memory `Map<string, User>` is the user database — not persisted to PostgreSQL. Any server restart loses all credential users.
- During Phase 2/3, strict NextAuth checks were **intentionally decoupled** from API routes to unblock features. This means many API routes currently run **without auth protection**.

### Password Handling — bcryptjs 3.0.3

- Password hashing: `bcrypt.hash(password, 10)` — 10 salt rounds
- Password verification: `bcrypt.compare(input, hash)`
- Used in `auth.ts` credentials provider

### OAuth Providers Configured

| Provider | Env Variables | Status |
|---|---|---|
| GitHub | `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` | Configured in NextAuth |
| Google | `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Configured in NextAuth + Clerk |
| Email/Password | `AUTH_SECRET` (JWT secret) | NextAuth only — in-memory store, NOT production-safe |

---

## Layer 6: Hosting & Infrastructure

### Hosting — Vercel

- **CI/CD:** Every push to `main` branch auto-triggers a build
- **Build command:** `prisma generate && next build`
- **Function regions:** Vercel US regions (default)
- **Live URL:** `https://beforeyousign.vercel.app`

### CDN — Vercel Edge Network

- Static assets (JS, CSS, images) served from Vercel's global edge network
- Next.js automatically splits the bundle and optimizes chunk delivery
- DNS prefetch configured for NVIDIA API, Google Fonts, Clerk in `app/layout.tsx`

### Database — Supabase

- Managed PostgreSQL hosting
- PgBouncer connection pooling (required for serverless cold starts)
- Environment: `DATABASE_URL` (pooled) + `DIRECT_URL` (direct)

---

## Layer 7: Third-Party Services

| Service | Purpose | Environment Variable |
|---|---|---|
| **NVIDIA NIM** | Llama 3.3 70B / 3.1 70B / 8B inference | `NVIDIA_API_KEY` |
| **Google Gemini** | Alternate LLM provider | `GEMINI_API_KEY`, `GOOGLE_AI_API_KEY` |
| **Clerk.js** | Auth UI + session management (primary) | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` |
| **Supabase** | PostgreSQL hosting | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| **SendGrid** | Transactional email (notifications) | `SENDGRID_API_KEY`, `EMAIL_FROM` |
| **Google Analytics 4** | User behavior analytics | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| **Sentry** | Runtime error tracking | `NEXT_PUBLIC_SENTRY_DSN` |
| **Salesforce** | CRM integration | `SALESFORCE_CLIENT_ID` |
| **Slack** | Notification integration | `SLACK_CLIENT_ID` |
| **Google OAuth** | Social login | `GOOGLE_CLIENT_ID` |

---

## Layer 8: Browser Extension

A separate Chrome Extension (Manifest V3) located in `browser-extension/`:

| File | Role |
|---|---|
| `manifest.json` | Extension metadata, permissions, content scripts declaration |
| `content.js` | Injected into every webpage; scans page DOM for contract text |
| `background.js` | Service worker; handles API calls to BeforeYouSign backend |
| `content.css` | Styles for the inline analysis overlay |
| `popup/` | Extension popup HTML/JS — shows quick analysis result |
| `options/` | Extension settings page |

**How it works:**
1. Content script detects potential contract text on page
2. User opens popup → "Analyze this contract?"
3. Content script extracts text → passes to background service worker
4. Background worker POSTs to `/api/analyze` on BeforeYouSign
5. Result displayed in popup or as inline overlay on page

---

## Layer 9: Dev & Testing

| Tool | Purpose | Version |
|---|---|---|
| **TypeScript** | Static type checking across entire codebase | 5.x |
| **ESLint** | Code quality, style enforcement | 9.x |
| **Playwright** | End-to-end browser testing | 1.61.1 |
| **`npx prisma generate`** | Regenerates Prisma Client TypeScript types | — |
| **`npm run dev`** | Next.js dev server with hot reload | — |
| **`npm run verify`** | ESLint + `tsc --noEmit` + full build (CI gate) | — |

**Test files:**
- `verify-pdf-tools.spec.ts` — Playwright test for PDF utility flows
- `playwright.config.ts` — Playwright configuration

---

## Complete Dependency Map

### Production (`dependencies`)

```
Core Framework:
  next: 16.0.7
  react: 19.2.0
  react-dom: 19.2.0

Auth:
  @clerk/nextjs: ^6.37.3
  next-auth: ^5.0.0-beta.30
  bcryptjs: ^3.0.3

Database:
  @prisma/client: ^5.22.0
  prisma: ^5.22.0
  @supabase/supabase-js: ^2.89.0
  @supabase/ssr: ^0.8.0

AI / ML:
  @xenova/transformers: ^2.17.2       ← ONNX transformer runtime
  @google/generative-ai: ^0.21.0     ← Google Gemini SDK
  openai: ^6.27.0                    ← Used for NVIDIA NIM (OpenAI-compatible)

Document Processing:
  mammoth: ^1.11.0                   ← DOCX → text
  pdf-parse: ^2.4.5                  ← PDF → text

PDF / Export:
  pdf-lib: ^1.17.1                   ← PDF manipulation (e-signature embed)
  jspdf: ^3.0.4                      ← PDF generation
  html2canvas: ^1.4.1               ← DOM → Canvas → PDF
  docx: ^9.5.1                      ← DOCX generation

UI:
  lucide-react: ^0.556.0            ← Icons
  recharts: ^2.15.0                 ← Charts
  react-dropzone: ^14.3.8           ← File upload

Utilities:
  diff-match-patch: ^1.0.5          ← Text diffing (version compare)
  sharp: ^0.34.5                    ← Image processing/optimization

Dev only:
  @types/bcryptjs, @types/node, @types/react, @types/react-dom
  @types/pdf-parse
  tailwindcss: ^4
  @tailwindcss/postcss: ^4
  typescript: ^5
  eslint: ^9
  eslint-config-next: 16.0.7
  @playwright/test: ^1.61.1
  babel-plugin-react-compiler: 1.0.0
```
