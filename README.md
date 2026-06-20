# BeforeYouSign

BeforeYouSign is a state-of-the-art, AI-powered legal intelligence platform designed to democratize legal expertise. The platform enables users to analyze, understand, negotiate, draft, manage, and collaborate on complex legal contracts. By leveraging advanced Natural Language Processing (NLP) models (NVIDIA NIM, Llama 3.1 405B), the system dramatically reduces the time and cost associated with legal review.

## Key Features
- **AI Contract Analysis:** Instantly analyze uploaded PDFs, DOCXs, or TXT files for risk scores and red flags.
- **Contract Chat:** Have a conversational RAG-based interaction with your contract to query specific clauses.
- **Contract Drafting:** Generate custom legal agreements instantly using AI.
- **Dashboard Analytics:** Track portfolio health, risk distributions, and contract volumes.
- **Document Export:** Export analysis results cleanly to PDF or Word (.doc).
- **Comparison & Deltas:** Diff two contracts side-by-side to highlight added/removed clauses.
- **Contract Repository:** Safely persist and manage all your historical documents.

## Technology Stack
- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Lucide
- **Backend:** Next.js Server Actions & API Routes, NextAuth
- **Database:** Prisma ORM, PostgreSQL
- **AI Integration:** NVIDIA NIM API (Llama 3.1 405B Instruct)

Please refer to [Documentation/Major Project.md](./Documentation/Major%20Project.md) for the complete architectural report, evolution history, and technical deep-dives.

## ML Setup

To run the machine learning capabilities locally:

1. `npm install`
2. `npx prisma generate`
3. `npx prisma db push`
4. `node scripts/fetch_ledgar.mjs`
5. `node scripts/generate_embeddings.mjs`
6. `npm run dev`

*Note: The first time you use the ML endpoints, the 23MB ONNX embedding model will be downloaded automatically.*
