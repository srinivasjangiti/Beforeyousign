# Development & Setup Guide

This guide provides step-by-step instructions for configuring, running, and developing **BeforeYouSign** locally.

---

## 1. Prerequisites

Before setting up the project, ensure you have the following installed:
- **Node.js:** Version `20.x` or higher (LTS recommended).
- **npm:** Included with Node.js (or `pnpm` / `yarn`).
- **PostgreSQL Database:** A local PostgreSQL instance or a free cloud database like [Supabase](https://supabase.com) or [Neon](https://neon.tech).
- **NVIDIA NIM API Key:** Free developer keys can be generated at [build.nvidia.com](https://build.nvidia.com/).

---

## 2. Environment Variables Setup

Create a `.env` file in the root directory by copying the provided `.env.example`:

```bash
cp .env.example .env
```

### Detailed Environment Variable Reference

| Variable | Required | Description | Example |
|---|---|---|---|
| `NVIDIA_API_KEY` | **Yes** | API key used for Llama 3.3 / Llama 3.1 contract reasoning. | `nvapi-...` |
| `DATABASE_URL` | **Yes** | Connection string for PostgreSQL database via Prisma. | `postgresql://user:pass@host:5432/db` |
| `DIRECT_URL` | Optional | Direct connection string when using pooled database providers like Supabase. | `postgresql://user:pass@host:5432/db` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Optional | Publishable key for Clerk User Authentication. | `pk_test_...` |
| `CLERK_SECRET_KEY` | Optional | Secret key for Clerk backend token verification. | `sk_test_...` |
| `AUTH_SECRET` | Optional | Random 32-byte secret if using NextAuth (`openssl rand -base64 32`). | `...` |
| `GOOGLE_AI_API_KEY` / `GEMINI_API_KEY` | Optional | Secondary fallback generative AI key. | `AIzaSy...` |
| `NEXT_PUBLIC_APP_URL` | Optional | Base URL for links and social cards (default: `http://localhost:3000`). | `http://localhost:3000` |
| `ANALYZE_MAX_PROMPT_CHARS` | Optional | Maximum text characters sent to LLM per analysis (default: `100000`). | `100000` |
| `ANALYZE_MAX_OUTPUT_TOKENS` | Optional | Maximum token limit for model response (default: `4096`). | `4096` |

---

## 3. Installation Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Synchronize Database Schema
Generate the Prisma Client and push the database schema to your PostgreSQL database:
```bash
npx prisma generate
npx prisma db push
```

### Step 3: Verify Precedent Data
The precomputed LEDGAR legal precedents and embeddings are already included in `data/`:
- `data/legal-precedents.json`
- `data/legal-precedents-embeddings.json`

If you ever wish to re-fetch or regenerate new embeddings from scratch:
```bash
node scripts/fetch_ledgar.mjs
node scripts/generate_embeddings.mjs
```

### Step 4: Start the Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note on First Run:** When you analyze a contract or run a semantic similarity search for the first time, `@xenova/transformers` will download the quantized ONNX embedding model weights (`all-MiniLM-L6-v2`, ~23MB) from Hugging Face. This occurs once and is cached on your system for all future requests.

---

## 4. Key Scripts & Commands

| Command | Action |
|---|---|
| `npm run dev` | Starts the Next.js development server with hot-reloading |
| `npm run build` | Compiles the application for production deployment |
| `npm run start` | Boots the compiled production server |
| `npm run lint` | Runs ESLint 9 checks across TypeScript and React code |
| `npm run verify` | Full CI verification suite: linting + `tsc --noEmit` + build |
| `npm run clean` | Cleans `.next` build caches and temporary log files |

---

## 5. Troubleshooting & FAQ

### Q: Why does the first semantic search take ~5-10 seconds?
On the first invocation, the local transformer runtime downloads the 23MB ONNX embedding model and initializes the in-memory graph. Once initialized, subsequent vector embeddings execute in approximately 50 milliseconds.

### Q: What if I hit an NVIDIA NIM rate limit (HTTP 429)?
The platform includes built-in exponential backoff retries in `lib/contract-analyzer.ts`. If you exceed free tier limits, you can configure fallback credentials using `GOOGLE_AI_API_KEY` or increase timeout thresholds via `NVIDIA_REQUEST_TIMEOUT_MS`.

### Q: Can I run BeforeYouSign without PostgreSQL?
The core `/analyze` and `/tools` features work in-memory without persistent database storage. However, saving contracts to your user dashboard (`/dashboard`), tracking renewal alerts (`/renewals`), and saving negotiation histories require a connected PostgreSQL database.
