# User Flow Diagram — BeforeYouSign
### Phase 0 Deliverable | Deep Detail Version

---

## How to Read This Document

Each flow traces the **exact path** a user takes through the system, including:
- **UI pages visited** (Next.js App Router routes)
- **API calls made** (serverless functions triggered)
- **Services invoked** (NVIDIA, ONNX, Prisma, Supabase)
- **DB operations** (what gets written/read)
- **Edge cases** (errors, fallbacks, loading states)

---

## Flow 1: Anonymous User — Quick Contract Analysis (Guest)

This is the **primary user journey** — the most important flow in the app.

```
User types "beforeyousign.vercel.app" in browser
        │
        ▼
[GET /]  →  app/page.tsx renders (29KB landing page)
        │
        │   What user sees:
        │   - Hero section: "Analyze any contract in 30 seconds"
        │   - Key features: Risk score, Red flags, Clause extraction
        │   - Trust signals: "Free • No signup required • Instant"
        │   - CTA buttons: "Analyze a Contract" / "Get Started Free"
        │
        ▼
[User clicks "Analyze a Contract"]
        │
        ▼
[GET /analyze]  →  app/analyze/page.tsx
        │
        │   What user sees:
        │   - FileUpload component (react-dropzone)
        │   - "Drag & drop your PDF, DOCX, or TXT"
        │   - Jurisdiction selector (40+ countries/states)
        │   - File size limit: 10MB warning
        │
        ▼
[User drags PDF onto dropzone]
        │
        │   FileUpload.tsx validates:
        │   ✓ MIME type is pdf/docx/txt?
        │   ✓ File size < 10MB?
        │   If validation fails → shows inline error, no API call made
        │
        ▼
[User clicks "Analyze"]
        │
        ▼
[POST /api/analyze]  (multipart/form-data with file)
        │
        │   Server-side execution:
        │   1. Extract file Buffer from FormData
        │   2. Detect file type (MIME/extension)
        │   3. Parse text:
        │      - .pdf  → pdf-parse(buffer) → raw string
        │      - .docx → mammoth.extractRawText(buffer) → raw string
        │      - .txt  → buffer.toString('utf-8')
        │   4. Sanitize: strip \x00 chars, normalize whitespace
        │   5. Truncate to 100,000 chars if larger
        │      (appends "[Contract text truncated...]" notice)
        │
        ▼
        │   ContractAnalyzer.analyze() called:
        │   ├── Build prompt (lib/contract-analyzer.ts ~L121)
        │   │   "You are an expert contract lawyer..."
        │   │   + JURISDICTION: [selected]
        │   │   + CONTRACT TEXT: [up to 100,000 chars]
        │   │   + instructions for output format
        │   │
        │   ├── generateText(prompt, NVIDIA_MODELS.fast, temp=0.3, maxTokens=4096)
        │   │   → POST https://integrate.api.nvidia.com/v1/chat/completions
        │   │   → model: meta/llama-3.1-8b-instruct
        │   │   → AbortController timeout: 45,000ms
        │   │
        │   ├── If 429/503: exponential backoff + retry (750ms, 1500ms, ...)
        │   │
        │   └── parseJsonResponse<AnalysisResult>(responseText)
        │       ├── Try: strip ```json fences → JSON.parse
        │       └── Catch: repairTruncatedJson → JSON.parse
        │
        ▼
        │   Async (non-blocking) DB write:
        │   prisma.analyzedContract.create({
        │     data: { fileName, riskScore, summary, redFlagsCount, clausesCount }
        │   })
        │   ← Does NOT block the response. Fire and forget.
        │
        ▼
[API returns JSON response to browser]
        │
        ▼
