# BeforeYouSign - Master Feature Inventory

This document serves as the single source of truth for the final state of the BeforeYouSign project. It outlines the technical reality of what is implemented versus what is prototyped.

---

## 1. Fully Functional

These features are completed, defensible, and run live code natively without mock data.

### Contract Analysis (Phase 1 & 2)
*   **Description**: Analyzes uploaded documents using NVIDIA NIM Llama 3.1 405B to identify risk scores, red flags, and compliance issues.
*   **Status**: 100% Functional
*   **Route**: `/api/analyze` (or internal Server Actions)
*   **Component**: `UploadDropzone.tsx`, `AnalysisResult.tsx`
*   **Database Dependency**: `Contract`, `Analysis`, `AnalyzedContract` tables in PostgreSQL via Prisma.

### Semantic Clause Retrieval (Phase 5)
*   **Description**: Given a user clause, mathematically computes cosine similarity against a database of 250 LEDGAR clauses to find industry-standard benchmarks.
*   **Status**: 100% Functional
*   **Route**: `/api/ml/similar-clauses`
*   **Component**: Included inside `AnalysisResult.tsx` (Benchmarking UI)
*   **Database Dependency**: None. Relies on static `legal-precedents.json` and in-memory `@xenova/transformers` (`all-MiniLM-L6-v2`).

### In-Memory Bounded Query Cache
*   **Description**: Caches semantic search results for identical queries to bypass repetitive model inference.
*   **Status**: 100% Functional
*   **Route**: Internal (`lib/ml/retrieval.ts`)
*   **Component**: N/A
*   **Database Dependency**: None. In-memory Map (FIFO up to 500 entries).

### Document Export
*   **Description**: Converts analysis results into downloadable PDF or DOCX formats.
*   **Status**: 100% Functional
*   **Route**: Client-side / Internal Lib
*   **Component**: `AnalysisResult.tsx` Action Buttons, `lib/export-manager.ts`
*   **Database Dependency**: None.

---

## 2. Partially Functional

These features exist and execute real code, but have architectural shortcuts, fallback mechanisms, or semantic limitations.

### Portfolio Risk Segmentation (Clustering)
*   **Description**: Uses K-Means clustering to group contracts into segments.
*   **Status**: Partially Functional (Metadata Clustering)
*   **Limitation**: Embeds metadata ("Risk Score", "Clause Count") rather than raw semantic contract text. Do not claim this is "semantic clustering".
*   **Route**: `/api/ml/contract-clusters`
*   **Component**: N/A (API only)
*   **Database Dependency**: Requires active `AnalyzedContract` rows in PostgreSQL.

### Contract Chat / RAG
*   **Description**: Conversational interface to query contract specifics.
*   **Status**: Partially Functional
*   **Limitation**: Works well for basic queries, but lacks advanced vector-database-backed chunking for massive 100-page documents.
*   **Route**: `/api/chat`
*   **Component**: `ContractChat.tsx`
*   **Database Dependency**: None directly for chat context.

### Contract Drafting
*   **Description**: Generates new agreements dynamically based on user prompts.
*   **Status**: Partially Functional
*   **Limitation**: Generates basic templates but lacks advanced versioning, diff-tracking, and strict legal formatting constraints.
*   **Route**: `lib/ai-contract-drafter.ts`
*   **Component**: `DraftingUI`
*   **Database Dependency**: None.

---

## 3. Prototype Modules

These components render beautifully but are entirely powered by `generateMockContracts()` or hardcoded JSON. **They must be marked as "Coming Soon" or "Prototype Module".**

### Predictive Analytics Dashboard
*   **Status**: Mocked
*   **Component**: `PredictiveAnalyticsDashboard.tsx`
*   **Database Dependency**: None (Bypasses DB entirely).

### Business Intelligence Dashboard
*   **Status**: Mocked
*   **Component**: `BusinessIntelligenceDashboard.tsx`
*   **Database Dependency**: None (Bypasses DB entirely).

### Team Collaboration & Approvals
*   **Status**: Mocked
*   **Component**: `TeamCollaboration.tsx`
*   **Database Dependency**: None (Hardcoded `mockComments` and `mockApprovals`).

---

## 4. Future Scope

Features intentionally omitted from this academic iteration to constrain scope.

1.  **Vector Database Integration**: Migrating the in-memory JSON embedding store to Pinecone or pgvector for scalable production deployment.
2.  **Serverless Python ML Microservice**: Offloading the `@xenova/transformers` 23MB ONNX download from Vercel Node.js routes to prevent cold-start timeout limits.
3.  **True Semantic Clustering**: Grouping thousands of enterprise contracts by extracting raw clauses and running DBScan/K-Means on high-dimensional text vectors rather than metadata.
4.  **Optical Character Recognition (OCR)**: Ingesting scanned, non-searchable image PDFs natively.
5.  **Blockchain Audit Trails**: Hashing contract finalization state to a public ledger for immutable evidence.
