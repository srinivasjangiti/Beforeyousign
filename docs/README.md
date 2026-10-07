# BeforeYouSign — Project Documentation

Welcome to the official documentation for **BeforeYouSign**, an AI-powered legal intelligence platform that simplifies contract analysis, clause benchmarking, and legal document workflows.

This documentation is written to be **objective, factual, simple, and detailed**. It describes the system as it is actually implemented in the codebase—without marketing hype, exaggerated metrics, or unnecessary complexity.

---

## 📚 Documentation Index

| Guide | Description |
|---|---|
| [1. System Architecture](architecture.md) | High-level system design, the dual-pipeline AI architecture, data flows, and tech stack choices. |
| [2. Features & User Workflows](features.md) | A complete walkthrough of all user-facing modules: Contract Analyzer, Drafter, Chat, PDF Suite, and more. |
| [3. Machine Learning & Vector Engine](ml-engine.md) | Deep dive into ONNX runtime embeddings (`all-MiniLM-L6-v2`), LEDGAR precedents, k-NN classification, and similarity scoring. |
| [4. API Reference](api-reference.md) | Complete endpoint catalog for analysis, machine learning, drafting, chat, and PDF operations with request/response schemas. |
| [5. Chrome Browser Extension](chrome-extension.md) | Guide to the Manifest V3 browser extension: architecture, DOM scanning, in-page risk highlighting, and installation. |
| [6. Development & Setup Guide](development-guide.md) | Step-by-step setup instructions, environment variables explanation, database setup, and troubleshooting. |
| [7. Project Slide Deck](presentation.md) | 16-slide presentation deck (Marp-compatible) with architecture diagrams, ERR math, and speaker notes. |

---

## 🎯 Core Philosophy & Design Principles

1. **Dual-Pipeline Strategy:** 
   Instead of sending everything to an external Large Language Model (which can be slow, expensive, and non-deterministic), BeforeYouSign pairs a **local edge vector engine** with a **generative LLM**. Fast mathematical comparisons (embeddings, cosine similarity, k-NN) run on-device or on serverless nodes, while deep legal reasoning runs via modern instruction-tuned LLMs.

2. **Privacy First for Document Manipulation:**
   Routine document operations (merging pages, splitting exhibits, rotating scans) run entirely client-side using WebAssembly and `pdf-lib`, so users don't need to upload sensitive legal documents to third-party file converters.

3. **Plain-English Explanations:**
   Contracts are full of deliberately opaque legalese. The goal of the platform is to translate complex indemnity clauses, uncapped liabilities, and non-compete traps into plain, transparent language with actionable counter-clauses.

4. **Modular & Resilient Architecture:**
   Built on the Next.js 16 App Router, Prisma ORM, and OpenAI-compatible clients. If a primary model or service experiences downtime, the system implements graceful retries and fallbacks.

---

## 🚀 Quick Navigation

- Looking to run the project locally? Head straight to the [Development & Setup Guide](development-guide.md).
- Want to understand how contract risk scores and embeddings work? Read the [Machine Learning Engine Guide](ml-engine.md).
- Looking for backend routes and API payloads? Check out the [API Reference](api-reference.md).
