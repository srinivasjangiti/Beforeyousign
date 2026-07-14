# Viva Preparation Guide: BeforeYouSign

## The Pitch (30 Seconds)
"BeforeYouSign is a serverless AI contract analysis platform. It uses generative AI (Llama 3.1 405B) for deep textual reasoning and a localized NLP pipeline (MiniLM embeddings) for deterministic risk benchmarking and semantic search. It solves the problem of high-latency, expensive manual legal reviews by providing instant, risk-aware clause recommendations."

## Technical Defensibility (The "Why")

**Why not just use an LLM for everything?**
LLMs are slow, computationally expensive, and prone to hallucination when performing exact metric comparisons. By architecting a dual-pipeline where Generative AI handles data extraction and Transformer Embeddings handle mathematical similarity matching, we achieved deterministic, reproducible risk assessment at sub-10ms latencies.

**Why store embeddings in a TTL memory cache instead of PostgreSQL?**
Storing 384-dimensional arrays in our primary database schema would severely bloat the `AnalyzedContract` table and dramatically increase read latency for standard dashboard queries. We built an ephemeral 24-hour cache that generates vectors on-the-fly. This keeps the core database lightweight while maintaining instant semantic retrieval.

**Is the ML real?**
Yes. We are not just making generic API calls. We run ONNX-compiled `all-MiniLM-L6-v2` transformer models locally within the Node.js runtime to:
1. Generate embeddings
2. Perform mathematical cosine similarity clustering
3. Execute k-NN classification
4. Rank clauses against the open-source LEDGAR legal corpus

## Core Metrics to Mention
- **Model Used:** NVIDIA NIM (Llama 3.1 405B) & `all-MiniLM-L6-v2`
- **Embedding Dimensions:** 384
- **Similarity Metric:** Cosine Similarity
- **Cache Hit Latency:** <10ms
- **Tech Stack:** Next.js, Prisma, PostgreSQL, Tailwind CSS
