# API Reference

This document provides a complete reference for the REST API endpoints available in **BeforeYouSign**. All endpoints reside under `/api/*` and return standard JSON responses unless noted otherwise.

---

## 1. Contract Analysis Endpoints

### `POST /api/analyze`
Extracts text from an uploaded contract file, runs AI risk assessment, and returns a structured audit report.

- **Content-Type:** `multipart/form-data`
- **Request Parameters:**
  - `file`: The contract binary (`.pdf`, `.docx`, or `.txt`, max 10MB).
  - `jurisdiction` *(optional)*: Governing jurisdiction string (default: `"US"`).
  - `saveContract` *(optional)*: Boolean `"true"` or `"false"` to persist in the database.

- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "fileName": "vendor-agreement.pdf",
    "fileSize": 142050,
    "riskScore": 72,
    "summary": "This is a one-sided SaaS vendor agreement with unilateral indemnity...",
    "clauses": [
      {
        "id": "clause_1",
        "title": "Indemnification",
        "text": "Customer shall indemnify and hold harmless Provider from all claims...",
        "riskLevel": "high",
        "explanation": "Customer bears all third-party liability without reciprocal protection.",
        "recommendation": "Require mutual indemnification capped at fees paid in prior 12 months."
      }
    ],
    "redFlags": [
      {
        "id": "flag_1",
        "title": "Uncapped Liability",
        "severity": "critical",
        "description": "Provider disclaims all warranties while customer faces unlimited liability."
      }
    ],
    "financialExposure": {
      "estimatedRiskRange": "$25,000 - $100,000",
      "basis": "Unlimited indemnification and immediate liquidated damages clauses."
    }
  }
}
```

---

### `POST /api/extract-text`
Utility endpoint to extract raw text content from a file without running AI analysis.

- **Content-Type:** `multipart/form-data` (`file`)
- **Response:** `200 OK`
```json
{
  "success": true,
  "text": "CONFIDENTIALITY AGREEMENT\n\nThis Agreement is entered into...",
  "pageCount": 4,
  "charCount": 14250
}
```

---

### `POST /api/detect-clauses`
Splits raw contract text into segmented clauses and identifies legal categories without full risk scoring.

- **Content-Type:** `application/json`
- **Request Body:**
```json
{
  "text": "Either party may terminate this agreement upon 30 days written notice..."
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "clauses": [
    {
      "category": "Term and Termination",
      "text": "Either party may terminate this agreement upon 30 days written notice...",
      "confidence": 92
    }
  ]
}
```

---

## 2. Machine Learning & Vector Search Endpoints

### `POST /api/ml/similar-clauses`
Embeds a clause text using local ONNX transformers, matches it against the LEDGAR corpus, and predicts its category with k-NN.

- **Content-Type:** `application/json`
- **Request Body:**
```json
{
  "text": "The Company may terminate the Executive without Cause immediately upon written notice.",
  "topK": 3,
  "currentRiskScore": 85
}
```

- **Response:** `200 OK`
```json
{
  "success": true,
  "predictedCategory": "Term and Termination",
  "confidence": 100,
  "results": [
    {
      "id": "ledgar_term_102",
      "category": "Term and Termination",
      "text": "Either party may terminate this Agreement without cause upon sixty (60) days prior written notice.",
      "similarityScore": 87,
      "riskScoreBenchmark": 25,
      "source": "SEC Form 10-K Filing"
    }
  ],
  "recommendedAlternative": {
    "id": "ledgar_term_102",
    "category": "Term and Termination",
    "text": "Either party may terminate this Agreement without cause upon sixty (60) days prior written notice.",
    "similarityScore": 87,
    "riskScoreBenchmark": 25
  }
}
```

---

### `POST /api/ml/contract-clusters`
Clusters an array of contracts or clauses based on pairwise cosine similarity to group portfolio documents into themes.

- **Content-Type:** `application/json`
- **Request Body:**
```json
{
  "documents": [
    { "id": "doc_1", "text": "Employment Agreement between..." },
    { "id": "doc_2", "text": "Non-Disclosure Agreement between..." }
  ]
}
```

---

## 3. Drafting & Negotiation Endpoints

### `POST /api/chat`
Conversational RAG endpoint for asking questions about a specific contract.

- **Content-Type:** `application/json`
- **Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "What is the notice period for contract termination?" }
  ],
  "contractContext": "Full contract text or relevant extracted section..."
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "reply": "According to Section 9.2, termination for convenience requires 60 days written notice."
}
```

---

### `POST /api/drafting`
Generates a customized legal contract draft from high-level user specifications.

- **Content-Type:** `application/json`
- **Request Body:**
```json
{
  "contractType": "NDA",
  "parties": ["Acme Corp", "Beta LLC"],
  "jurisdiction": "California",
  "mutual": true,
  "termYears": 2
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "draft": "MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis Agreement is made on...",
  "clauseCount": 12
}
```

---

### `POST /api/negotiate`
Generates counter-proposals and redlined alternatives for a contested contract clause.

- **Content-Type:** `application/json`
- **Request Body:**
```json
{
  "clauseText": "Customer shall indemnify Provider for all damages regardless of cause.",
  "stance": "balanced",
  "clientRole": "Customer"
}
```

---

## 4. PDF Toolkit Endpoints

These endpoints provide server-side execution fallbacks for operations available on `/tools`:

| Endpoint | Method | Input | Description |
|---|---|---|---|
| `/api/pdf/merge` | `POST` | Multipart array of PDFs | Merges multiple PDF files in sequential order. |
| `/api/pdf/split` | `POST` | PDF file + page ranges | Extracts specified page ranges as a new document. |
| `/api/pdf/rotate` | `POST` | PDF file + degrees (90, 180, 270) | Permanently rotates specified pages. |
| `/api/pdf/compress` | `POST` | PDF file | Optimizes stream compression to reduce file size. |
| `/api/pdf/info` | `POST` | PDF file | Returns page count, author metadata, and encryption status. |
| `/api/pdf/from-image`| `POST` | Image file (PNG/JPG) | Converts image scans into a standardized PDF. |
| `/api/pdf/to-image`  | `POST` | PDF file | Renders PDF pages as high-resolution images. |

---

## 5. Analytics & Workspace Endpoints

### `GET /api/analytics/kpis`
Returns aggregate statistics for the user's contract portfolio:
- Total contracts analyzed
- Average portfolio risk score
- Top identified risk categories
- Total estimated financial liability mitigated

### `POST /api/share`
Generates a secure, expiring share link for an analysis report so external counsel or team members can review findings without an account.
