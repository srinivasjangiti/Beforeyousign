# Case Study: Architecting a Serverless Semantic Legal Intelligence Engine

## Problem
Contract analysis is traditionally an expensive, manual process plagued by high latency and human error. Identifying risk anomalies or comparing a new contract against a vast historical portfolio typically requires costly external counsel. BeforeYouSign was built to solve this problem by providing instantaneous, AI-driven legal reviews. However, while generative AI can summarize text, it struggles with deterministic risk benchmarking and large-scale semantic comparison across a curated portfolio of contracts.

## Architecture
BeforeYouSign operates on a serverless architecture optimized for both generative intelligence and deterministic machine learning:
- **Frontend / Fullstack Framework:** Next.js (React)
- **Database:** PostgreSQL (managed via Prisma ORM)
- **Generative AI:** NVIDIA NIM (Llama 3.1 405B) for deep textual reasoning and extraction
- **Machine Learning Layer:** Transformers.js (MiniLM-L6-v2) for on-the-fly embedding generation
- **Deployment:** Vercel

## Embedding Pipeline
Rather than relying on computationally heavy LLMs for all tasks, the platform implements a specialized, lightweight embedding pipeline. When a contract's summary or specific clauses need to be analyzed for similarity, they are vectorized using the `all-MiniLM-L6-v2` transformer model. This 384-dimensional embedding process executes efficiently via ONNX runtime, allowing for rapid transformation of textual legal data into mathematical vectors without external API latency.

## Similarity Search
The core of the intelligence engine is a custom cosine similarity retrieval system. By comparing the vector representation of a user's uploaded clause against the vectors in a curated LEDGAR legal corpus, the system instantly identifies the most conceptually aligned industry standards. This enables:
- **k-NN Category Prediction:** Categorizing unknown clauses based on the majority vote of their nearest LEDGAR neighbors.
- **Deviation Detection:** Calculating a benchmark alignment percentage (e.g., 92% Industry Alignment) instead of relying on subjective heuristics.

## Recommendation Engine
We implemented a **Benchmark-Based Recommendation Engine** that is risk-aware. The system retrieves the top 20 most semantically similar clauses from the knowledge base and filters them to find alternatives that possess a lower historical risk score benchmark than the user's current clause. The highest-ranked result is presented as the "Estimated Risk Reduction" alternative, providing users with prescriptive, safer legal language while maintaining the original semantic intent.

## Semantic Portfolio
To enable macro-level intelligence, the platform features Semantic Portfolio Discovery. Instead of dragging vectors into the Prisma schema (which would bloat the database and inflate read latency on standard dashboard queries), the system generates portfolio embeddings on demand.
1. The `executiveSummary` of the target contract is embedded.
2. The summaries of all historical portfolio contracts are embedded in parallel via `Promise.all`.
3. A 24-hour TTL in-memory Map cache (`cacheMetrics` tracked) ensures sub-10ms latency for subsequent semantic clustering.
This architectural decision maintains zero schema debt while delivering true relational semantic distances across the user's entire repository.

## Limitations
1. **Corpus Size:** The current LEDGAR corpus consists of a curated sample size. While sufficient for high-quality baseline recommendations, scaling to thousands of clauses would improve the granularity of nearest-neighbor results.
2. **Ephemeral Cache Boundaries:** The in-memory TTL cache is highly performant but ephemeral and instance-bound. On a serverless environment (like Vercel), cold starts will temporarily bypass the cache.

## Future Roadmap
1. **Corpus Expansion:** Scale the LEDGAR corpus from 250 to 5,000 clauses through staged embeddings to vastly improve the recommendation engine's accuracy.
2. **Hybrid Retrieval:** Implement a hybrid BM25 + Vector Embedding search architecture to improve exact keyword matching alongside semantic similarity.
3. **Dedicated Vector Store:** As the portfolio grows beyond thousands of contracts, migrate the on-demand embedding cache to a dedicated vector database (like Pinecone or pgvector) to enable scalable HNSW indexing.
