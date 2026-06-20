# BeforeYouSign

BeforeYouSign is a state-of-the-art, AI-powered legal intelligence platform designed to democratize legal expertise. The platform uses a serverless dual-pipeline architecture: generative AI (Llama 3.1 405B) handles deep textual extraction, while a localized ONNX transformer pipeline (MiniLM) powers deterministic risk benchmarking and semantic search.

## 📌 Quick Links for Reviewers & Recruiters
- 📖 [Major Project Report](./Major_Project.md)
- 🧠 [Machine Learning Case Study](./ML_CASE_STUDY.md)
- 🏗️ [Architecture & ML Pipeline Diagrams](./ARCHITECTURE.md)
- 🎓 [Viva Preparation & Technical Defenses](./Viva_Prep.md)

## 🚀 Key Features
- **Semantic Portfolio Discovery:** Instantaneously clusters a user's entire contract portfolio using 384-dimensional cosine similarity embeddings via an ephemeral in-memory cache.
- **Risk-Aware Clause Recommendations:** Retrieves and ranks industry-standard clauses from the LEDGAR corpus, calculating an 'Estimated Risk Reduction' to suggest safer legal language.
- **k-NN Category Prediction:** Classifies unknown clauses by calculating the majority vote of their nearest LEDGAR neighbors.
- **AI Contract Analysis:** Instantly analyze PDFs, DOCXs, or TXT files for risk scores and red flags.
- **Contract Drafting & Chat:** RAG-based conversations and custom legal agreement generation.

## 🛠 Technology Stack
- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Serverless API Routes, Prisma ORM, PostgreSQL
- **Machine Learning:** Transformers.js (ONNX), MiniLM-L6-v2, Cosine Similarity
- **Generative AI:** NVIDIA NIM API (Llama 3.1 405B Instruct)

## 💻 Local Setup
1. `npm install`
2. `npx prisma generate`
3. `npx prisma db push`
4. `node scripts/fetch_ledgar.mjs`
5. `node scripts/generate_embeddings.mjs`
6. `npm run dev`

*Note: The first time you use the ML endpoints, the 23MB ONNX embedding model will be downloaded automatically.*
