<div align="center">

# ⚖️ BeforeYouSign

### The Intelligent Legal Operating System
**AI-Powered Contract Analysis • Semantic Risk Benchmarking • Automated Redlining • Legal Due Diligence**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![ONNX Runtime](https://img.shields.io/badge/ONNX_Transformers-all--MiniLM--L6--v2-yellow?style=for-the-badge&logo=onnx&logoColor=white)](https://huggingface.co/Xenova/all-MiniLM-L6-v2)
[![NVIDIA NIM](https://img.shields.io/badge/NVIDIA_NIM-Llama_3.1-76B900?style=for-the-badge&logo=nvidia&logoColor=white)](https://build.nvidia.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://beforeyousign.vercel.app)

<br />

[Explore Live Demo](https://beforeyousign.vercel.app) • [Chrome Extension](#-chrome-browser-extension) • [Features](#-core-features) • [Architecture](#-dual-pipeline-architecture) • [Quickstart](#-getting-started)

</div>

---

## 📖 Overview

**BeforeYouSign** is an end-to-end, enterprise-grade AI legal platform designed to democratize legal comprehension and empower individuals, founders, and legal teams before they commit to legally binding contracts.

Modern agreements are intentionally convoluted. BeforeYouSign demystifies legal jargon using a **dual-pipeline intelligence architecture**:
1. **Generative LLM Reasoning (NVIDIA NIM / Llama 3.3 & Gemini):** Contextual red-flag analysis, financial exposure calculations, counter-clause synthesis, and natural language contract negotiation.
2. **Local Edge Embeddings & Vector Benchmarking (ONNX MiniLM-L6-v2):** Fast, zero-API-cost 384-dimensional semantic similarity matching against thousands of SEC-filed clauses from the curated **LEDGAR corpus**, producing deterministic **Estimated Risk Reduction (ERR)** metrics and k-NN classification.

---

## 📚 Documentation

Detailed, unbiased, and straightforward guides are available in the [`docs/`](./docs) directory:

- 🏛️ [**System Architecture**](./docs/architecture.md) — Dual-pipeline AI architecture, request flows, and component breakdown.
- ✨ [**Features & User Workflows**](./docs/features.md) — Comprehensive guide to the Analyzer, Precedent Benchmarking, Drafter, and PDF Tools.
- 🧠 [**Machine Learning & Vector Engine**](./docs/ml-engine.md) — ONNX MiniLM runtime, LEDGAR precedent embeddings, k-NN, and ERR metric formulas.
- 🔌 [**API Reference**](./docs/api-reference.md) — Detailed catalog of all `/api/*` endpoints with request and response payloads.
- 🧩 [**Chrome Browser Extension**](./docs/chrome-extension.md) — Manifest V3 architecture, in-page DOM highlight mechanics, and installation.
- 🛠️ [**Development & Setup Guide**](./docs/development-guide.md) — Step-by-step local setup, environment variables, Prisma migrations, and troubleshooting.
- 📊 [**Slide Presentation Deck**](./docs/presentation.md) — 16-slide presentation deck (Marp-ready) with architecture diagrams and speaker notes.

---

## 🏛️ Dual-Pipeline Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Interface"]
        UI["Web App (Next.js 16 + React 19)"]
        EXT["Chrome Extension (Manifest V3)"]
        DOC["Upload: PDF, DOCX, TXT"]
    end

    subgraph EdgeML ["Deterministic Edge ML Engine"]
        ONNX["@xenova/transformers (ONNX)"]
        EMBED["all-MiniLM-L6-v2 (384-dim Vectors)"]
        LEDGAR[("LEDGAR Corpus Precedents")]
        KNN["k-NN Classifier & Cosine Similarity"]
        ERR["Estimated Risk Reduction (ERR) Score"]
    end

    subgraph GenAI ["Generative Intelligence Tier"]
        NVIDIA["NVIDIA NIM (Llama 3.1 70B/405B)"]
        GEMINI["Google Gemini / Fallback Pipeline"]
        RAG["Clause Dissection & RAG Context"]
        REDLINE["Redline Generator & Plain-English Explainer"]
    end

    subgraph DataSecurity ["Data & Security Tier"]
        DB[("PostgreSQL via Prisma ORM")]
        SUPA[("Supabase Storage & Realtime")]
        AUTH["Clerk / NextAuth Authentication"]
        CRYPTO["SHA-256 Cryptographic Fingerprint"]
    end

    DOC --> UI
    UI --> EdgeML
    EXT --> UI
    UI --> GenAI
    EdgeML --> KNN --> ERR --> UI
    GenAI --> RAG --> REDLINE --> UI
    UI --> DataSecurity
```

---

## ✨ Core Features

### 🔍 1. AI Contract Risk Analyzer
- **Multi-Format Ingestion:** Instant parsing of `.pdf`, `.docx`, and `.txt` files with automated text extraction.
- **Holistic Risk Scoring:** Deterministic 0–100 risk scoring with color-coded classification:
  - 🔴 **Critical:** Severe liability traps, unilateral indemnification, perpetual non-competes.
  - 🟠 **High:** Onerous termination penalties, uncapped damages, ambiguous IP assignment.
  - 🟡 **Medium:** Unbalanced payment terms, vague service SLAs, broad audit rights.
  - 🟢 **Low / Fair:** Standard bilateral protections and standard boilerplate.
- **Financial Exposure Estimation:** Quantifies worst-case monetary risks and fee liabilities buried in fine print.
- **Multi-Format Export:** Download executive summaries and clause audits in **PDF, DOCX, JSON, or Markdown**.

### 📊 2. Semantic Portfolio & LEDGAR Benchmarking
- **Precedent Matching:** Vectorizes clauses directly in-memory using `all-MiniLM-L6-v2` and calculates cosine similarity against the curated LEDGAR legal precedent corpus.
- **Estimated Risk Reduction (ERR):** Quantifies percentage risk reduction achieved by adopting market-standard alternative language.
- **k-NN Clause Categorization:** Autonomously classifies unknown or obfuscated clauses into standard categories (Termination, Confidentiality, Indemnification, Governing Law, etc.).

### ✍️ 3. Smart Contract Drafter & Redlining
- **Generative Drafting:** Custom agreement generation for NDAs, SaaS SLAs, Employment, Freelance Agreements, and Commercial Leases.
- **Side-by-Side Redlining:** Visual diff comparison powered by `diff-match-patch` comparing current text vs. proposed fairer revisions.
- **Negotiation Playbook:** Tactical scripts, leverage points, counter-proposals, and concession strategies tailored to counter-party type.

### 💬 4. Document-Grounded Legal Chat
- **RAG-Powered Q&A:** Interrogate uploaded contracts in real time.
- **Query Examples:**
  - *"Can they terminate this contract without cause?"*
  - *"What are my non-compete geographic restrictions?"*
  - *"Is my IP transferred upon creation or upon final payment?"*

### 📅 5. Obligation Tracker & Renewal Calendar
- **Milestone Extraction:** Automatically parses renewal deadlines, notice periods, opt-out dates, and payment milestones.
- **Proactive Notifications:** Calendar integration to prevent predatory auto-renewals.

### 🛡️ 6. Regulatory & Security Compliance Scanner
- **Framework Audits:** Scans agreements against **GDPR, CCPA, HIPAA, SOC 2**, and standard data privacy frameworks.
- **Vendor Risk Profiling:** Flags missing Data Processing Agreements (DPAs) and cross-border transfer liabilities.

### 🖋️ 7. Cryptographic E-Signatures & Blockchain Anchoring
- **Built-in Signing:** Smooth canvas-based digital signatures without third-party dependencies.
- **SHA-256 Fingerprinting:** Generates tamper-evident cryptographic hashes of executed agreements for non-repudiation.

### 🛠️ 8. Zero-Server-Upload PDF Suite
- **Privacy-First Client Processing:** Fast in-browser manipulation of legal documents:
  - **Merge:** Combine multiple exhibits, schedules, and addendums.
  - **Split:** Extract signature blocks or specific schedules.
  - **Rotate:** Reorient scanned multi-page agreements.
  - **Convert:** High-resolution image-to-PDF and PDF-to-image conversion.

### 🌐 9. Global Legal Support & Voice Assistant
- **Multi-Language Analysis:** Analyzes agreements in English, Spanish, French, German, Hindi, and more with localized jurisdictional context.
- **Voice Assistant:** Hands-free speech-to-text contract querying and audio briefings.

### 📑 10. Smart Template Builder & Customization
- **Dynamic Questionnaires:** Step-by-step modular questionnaire to generate customized commercial agreements.
- **Variable Placeholders:** Live previews with real-time updates as variables (parties, governing law, deal size) are populated.

### 🔄 11. Version Comparison & Clause Library
- **Contract Diffing (`/compare`):** Side-by-side semantic comparison showing material vs. stylistic changes between revisions.
- **Verified Clause Repository (`/clauses`, `/library`):** Searchable legal clause bank filtered by negotiation posture (*Pro-Vendor*, *Balanced*, *Pro-Customer*).

### 👥 12. Team Collaboration & Lifecycle Automation
- **Expiring Share Links (`/share`):** Secure share links allowing outside counsel to review analysis reports without an account.
- **Lifecycle Progression (`/automation`):** Conditional routing and automated status transitions (*Draft → Review → Signed → Active*).

### 🎓 13. Academic Research Whitepaper (`/research`)
- **Empirical Methodology:** Embedded reader for the research paper on transformer-based semantic retrieval and SEC EDGAR precedent benchmarking.

---

## 🧩 Chrome Browser Extension

Experience **"Grammarly for Contracts"** while browsing online contracts, terms of service, and sign-up flows:

- 🎨 **In-Page Wavy Underlines:** Automatically underlines risky clauses in real-time (Red = Critical, Orange = High, Yellow = Medium).
- 💡 **Interactive Tooltips:** Hover over any underlined text for an instant plain-English breakdown and safer suggested wording.
- 📊 **Quick Risk Panel:** One-click popup gauge displaying the page's aggregate risk index.
- ⌨️ **Shortcuts:** `Ctrl+Shift+B` to re-analyze, `Ctrl+Shift+H` to toggle highlights.

> Located in [`browser-extension/`](./browser-extension) — load as an unpacked extension in Chrome Developer Mode.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & Icons** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/) |
| **AI / Large Language Models** | [NVIDIA NIM](https://build.nvidia.com/) (`meta/llama-3.3-70b-instruct`, `meta/llama-3.1-8b-instruct`), [Google Gemini AI](https://ai.google.dev/) |
| **Local Vector & ML Engine** | [@xenova/transformers](https://github.com/xenova/transformers.js) (ONNX Runtime, `all-MiniLM-L6-v2`), Cosine Similarity |
| **Document Parsing & Generation** | `pdf-lib`, `pdf-parse`, `mammoth` (DOCX), `docx`, `jspdf`, `html2canvas`, `sharp` |
| **Database & Persistence** | [Prisma ORM](https://www.prisma.io/), [Supabase](https://supabase.com/) / [PostgreSQL](https://www.postgresql.org/) |
| **Authentication** | [Clerk](https://clerk.com/) & [NextAuth.js](https://authjs.dev/) |
| **Testing & CI** | [Playwright](https://playwright.dev/), [ESLint 9](https://eslint.org/) |

---

## 📂 Repository Structure

```text
BeforeYouSign/
├── app/                         # Next.js 16 App Router (Pages & API endpoints)
│   ├── analyze/                 # Core AI contract analysis workspace
│   ├── benchmark/               # Precedent benchmarking & ERR explorer
│   ├── chat/                    # Legal RAG conversational assistant
│   ├── drafting/                # AI contract generation engine
│   ├── esignature/              # Digital signature & hashing canvas
│   ├── obligations/             # Extracted contractual milestone tracker
│   ├── compliance/              # Regulatory scanner (GDPR/CCPA/HIPAA)
│   ├── tools/                   # Client-side PDF engine (merge/split/rotate)
│   ├── lawyers/                 # Legal marketplace & booking
│   └── api/                     # Serverless API routes (AI, ML, PDF, Auth)
├── browser-extension/           # Chrome Manifest V3 extension
│   ├── content.js               # In-page DOM scanner & wavy underliner
│   ├── popup/                   # Extension popup interface & risk score
│   └── manifest.json            # Manifest configuration
├── components/                  # Reusable UI component library
│   ├── AnalysisResult.tsx       # Detailed contract risk report & exports
│   ├── ClauseCard.tsx           # Interactive clause breakdown card
│   ├── RiskGauge.tsx            # Animated SVG risk meter
│   └── pdf-tools/               # PDF manipulation workspace components
├── data/                        # Datasets & vector embeddings
│   ├── legal-precedents.json    # Curated LEDGAR corpus clauses
│   └── legal-precedents-embeddings.json # 384-dim precomputed embeddings
├── lib/                         # Core engines & business logic
│   ├── nvidia-client.ts         # NVIDIA NIM API client & model fallbacks
│   ├── ml/                      # ONNX embedding, similarity & k-NN logic
│   ├── pdf-engine/              # Robust client-side PDF manipulation
│   ├── document-parser.ts       # Text extractor for PDF/DOCX/TXT
│   └── supabase/                # Supabase database & storage clients
├── prisma/                      # Prisma ORM schema & migrations
├── public/                      # Static assets, demo contracts & icons
└── scripts/                     # Dataset seeding & embedding utilities
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** `v20.x` or higher
- **Package Manager:** `npm`, `pnpm`, or `yarn`
- **Database:** PostgreSQL (e.g. Supabase, Neon, or local PostgreSQL instance)
- **API Key:** NVIDIA NIM API key (Free access at [build.nvidia.com](https://build.nvidia.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/srinivasjangiti/Beforeyousign.git
   cd Beforeyousign
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your API credentials:
   ```env
   # Generative AI (NVIDIA NIM)
   NVIDIA_API_KEY=your_nvidia_api_key_here

   # Database (PostgreSQL / Supabase)
   DATABASE_URL=postgresql://user:password@host:port/dbname
   DIRECT_URL=postgresql://user:password@host:port/dbname

   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

   # Public App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Initialize database schema:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note on Local ML Model:** On first execution of a semantic search or benchmark, the 23MB ONNX embedding model (`all-MiniLM-L6-v2`) will be downloaded and cached automatically by Transformers.js.

---

## 🔑 Key Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the Next.js development server at `localhost:3000` |
| `npm run build` | Generates Prisma client and compiles production build |
| `npm run start` | Boots the compiled Next.js production server |
| `npm run lint` | Runs ESLint verification across TypeScript and JSX files |
| `npm run verify` | Full CI verification (`lint` + `tsc --noEmit` + `build`) |
| `npm run clean` | Purges `.next` build caches and log artifacts |

---

## 🔒 Security & Privacy

- **Zero Data Retention by Default:** Uploaded documents are parsed in transient server memory and are never used to train public LLM models.
- **Client-Side PDF Engine:** Merging, splitting, and rotating operations execute locally in the user's browser using WebAssembly.
- **Encrypted Transmission:** All requests enforce TLS 1.3 in production with strict CORS headers.
- **Cryptographic Fingerprinting:** Executed documents are hashed client-side with SHA-256 for immutable integrity validation.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by [Srinivas Jangiti](https://github.com/srinivasjangiti)

*Disclaimer: BeforeYouSign provides AI-assisted analysis and legal informational summaries. It does not constitute formal legal advice or substitute for qualified legal counsel.*

</div>
