# BeforeYouSign - Viva Presentation (12 Slides)

This outline is designed for a concise academic defense. Each slide maps directly to your master feature inventory and architectural realities.

## Slide 1: Problem Statement
*   **Title**: The Cost of Legal Friction
*   **Points**:
    *   Traditional contract review is slow, expensive, and inaccessible to non-lawyers.
    *   Small businesses and individuals sign agreements without understanding their true liability.
    *   Existing tools are either too basic (regex-based) or prohibitively expensive (enterprise-only).
*   **Visual**: Icons showing a clock, money, and a confusing legal document.

## Slide 2: Existing System vs. Proposed System
*   **Title**: The Evolution of Contract Analysis
*   **Existing Systems**: Manual review by junior associates or rigid keyword-matching software.
*   **Proposed System (BeforeYouSign)**: An AI-native platform leveraging 405B parameter LLMs for deep semantic understanding, coupled with local vector similarity search for industry benchmarking.

## Slide 3: Core Architecture
*   **Title**: High-Level System Architecture
*   **Visual**: Insert the **System Architecture Diagram** (User -> Next.js -> API -> NVIDIA NIM & PostgreSQL).
*   **Talking Point**: "A serverless Next.js architecture decoupling the presentation layer from external generative AI (NVIDIA) and local discriminative AI (Transformers.js)."

## Slide 4: Database Design
*   **Title**: Entity Relationship & Persistence
*   **Visual**: Insert the **ER Diagram**.
*   **Talking Point**: "We utilize PostgreSQL with Prisma ORM. Our schema cleanly separates Users, their Contracts, and the resulting AI Analyses, enabling future collaborative features."

## Slide 5: The Generative AI Pipeline (Phase 1-4)
*   **Title**: Contract Analysis via NVIDIA NIM
*   **Points**:
    *   Documents are parsed and chunked.
    *   Passed to Llama 3.1 405B Instruct via NVIDIA's low-latency API.
    *   Returns structured JSON containing overall Risk Score, Red Flags, and Clause-by-Clause breakdowns.

## Slide 6: The Machine Learning Pipeline (Phase 5)
*   **Title**: Semantic Clause Benchmarking
*   **Visual**: Insert the **ML Pipeline Diagram**.
*   **Talking Point**: "To provide objective context, we don't just rely on LLM hallucinations. We built a local semantic retrieval engine."

## Slide 7: Inside the Semantic Engine
*   **Title**: How Benchmarking Works
*   **Points**:
    *   We pre-computed 384-dimensional embeddings for 250 clauses from the public LEDGAR dataset.
    *   Using Xenova/Transformers.js (all-MiniLM-L6-v2), we generate vectors for the user's clause at runtime.
    *   We calculate Cosine Similarity to find the Top-K matches and derive the "Industry Median Risk" mathematically.

## Slide 8: Key Features (Fully Functional)
*   **Title**: Core Platform Capabilities
*   **Points**:
    *   Instant PDF/DOCX Risk Analysis.
    *   Conversational Contract RAG (Chat).
    *   Semantic Clause Retrieval & Benchmarking.
    *   Document Exporting (PDF/Word).

## Slide 9: Results & UI
*   **Title**: The User Experience
*   **Visual**: Insert a compelling screenshot of the `AnalysisResult.tsx` dashboard showing the Risk Score, Red Flags, and the "Find Similar Clauses" output.
*   **Talking Point**: "The technical complexity is abstracted away behind a clean, intuitive, consumer-grade interface."

## Slide 10: Limitations
*   **Title**: Current Technical Constraints
*   **Points**:
    *   **In-Memory Vectors**: The current ML pipeline uses an in-memory JSON store, which isn't scalable to millions of documents.
    *   **Deployment Limits**: Vercel's serverless cold-start timeouts restrict the size of local embedding models we can run synchronously.
    *   **Clustering**: Current K-Means portfolio segmentation is metadata-based, not text-semantic based.

## Slide 11: Future Scope
*   **Title**: The Path Forward
*   **Points**:
    *   Migration to a dedicated Vector Database (e.g., Pinecone or pgvector).
    *   Dedicated Python Microservices for ML inference to bypass Node.js limitations.
    *   Optical Character Recognition (OCR) for scanned PDFs.

## Slide 12: Conclusion
*   **Title**: Democratizing Legal Intelligence
*   **Points**:
    *   BeforeYouSign successfully demonstrates that advanced NLP and ML retrieval can be combined to make professional-grade contract analysis accessible, objective, and defensible.
    *   Thank you / Q&A.
