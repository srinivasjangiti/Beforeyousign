# Features & User Workflows

This document outlines the major user-facing capabilities of **BeforeYouSign**, explaining how each feature functions, its inputs, and its practical use case.

---

## 1. AI Contract Risk Analyzer (`/analyze`)

The Contract Risk Analyzer is the core evaluation workspace of the platform.

### How it Works
1. **Document Upload:** Users drag and drop or upload a contract (`.pdf`, `.docx`, or `.txt`) up to 10MB.
2. **Text Extraction:** The backend extracts the raw text content while filtering out boilerplate artifacts.
3. **Structured Dissection:** The analyzer processes the text through `lib/contract-analyzer.ts`, producing:
   - **Overall Risk Score (0–100):** A normalized score where 0 represents a balanced/safe contract and 100 represents severe predatory risk.
   - **Executive Summary:** A 2–3 paragraph plain-English overview of the contract's intent, party obligations, and potential pitfalls.
   - **Clause Breakdown:** Key clauses identified and labeled by category (e.g., *Termination, Indemnity, Non-Compete, Liability*).
   - **Red Flag Identification:** Explicit warnings highlighting one-sided clauses, uncapped liability, perpetual IP transfers, or short cure periods.
   - **Financial Exposure Estimation:** A dollar or percentage range estimating potential costs from penalties or legal disputes under the terms.
   - **Proposed Counter-Clauses:** Concrete alternative phrasing ready to copy and paste into negotiations.
4. **Export Options:** Users can export the generated audit report as:
   - **PDF Report:** High-resolution printable executive briefing.
   - **Word Document (.docx):** Fully formatted Word document for team sharing.
   - **JSON / Markdown:** Raw structured data for engineering or legal management integration.

---

## 2. Semantic Precedent Benchmarking (`/benchmark`, `/intelligence`, `/risk`)

Instead of relying solely on subjective AI assessments, this tool compares contract clauses against real-world legal market data.

### How it Works
- Uses the **LEDGAR Precedent Corpus** (thousands of real contract clauses extracted from SEC filings).
- Takes any clause submitted by the user and generates a 384-dimensional vector embedding.
- Calculates mathematical cosine similarity against database clauses.
- Displays:
  - **Match Confidence:** How standard this clause is compared to public commercial contracts.
  - **Category Benchmark:** Median, minimum, and maximum risk scores for similar clauses across the industry.
  - **Estimated Risk Reduction (ERR):** Suggests alternative language that reduces the calculated risk score while preserving the clause's original business intent.

---

## 3. AI Contract Drafting & Redlining (`/drafting`, `/negotiate`)

Enables users to generate new legal contracts from scratch or negotiate existing contracts using AI-assisted redlining.

### Core Capabilities
- **Template-Based Generation:** Generates customized initial drafts for:
  - Non-Disclosure Agreements (NDAs) — Mutual or Unilateral
  - Master Services Agreements (MSAs) & Statements of Work (SOWs)
  - SaaS Terms of Service & Service Level Agreements (SLAs)
  - Employment & Independent Contractor Agreements
  - Commercial Leases & Advisory Agreements
- **Visual Redline Diffing:** Uses `diff-match-patch` to highlight additions in green and deletions in red side-by-side between the original text and the revised counter-proposal.
- **Negotiation Playbook (`/playbooks`):**
  - Generates tactical advice based on who has the stronger bargaining position (Vendor vs. Client, Employer vs. Employee).
  - Outlines three tiers of positions for every clause: **Aggressive**, **Balanced (Compromise)**, and **Walk-Away**.

---

## 4. Legal Assistant Chat (`/chat`)

A document-grounded Retrieval-Augmented Generation (RAG) assistant for querying active contracts.

### Key Use Cases
- Asking questions about specific contract terms:
  - *"Does this agreement automatically renew if I don't give 30 days notice?"*
  - *"Who owns the intellectual property created during this engagement?"*
  - *"What are the exact payment terms and late fee penalties?"*
- Extracting specific facts and cross-referencing definitions across different sections of a 40-page contract.

---

## 5. Contract Obligation Tracker & Renewals (`/obligations`, `/renewals`)

Contracts often lead to financial loss when deadlines and milestones are forgotten after signing.

### Key Capabilities
- **Milestone Detection:** Automatically parses dates, deadlines, and conditional triggers:
  - Notice periods for contract non-renewal.
  - Payment milestones and invoice due dates.
  - Deliverable submission dates.
  - Expiration of confidentiality or non-compete periods.
- **Renewal Calendar:** Displays a calendar timeline with advance alert badges (e.g., 30-day, 60-day, and 90-day warnings) to avoid inadvertent auto-renewals.

---

## 6. Regulatory & Security Compliance Scanner (`/compliance`)

Automated scanning to verify contract compliance with major privacy and data protection standards.

### Supported Frameworks
- **GDPR (General Data Protection Regulation):** Checks for proper Data Processing Clauses, sub-processor obligations, and cross-border data transfer mechanisms.
- **CCPA (California Consumer Privacy Act):** Evaluates consumer data definitions and sale-of-data restrictions.
- **HIPAA:** Flags Business Associate Agreement (BAA) requirements for healthcare data.
- **SOC 2 / ISO 27001:** Verifies security audit rights, breach notification timelines, and encryption mandates.

---

## 7. Digital Signatures & Cryptographic Verification (`/esignature`, `/blockchain`)

A built-in workflow to finalize and anchor executed agreements without leaving the platform.

### Key Capabilities
- **Canvas-Based Signature Pad:** Allows users to draw, type, or upload digital signatures directly onto documents.
- **SHA-256 Document Hashing:** Calculates a unique cryptographic hash fingerprint of the final executed document.
- **Tamper-Evident Verification (`/blockchain`):** Allows any party to upload a document to verify whether its SHA-256 fingerprint matches the recorded signature state, confirming that not a single word has been altered post-signature.

---

## 8. Client-Side PDF Tools (`/tools`)

A collection of utility tools for handling common PDF document preparation tasks directly in the browser:

| Tool | Description |
|---|---|
| **Merge PDFs** | Combine multiple agreements, exhibits, and schedules into a single PDF document. |
| **Split PDF** | Extract individual pages, page ranges, or signature blocks. |
| **Rotate PDF** | Permanently correct scanned pages that were imported sideways or upside down. |
| **Image Conversion** | Convert contract scan images (JPG, PNG) into standardized PDFs or extract PDF pages as images. |

> **Privacy Benefit:** Because these operations run via `pdf-lib` in the browser, file data never leaves your computer for simple format conversions.

---

## 9. Lawyer Marketplace & Consultation Booking (`/lawyers`, `/book/[lawyerId]`)

When automated AI analysis indicates complex risks, users can connect with human legal counsel.

### Key Capabilities
- Filter lawyers by jurisdiction and practice area (Corporate, IP, Employment, Real Estate, Litigation).
- View verified credentials, hourly rates, and client reviews.
- Schedule direct consultation slots with pre-attached contract analysis reports so the attorney can review red flags immediately.

---

## 10. Multi-Language Contract Analysis (`/multi-language`)

Supports international business contracts by translating and analyzing non-English agreements:
- Ingests contracts in languages such as Spanish, French, German, and Hindi.
- Identifies jurisdiction-specific legal terms and translates obligations into plain English while preserving the original legal meaning.