[/analyze page re-renders with results]
        │
        │   AnalysisResult.tsx renders (221KB component):
        │   ┌──────────────────────────────────────────┐
        │   │  RISK SCORE: [gauge visual, e.g. 72/100] │
        │   │  "HIGH RISK" badge                       │
        │   │                                           │
        │   │  EXECUTIVE SUMMARY                        │
        │   │  "This MSA gives vendor broad IP rights   │
        │   │   and contains an auto-renewal trap."    │
        │   │                                           │
        │   │  🚩 RED FLAGS (e.g. 3 found)              │
        │   │  ├── [CRITICAL] Uncapped IP Transfer      │
        │   │  ├── [DANGER]   Auto-renewal 90-day lock  │
        │   │  └── [WARNING]  One-sided amendment rights│
        │   │                                           │
        │   │  CLAUSE BREAKDOWN (e.g. 8 clauses)        │
        │   │  ├── Confidentiality   [Low]              │
        │   │  ├── Indemnification   [Critical]         │
        │   │  ├── Termination       [High]             │
        │   │  └── Payment Terms     [Medium]           │
        │   │                                           │
        │   │  RECOMMENDATIONS + ACTION ITEMS           │
        │   │                                           │
        │   │  [Export PDF] [Export DOCX] [Save]        │
        │   │  [Chat with this contract]                │
        │   └──────────────────────────────────────────┘
        │
        ▼
[User sees CTA: "Sign up to save your analysis"]
        │
        └── (or signs up → see Flow 2)
```

---

## Flow 2: User Registration & First Login

```
[User clicks "Sign Up"]
        │
        ▼
[Clerk.js modal opens (or /auth/signup page)]
        │
        │   Clerk handles:
        │   - Email verification
        │   - Google OAuth
        │   - GitHub OAuth
        │   - Password creation
        │
        ▼
[Clerk creates user account on their servers]
        │
        ▼
[ClerkProvider in app/layout.tsx gets session]
        │
        ▼
[User redirected to /dashboard]
        │
        ▼
[GET /dashboard]  →  app/dashboard/page.tsx
        │
        ▼
[Dashboard page calls GET /api/dashboard]
        │
        │   /api/dashboard server logic:
        │   ├── try:
        │   │   prisma.analyzedContract.findMany({
        │   │     orderBy: { createdAt: 'desc' }
        │   │   })
        │   │   → compute aggregations server-side:
        │   │     - totalContracts = records.length
        │   │     - avgRisk = average of all riskScore values
        │   │     - riskDistribution = group by risk range
        │   │     - topTypes = count by contractType
        │   │     - totalRedFlags = sum of redFlagsCount
        │   │     - healthScore = derived metric
        │   │   → return JSON metrics object
        │   │
        │   └── catch (DB error):
        │       → return SAMPLE DATA (hardcoded fallback)
        │       (dashboard always renders, even with no DB)
        │
        ▼
[UserDashboard.tsx renders with live data]
        │
        │   Shows:
        │   - Portfolio health score
        │   - Total contracts (N)
        │   - Average risk score
        │   - Risk distribution chart (Recharts bar chart)
        │   - Top contract types (pie chart)
        │   - Recent activity feed
```

---

## Flow 3: Registered User — Full Contract Workflow (End-to-End)

```
[Authenticated user on /dashboard]
        │
        ▼
[Clicks "Upload New Contract"]
        │
        ▼
[/analyze] → upload → analysis (same as Flow 1)
        │   but now analysis is saved to DB under their userId
        │
        ▼
[User clicks "Save to Repository"]
        │
        ▼
[POST /api/contracts]
        │   prisma.contract.create({
        │     data: { userId, name, content, fileUrl, fileName, status: "analyzed" }
        │   })
        │
        ▼
[Redirected to /contracts]  →  app/contracts/page.tsx
        │
        ▼
[GET /api/contracts]
        │   prisma.analyzedContract.findMany({ orderBy: createdAt DESC })
        │   → mapped to contract grid items
        │
        ▼
[ContractRepository.tsx renders contract grid]
        │
        │   User can now:
        │   ├──[A]── Chat with contract → /chat
        │   ├──[B]── Negotiate → /negotiate
        │   ├──[C]── Compare versions → /compare
        │   ├──[D]── Share analysis → /share
        │   ├──[E]── E-Sign → /esignature
        │   └──[F]── Invite collaborators → /team
```

### Sub-flow A: Contract Chat (RAG)

```
[User clicks "Chat with this contract"]
        │
        ▼
[/chat page opens with contract context]
        │
        ▼
