# Machine Learning & Vector Retrieval Engine

This document explains the internal mechanics of the machine learning subsystem in **BeforeYouSign**, located in `lib/ml/`. It covers the embedding model, vector similarity calculations, precedent datasets, and the recommendation algorithms.

---

## 1. Overview & Architecture

BeforeYouSign avoids sending simple vector similarity queries to cloud LLMs. Instead, it runs an in-process, deterministic machine learning pipeline directly in the Node.js environment using the ONNX runtime:

```
User Clause (Text)
       │
       ▼
[Transformers.js (ONNX Runtime)]
       │ Model: all-MiniLM-L6-v2 (Mean Pooling, Normalized)
       ▼
384-Dimensional Dense Vector
       │
       ▼
[Cosine Similarity Matcher] ◄─── Precomputed Embeddings (`data/legal-precedents-embeddings.json`)
       │
       ├───► 1. Top-K Nearest Precedent Clauses
       ├───► 2. k-NN Majority Category Voting (e.g., "Indemnity" - 100% confidence)
       └───► 3. Risk-Aware Safer Alternative (Estimated Risk Reduction)
```

---

## 2. Embedding Model Specification

- **Model Name:** `Xenova/all-MiniLM-L6-v2`
- **Architecture:** 6-layer MiniLM transformer quantized for ONNX execution.
- **Output Dimensions:** 384 floating-point values.
- **Pooling Strategy:** Mean pooling across token representations, followed by L2 vector normalization.
- **Execution Environment:** Executed via `@xenova/transformers` in Node.js without requiring Python, PyTorch, or GPU hardware.
- **Cache & Download:** The first time the pipeline runs, the 23MB ONNX model weights are downloaded from Hugging Face and cached locally. Subsequent runs load the model directly from disk/memory in milliseconds.

```typescript
// lib/ml/embeddings.ts
const extractor = await EmbeddingsPipeline.getInstance();
const output = await extractor(text, { pooling: 'mean', normalize: true });
return Array.from(output.data); // Returns number[384]
```

---

## 3. The Legal Precedent Knowledge Base

The benchmarking corpus consists of two synchronized data files in `data/`:

### 3.1 `data/legal-precedents.json`
Contains curated clauses extracted from the public **LEDGAR corpus** (SEC Edgar legal filings). Each record includes:
- `id`: Unique identifier (e.g., `ledgar_indemnity_042`).
- `category`: Legal category (e.g., `Indemnification`, `Term and Termination`, `Governing Law`, `Confidentiality`).
- `text`: Verbatim clause text extracted from public commercial agreements.
- `risk_score_benchmark`: A standardized risk score (0–100) assigned to the clause based on bilateral balance and liability exposure.
- `source`: SEC filing reference or company disclosure.

### 3.2 `data/legal-precedents-embeddings.json`
A dictionary mapping each clause `id` to its precomputed 384-dimensional vector array. By precomputing these vectors ahead of time, similarity lookups require zero inference time over the historical dataset—only the incoming user query needs to be embedded.

---

## 4. Vector Similarity Math

Cosine similarity measures the angle between two multi-dimensional vectors regardless of their magnitude:

$$\text{similarity}(A, B) = \frac{A \cdot B}{\|A\| \|B\|}$$

Because our embedding pipeline automatically L2-normalizes vectors ($\|A\| = 1$ and $\|B\| = 1$), the calculation simplifies to a fast dot product:

$$\text{similarity}(A, B) = \sum_{i=1}^{384} A_i \cdot B_i$$

### Percentage Conversion
In `lib/ml/similarity.ts`, the cosine similarity value (which typically ranges between $0.0$ and $1.0$ for directional sentence embeddings) is mapped to a human-readable percentage:

```typescript
export function similarityToPercentage(sim: number): number {
  // Bounded between 0% and 100%
  const clamped = Math.max(0, Math.min(1, sim));
  return Math.round(clamped * 100);
}
```

---

## 5. k-NN Category Prediction

When a user submits an unclassified clause or custom text, the system predicts its legal category using **k-Nearest Neighbors (k-NN)**:

1. **Embed Query:** Generate vector for the input clause.
2. **Find Top-$K$:** Compute similarity across all precedents and extract the top $K$ closest matches (default: $K = 3$).
3. **Majority Vote:** Count category occurrences among the top $K$ matches:
   ```typescript
   const categoryCounts: Record<string, number> = {};
   for (const res of finalResults) {
     categoryCounts[res.category] = (categoryCounts[res.category] || 0) + 1;
   }
   ```
4. **Confidence Score:** Calculated as:
   $$\text{Confidence} = \frac{\text{Votes for Winning Category}}{K} \times 100\%$$

---

## 6. Risk-Aware Recommendations & Estimated Risk Reduction (ERR)

Finding a similar clause is only half the battle; users want to know how to fix a risky clause. The recommendation algorithm in `lib/ml/retrieval.ts` operates as follows:

```
[Input Clause with High Risk (e.g. Risk = 85)]
                │
                ▼
1. Fetch Top 20 Most Semantically Similar Precedents
                │
                ▼
2. Filter: Discard any precedent with Benchmark Risk >= 85
                │
                ▼
3. Rank Remaining Candidates:
   - Primary: Highest Semantic Similarity
   - Secondary: Lowest Risk Score Benchmark
                │
                ▼
[Recommended Alternative Clause (e.g. Risk = 30, Similarity = 88%)]
```

### Estimated Risk Reduction (ERR) Formula
$$\text{ERR} = \text{Current Clause Risk} - \text{Recommended Clause Risk}$$

*Example:* If a vendor's proposed indemnification clause has a risk score of **85**, and the algorithm finds a balanced bilateral SEC precedent with a benchmark risk of **30**, the Estimated Risk Reduction is **55 points (64% safer)**.

---

## 7. Performance & In-Memory Caching

- **Bounded FIFO Query Cache:** Repeated analysis requests or identical clauses are stored in an in-memory `Map` capped at 500 entries (`lib/ml/retrieval.ts`).
- **Response Time:**
  - Embedding computation: ~40–120ms on standard CPU.
  - Cosine search over thousands of precomputed vectors: ~2–5ms.
  - Total lookup turnaround: **< 150ms**, completely independent of external LLM API queues.