[POST /api/extract-text]
        │   → Extracts raw text from contract file (lightweight endpoint)
        │   → Returns plain text string (no AI, just parsing)
        │
        ▼
[ContractChat.tsx renders chat interface]
        │
        ▼
[User types: "What does Section 12 say about termination?"]
        │
        ▼
[POST /api/chat]
        │
        │   Prompt structure:
        │   System: "You are a legal assistant. Answer questions about this contract."
        │   User: [full contract text] + "\n\nUser Question: " + [user's question]
        │
        │   → generateWithSystem(systemPrompt, userPrompt, NVIDIA_MODELS.primary)
        │   → model: meta/llama-3.3-70b-instruct
        │
        ▼
[AI response rendered in chat UI]
        │
        │   ⚠️ Limitation: Full contract text pasted every message.
        │   For 100KB contracts, this hits the context limit fast.
        │   True chunked RAG (embed + retrieve relevant chunks) not yet implemented.
```

### Sub-flow B: Negotiation

```
[User clicks "Negotiate"]
        │
        ▼
[/negotiate page]
        │
        ▼
[User selects which clauses to negotiate]
        │
        ▼
[POST /api/negotiate]
        │
        │   Request payload:
        │   {
        │     "contractText": "...",
        │     "targetClauses": ["Indemnification", "IP Assignment"],
        │     "userPosition": "startup_friendly",
        │     "jurisdiction": "US-California"
        │   }
        │
        │   AI generates:
        │   - Counter-proposal language for each clause
        │   - Leverage analysis (strong/moderate/weak)
        │   - Fallback positions
        │   - Walk-away criteria
        │
        ▼
[AIContractNegotiationAssistant.tsx shows results]
        │
        │   User can:
        │   - Copy suggested redline language
        │   - Download as negotiation memo PDF
        │   - Start "Live Negotiation" session (/api/negotiate-live)
```

### Sub-flow C: Version Comparison

```
[User uploads revised contract version]
        │
        ▼
[New analysis runs on revised version]
        │
        ▼
[User clicks "Compare with original"]
        │
        ▼
[/compare page]
        │
        ▼
[POST /api/analyze (second time, for revised document)]
        │
        ▼
[lib/version-compare.ts]
        │   diff-match-patch.diff_main(original, revised)
        │   → array of [operation, text] pairs
        │   → operation: DELETE (-1), EQUAL (0), INSERT (1)
        │
        ▼
[CompareVersions.tsx / VersionComparisonViewer.tsx]
        │   Side-by-side view:
        │   LEFT: Original contract (deletions in red)
        │   RIGHT: Revised contract (additions in green)
        │
        │   Risk delta shown:
        │   "Risk score changed: 72 → 45 (-27 points)"
        │   "3 red flags resolved, 1 new flag introduced"
```

### Sub-flow D: Share Analysis

```
[User clicks "Share this analysis"]
        │
        ▼
[POST /api/share]
        │   prisma.shareLink.create({
        │     data: {
        │       shareId: generateUniqueId(),
        │       analysisId,
        │       createdBy: userId,
        │       passwordHash: hash(optionalPassword),
        │       expiresAt: optionalDate,
        │       maxViews: optionalLimit
        │     }
        │   })
        │
        ▼
[Returns shareable URL: /share/[shareId]]
        │
        ▼
[User copies link, sends to colleague]
        │
        ▼
[Colleague opens /share/[shareId]]
        │
        │   Server checks:
        │   ├── shareLink.isActive?
        │   ├── shareLink.expiresAt > now?
        │   ├── shareLink.viewCount < shareLink.maxViews?
        │   └── if passwordHash set → prompt for password
        │
        ▼
[Analysis displayed in read-only view]
        │   prisma.shareLink.update({ viewCount: increment(1) })
```

### Sub-flow E: E-Signature

```
[User clicks "Sign this contract"]
        │
        ▼
[/esignature page]
        │
        ▼
[ESignature.tsx renders]
        │
        │   Three signature modes:
        │   ┌──────────────────────┐
        │   │ [Draw] [Type] [Upload]│
        │   └──────────────────────┘
        │
        │   Draw mode:
        │   → Canvas element captures mouse/touch strokes
        │   → Signature stored as base64 PNG data URL
        │
        │   Type mode:
        │   → User types name
        │   → Rendered in cursive font
        │   → Canvas.toDataURL() captures as image
        │
        ▼
[User clicks "Apply Signature to Document"]
        │
        ▼
[pdf-lib operations:]
        │   1. Load original PDF bytes
        │   2. Embed signature image at chosen position
        │   3. Add signature metadata (date, name)
        │   4. Save → new PDF bytes
        │
        ▼
[Browser downloads signed PDF]
        │
        [Optional: Save signed contract to repository]
        │   prisma.contract.update({ status: "signed" })
```

### Sub-flow F: Team Collaboration

```
[User (Owner) clicks "Invite Collaborator"]
        │
        ▼
[TeamCollaboration.tsx opens invite modal]
        │
        ▼
[Owner enters collaborator's email + assigns role]
        │   Roles: viewer / commenter / editor / approver
        │
        ▼
[POST /api/collaboration]
        │   prisma.contractCollaborator.create({
        │     data: {
        │       contractId, userId (collaborator),
        │       role, canEdit, canComment, canApprove, canShare, canDelete
        │     }
        │   })
        │
        ▼
[Notification sent to collaborator]
        │   prisma.notification.create({
        │     data: { userId: collaboratorId, type: "collaboration_invite",
        │             title: "You've been invited to review a contract",
        │             link: "/contracts/[contractId]" }
        │   })
        │
        ▼
[Collaborator opens contract]
        │
        │   Based on role:
        │   ├── Viewer    → read-only, no comments
        │   ├── Commenter → can comment on clauses
        │   ├── Editor    → can edit contract content
        │   └── Approver  → can trigger approval decisions
        │
        ▼
[Owner creates Approval Workflow]
        │   prisma.approvalWorkflow.create({
        │     data: {
        │       contractId, name: "Vendor MSA Review",
        │       stages: [
        │         { name: "Legal Review", approvers: [lawyerId], order: 0 },
        │         { name: "Finance Review", approvers: [financeId], order: 1 },
        │         { name: "CEO Sign-off", approvers: [ceoId], order: 2 }
        │       ],
        │       currentStage: 0, status: "in-review"
        │     }
        │   })
        │
        ▼
[Stage 0 approver (Legal) notified]
        │
        ▼
[Legal reviews → Approves]
        │   prisma.approvalWorkflow.update({ currentStage: 1 })
        │   → Stage 1 approver (Finance) notified
        │
        ▼
[Finance approves] → [CEO approves]
        │   prisma.approvalWorkflow.update({ status: "completed", completedAt: now() })
        │   prisma.contract.update({ status: "approved" })
        │
        ▼
[Contract locked for signing]
        │   prisma.contract.update({ locked: true, lockedBy: ownerId, lockedAt: now() })
```

---

## Flow 4: Contract Drafting (AI Generation)

```
[User navigates to /drafting]
        │
        ▼
[AIContractDrafter.tsx renders]
        │
        │   Input form:
        │   - Contract type: [NDA / Employment / SaaS / MSA / Lease / ...]
        │   - Plain English description of terms
        │   - Parties (Party A name, Party B name)
        │   - Jurisdiction
        │   - Key parameters (duration, payment, IP ownership, etc.)
        │
        ▼
[User submits]
        │
        ▼
[POST /api/drafting]
        │
        │   Request:
        │   {
        │     "action": "draft",
        │     "contractType": "Non-Disclosure Agreement",
        │     "requirements": "Mutual NDA under California law, 3 years, tech startup context"
        │   }
        │
        │   Server:
        │   → generateWithSystem(systemPrompt, userPrompt, NVIDIA_MODELS.primary)
        │   → model: meta/llama-3.3-70b-instruct, temperature: 0.7
        │
        │   Response JSON structure:
        │   {
        │     "title": "Mutual Non-Disclosure Agreement",
        │     "parties": ["Party A", "Party B"],
        │     "jurisdiction": "California, United States",
        │     "sections": [
        │       { "title": "1. Definition of Confidential Information", "content": "..." },
        │       { "title": "2. Obligations of Receiving Party", "content": "..." },
        │       { "title": "3. Term", "content": "3 years from effective date" },
        │       ...
        │     ]
        │   }
        │
        ▼
[Async DB write — NON-BLOCKING:]
        │   prisma.analyzedContract.create({
        │     data: {
        │       fileName: "AI Draft: Mutual NDA",
        │       contractType: "Draft",    ← Schema overloading trick
        │       summary: JSON.stringify(draftPayload),
        │       riskScore: 0,
        │       redFlagsCount: 0,
        │       clausesCount: sections.length
        │     }
        │   })
        │
        ▼
[Draft returned to UI before DB write completes]
        │
        ▼
[Contract rendered in editable view]
        │
        │   User can:
        │   ├── Edit sections inline
        │   ├── Export as PDF (window.print())
        │   ├── Export as DOCX (docx library)
        │   └── Save to Repository (already in DB via async write)
```

---

## Flow 5: ML Semantic Portfolio Analysis

```
[User on /dashboard or /analytics]
        │
        ▼
[Selects "Find Similar Contracts" for a target contract]
        │
        ▼
[POST /api/ml/portfolio-similarity or similar]
        │
        │   Server execution:
        │
        │   Step 1: Embed target contract
        │   ─────────────────────────────
        │   const targetText = targetContract.executiveSummary;
        │   const targetVector = await getEmbedding(targetText);
        │   // getEmbedding runs MiniLM ONNX locally
        │   // → pooling: 'mean', normalize: true
        │   // → returns number[384]
        │
        │   Step 2: Fetch all portfolio contracts
        │   ──────────────────────────────────────
        │   const portfolioContracts = await prisma.analyzedContract.findMany();
        │
        │   Step 3: Parallel embedding with cache
        │   ──────────────────────────────────────
        │   await Promise.all(
        │     portfolioContracts.map(async (contract) => {
        │       // Check 24h TTL cache first
        │       let embedding = getCachedEmbedding(contract.id);
        │       if (!embedding) {
        │         // Cache miss: generate embedding
        │         embedding = await getEmbedding(contract.summary);
        │         // Store in cache (key: contractId, value: number[384])
        │         setCachedEmbedding(contract.id, embedding);
        │         cacheMetrics.misses++;
        │       } else {
        │         cacheMetrics.hits++;  // <10ms cache hit
        │       }
        │
        │       // Compute cosine similarity
        │       const sim = cosineSimilarity(targetVector, embedding);
        │       return { contract, similarity: sim };
        │     })
        │   );
        │
        │   Step 4: Sort + Return Top-N
        │   ────────────────────────────
        │   results.sort((a, b) => b.similarity - a.similarity);
        │   return results.slice(0, 10); // Top 10 semantic neighbors
        │
        ▼
[Frontend renders semantic neighbor clusters]
        │
        │   "These contracts are most similar to [Target Contract]:"
        │   1. [Contract A] — 94.2% semantic similarity
        │   2. [Contract B] — 87.6% semantic similarity
        │   3. [Contract C] — 71.3% semantic similarity
        │   ...
```

---

## Flow 6: Lawyer Marketplace → Consultation Booking

```
[User visits /lawyers]
        │
        ▼
[LawyerMarketplace.tsx renders]
        │
        │   Filter options:
        │   - Practice area (IP, Employment, Commercial, etc.)
        │   - Jurisdiction (US, UK, India, etc.)
        │   - Max hourly rate
        │   - Minimum rating
        │   - Languages spoken
        │
        │   Data source: lib/lawyers-data.ts (static in-memory)
        │   ⚠️ Not yet fully DB-backed (lawyers table exists in Prisma but seed data is in-memory)
        │
        ▼
[User clicks on a lawyer card]
        │
        ▼
[LawyerProfile.tsx renders]
        │
        │   Shows:
        │   - Name, photo, bio
        │   - Bar number + jurisdiction (verified badge if isVerified)
        │   - Practice areas + specializations
        │   - Education + certifications
        │   - Languages spoken
        │   - Hourly rate: $X/hour
        │   - Rating: ★4.8 (42 reviews)
        │   - Consultation count
        │   - Availability calendar
        │
        ▼
[User clicks "Book Consultation"]
        │
        ▼
[BookingForm.tsx renders]
        │
        │   Form inputs:
        │   - Date & time picker
        │   - Duration: 30 / 60 / 90 minutes
        │   - Consultation type: Document Review / Advice / Negotiation Support
        │   - Attach contract (optional)
        │   - Notes for the lawyer
        │
        ▼
[User confirms booking]
        │
        ▼
[POST /api/lawyers/consultations (hypothetical)]
        │   prisma.consultation.create({
        │     data: {
        │       lawyerId, clientId: userId, contractId (optional),
        │       scheduledAt, duration,
        │       price: lawyer.hourlyRate × (duration/60),
        │       platformFee: price × 0.15,
        │       paymentStatus: "pending",
        │       status: "pending"
        │     }
        │   })
        │
        ▼
[Notification sent to lawyer + client]
        │
        ▼
[Consultation appears in user's dashboard]
        │
        │   On consultation day:
        │   → meetingUrl populated (e.g., Zoom link)
        │   → status updated to "confirmed"
        │   → After completion → status: "completed"
        │   → Review form shown to client
        │   → prisma.lawyer.update({ rating, reviewCount, consultationCount })
```

---

## Flow 7: Browser Extension — In-Page Contract Analysis

```
[User is on any webpage that contains a contract]
(e.g., reviewing a SaaS Terms of Service, a rental agreement on a legal portal)
        │
        ▼
[content.js (18KB) is injected into every page by Chrome]
        │
        │   content.js scans DOM:
        │   - Looks for large text blocks
        │   - Detects keywords: "agreement", "parties", "whereas", "liability"
        │   - If contract-like text found → flags the extension icon
        │
        ▼
[User sees BeforeYouSign extension icon activated]
        │
        ▼
[User clicks extension icon → popup opens]
        │
        ▼
[popup/index.html renders]
        │
        │   Shows:
        │   - "Contract detected on this page"
        │   - [Analyze This Contract] button
        │
        ▼
[User clicks "Analyze"]
        │
        ▼
[popup sends message to content.js via Chrome messaging API]
        │
        ▼
[content.js extracts full visible text from page]
        │   document.body.innerText (filtered)
        │
        ▼
[content.js sends text to background.js via chrome.runtime.sendMessage]
        │
        ▼
[background.js (service worker) makes API call]
        │
        │   fetch('https://beforeyousign.vercel.app/api/analyze', {
        │     method: 'POST',
        │     body: FormData with text as file blob
        │   })
        │
        ▼
[Analysis result returned to background.js]
        │
        ▼
[background.js sends result back to content.js]
        │
        ▼
[Two display options:]
        │
        ├── Popup display: Risk score + top red flags shown in extension popup
        │
        └── Inline overlay: content.js injects overlay panel on the page itself
            (content.css handles styling)
            Shows: Risk badge, top 3 red flags, "Open full analysis" link
```

---

## Flow 8: API Key Usage (Developer Integration)

```
[Developer creates API key in /settings]
        │
        ▼
[prisma.apiKey.create({
  data: {
    userId,
    name: "My App Integration",
    keyHash: bcrypt.hash(rawKey, 10),
    keyPrefix: rawKey.substring(0, 8),
    rateLimitPerMinute: 60,
    rateLimitPerHour: 1000,
    rateLimitPerDay: 10000
  }
})]
        │
        ▼
[Raw API key shown ONCE — user copies it]
        │
        ▼
[Developer uses key in their application:]
        │
        │   POST https://beforeyousign.vercel.app/api/analyze
        │   Authorization: Bearer bys_xxxxxxxx...
        │   Content-Type: multipart/form-data
        │
        ▼
[API middleware validates key:]
        │   1. Extract prefix from bearer token (first 8 chars)
        │   2. Look up matching apiKey records by prefix
        │   3. bcrypt.compare(incomingKey, storedHash)
        │   4. Check rate limits:
        │      prisma.apiUsage count for last minute/hour/day
        │   5. If over limit → 429 Too Many Requests
        │
        ▼
[Analysis runs normally → result returned]
        │
        │   prisma.apiUsage.create({
        │     data: { apiKeyId, endpoint, method, statusCode, responseTime }
        │   })
        │   prisma.apiKey.update({ lastUsedAt: now() })
```

---

## Page → Role Access Matrix

| Page / Route | Guest (No Login) | Registered User | Lawyer Account | Admin |
|---|:---:|:---:|:---:|:---:|
| `/` (Landing) | ✅ | ✅ | ✅ | ✅ |
| `/analyze` | ✅ (no save) | ✅ (saves to DB) | ✅ | ✅ |
| `/dashboard` | ❌ | ✅ | ✅ | ✅ |
| `/contracts` | ❌ | ✅ | ✅ | ✅ |
| `/chat` | ❌ | ✅ | ✅ | ✅ |
| `/drafting` | ❌ | ✅ | ✅ | ✅ |
| `/negotiate` | ❌ | ✅ | ✅ | ✅ |
| `/playbooks` | ❌ | ✅ | ✅ | ✅ |
| `/compare` | ❌ | ✅ | ✅ | ✅ |
| `/esignature` | ❌ | ✅ | ✅ | ✅ |
| `/lawyers` | ✅ (browse) | ✅ (book) | ✅ (manage profile) | ✅ |
| `/analytics` | ❌ | ✅ | ✅ | ✅ |
| `/compliance` | ❌ | ✅ | ✅ | ✅ |
| `/team` | ❌ | ✅ | ✅ | ✅ |
| `/settings` | ❌ | ✅ | ✅ | ✅ |
| `/admin` | ❌ | ❌ | ❌ | ✅ |
| `/share/[id]` | ✅ (if link valid) | ✅ | ✅ | ✅ |

> ⚠️ **Note:** Due to the intentional auth decoupling during Phase 2/3 development, many `/api/...` endpoints currently do NOT enforce auth. This is a known security debt item — the API layer needs proper Clerk session validation added to each route.

---

## Contract Status State Machine

```
                     [upload]
                        │
                        ▼
                    [ draft ]
                        │
                  [analyze clicked]
                        │
                        ▼
               [ pending_analysis ]
                        │
                  [AI completes]
                        │
                        ▼
                   [ analyzed ]
                        │
          ┌─────────────┼──────────────┐
          ▼             ▼              ▼
    [ in_review ]  [ negotiating ]   (stay analyzed)
          │              │
    [all stages    [terms agreed]
     approved]          │
          │             │
          └──────┬──────┘
                 ▼
            [ approved ]
                 │
          [signatures collected]
                 │
                 ▼
             [ signed ]
                 │
          [expiry date passed /
           manually archived]
                 │
                 ▼
            [ archived ]
```

---

## Error Handling — What Happens When Things Break

| Error Scenario | Where | What Happens |
|---|---|---|
| NVIDIA API rate limit (429) | `lib/contract-analyzer.ts` | Exponential backoff + retry. After max retries: "AI service busy, try again in 1-2 minutes" |
| NVIDIA API timeout (>45s) | `lib/nvidia-client.ts` | AbortController fires, throws: "NVIDIA request timed out after 45000ms" |
| LLM returns malformed JSON | `lib/nvidia-client.ts` | `repairTruncatedJson()` attempts fix. If still fails: error thrown to client |
| DB connection fails | All API routes with try/catch | Graceful fallback to sample data (dashboard stays rendered, no 500 error) |
| File type not supported | `components/FileUpload.tsx` | Frontend blocks before API call: "Only PDF, DOCX, TXT supported" |
| File too large | `components/FileUpload.tsx` | Frontend blocks: "Max file size is 10MB" |
| ONNX model not yet loaded | `lib/ml/embeddings.ts` | First call triggers auto-download (23MB). Subsequent calls use singleton. |
| React component error | `components/ErrorBoundary.tsx` | ErrorBoundary catches render errors, shows friendly fallback UI instead of white screen |
| Unsupported browser / JS error | `app/error.tsx` | Next.js error boundary: full-page error display with reload button |
| 404 route | `app/not-found.tsx` | Custom 404 page |
