# BeforeYouSign - Master Audit Log

## Project Information

Project: BeforeYouSign

Type:
AI-powered contract analysis, drafting, negotiation, compliance, and legal workflow platform.

Tech Stack:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma
- PostgreSQL
- NextAuth
- NVIDIA AI
- Gemini
- OpenAI
- Browser Extension

---

## Repository Understanding

### Core Purpose

BeforeYouSign is a legal intelligence platform allowing users to:

- Upload contracts
- Analyze risks using AI
- Detect dangerous clauses
- Generate contracts
- Negotiate contracts
- Manage contract lifecycle
- Collaborate on agreements
- Access lawyer marketplace features

---

## Audit Progress Snapshot

Current Phase:
Dead Code / Unused Feature Audit

Completed:

✓ Repository Structure Review  
✓ Authentication Audit  
✓ AI Pipeline Audit  
✓ Contract Analysis Audit  
✓ Parser Audit  
✓ Initial API Enumeration  
✓ Initial Page Enumeration  
✓ Initial Component Enumeration

Verified Findings:

- FINDING-001 Mock Authentication Database
- FINDING-002 Contract Analysis Truncation
- FINDING-003 Weak AI Output Validation
- FINDING-004 Dual Authentication Systems
- FINDING-005 Parser Memory Pressure Risk

---

## Verified Findings

### FINDING-001

Severity: P0

Title:
Mock Authentication Database

File:
`auth.ts`

Evidence:

```ts
// Mock user database - Replace with real database in production
const users = new Map<string, {
  id: string;
  name: string;
  email: string;
  password?: string; // hashed
  image?: string;
  emailVerified?: Date;
}>();
```

Additional Evidence:

```ts
// Find user in mock database
const user = users.get(email);
```

```ts
// Store OAuth users in mock database
if (account?.provider !== 'credentials' && user.email) {
  if (!users.has(user.email)) {
    users.set(user.email, {
      id: user.id || crypto.randomUUID(),
      name: user.name || 'Anonymous',
      email: user.email,
      image: user.image,
      emailVerified: new Date(),
    });
  }
}
```

```ts
users.set(data.email, user);
```

Impact:

- No persistent user storage
- In-memory users are lost when the process restarts
- Authentication state is not backed by the declared PostgreSQL/Prisma persistence layer
- Current implementation is not production ready

Status:
OPEN

---

### FINDING-002

Severity: P0

Title:
Contract Analysis Truncation

File:
`app/api/analyze/route.ts`

Evidence:

```ts
const maxPromptChars = parseInt(process.env.ANALYZE_MAX_PROMPT_CHARS || '6000');
const maxTokens = parseInt(process.env.ANALYZE_MAX_OUTPUT_TOKENS || '4096');
const trimmedText = contractText.length > maxPromptChars
  ? contractText.slice(0, maxPromptChars) + '\n\n[Contract text truncated for faster analysis]'
  : contractText;
const prompt = ContractAnalyzer.buildAnalysisPrompt(trimmedText, jurisdiction);
```

Impact:

- Contract content after the configured character limit is omitted from analysis
- Material clauses may not reach the AI provider
- Risk analysis can be incomplete while appearing to represent the entire uploaded contract
- Long legal documents may receive systematically partial results

Status:
OPEN

---

### FINDING-003

Severity: P1

Title:
Weak AI Output Validation

File:
`app/api/analyze/route.ts`

Evidence:

```ts
const analysisData = parseJsonResponse<Record<string, unknown>>(fullText);
const analysis = ContractAnalyzer.formatAnalysis(analysisData, file.name, file.size);
send({ type: 'done', analysis, requestId });
```

Impact:

- The parsed AI response is accepted as a generic record rather than a validated domain schema
- Missing, malformed, or hallucinated fields may reach downstream formatting and rendering
- Runtime type guarantees are not established at the API boundary

Status:
OPEN

---

### FINDING-004

Severity: P1

Title:
Dual Authentication Systems

Files:

- `package.json`
- `next.config.ts`
- `auth.ts`

Evidence:

`package.json`:

```json
"@clerk/nextjs": "^6.37.3",
```

```json
"next-auth": "^5.0.0-beta.30",
```

`auth.ts`:

```ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
```

`next.config.ts`:

```ts
"script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.clerk.services https://*.clerk.accounts.dev",
```

```ts
"connect-src 'self' https://integrate.api.nvidia.com https://clerk.clerk.services https://*.clerk.accounts.dev wss://*.clerk.accounts.dev",
```

Impact:

- Authentication architecture is ambiguous
- Dependency and configuration surface is larger than necessary
- Security policy still authorizes Clerk endpoints while the inspected authentication implementation uses NextAuth
- Maintenance and migration risk are increased

Status:
OPEN

---

### FINDING-005

Severity: P2

Title:
Parser Memory Pressure Risk

File:
`lib/document-parser.ts`

Evidence:

```ts
static async parse(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const fileType = file.type;
```

Additional Evidence:

```ts
if (fileType === 'application/pdf') {
  return this.parsePDF(Buffer.from(buffer));
} else if (
  fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
  fileType === 'application/msword'
) {
  return this.parseDOCX(Buffer.from(buffer));
} else if (fileType === 'text/plain') {
  return this.parseTXT(Buffer.from(buffer));
}
```

Impact:

- Each uploaded document is loaded fully into memory
- Conversion from `ArrayBuffer` to Node.js `Buffer` can increase memory pressure
- Concurrent large-file parsing may stress serverless or constrained runtimes

Status:
OPEN

---

## Verified Architecture Notes

### AI Flow

Upload  
→ Parser  
→ Prompt Builder  
→ NVIDIA/OpenAI/Gemini  
→ Stream Response  
→ Analysis Renderer

The inspected `app/api/analyze/route.ts` specifically uses the NVIDIA client and streams Server-Sent Events.

### Auth Flow

Current:
NextAuth + in-memory mock user map

Expected:
NextAuth + persistent database adapter, consistent with the declared Prisma/PostgreSQL architecture

No persistent authentication adapter was present in the inspected `auth.ts`.

---

## Verified Technical Debt

1. Multiple AI providers
2. Multiple authentication providers or provider remnants
3. Large `lib` directory
4. Missing runtime schema validation at the inspected analysis API boundary
5. Heavy in-memory document parsing layer

---

## Initial Repository Enumerations

### API Routes Enumerated

- `app/api/analyze/route.ts`
- `app/api/analyze-advanced/route.ts`
- `app/api/analytics/kpis/route.ts`
- `app/api/analytics/portfolio/route.ts`
- `app/api/analytics/savings/route.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `app/api/collaboration/sessions/route.ts`
- `app/api/detect-clauses/route.ts`
- `app/api/drafting/route.ts`
- `app/api/lifecycle/workflows/route.ts`
- `app/api/negotiate/route.ts`
- `app/api/negotiate-live/route.ts`
- `app/api/pdf/compress/route.ts`
- `app/api/pdf/from-image/route.ts`
- `app/api/pdf/info/route.ts`
- `app/api/pdf/merge/route.ts`
- `app/api/pdf/protect/route.ts`
- `app/api/pdf/rotate/route.ts`
- `app/api/pdf/split/route.ts`
- `app/api/pdf/to-image/route.ts`
- `app/api/playbook/route.ts`
- `app/api/share/route.ts`
- `app/api/share/[shareId]/route.ts`
- `app/api/templates/build/route.ts`
- `app/api/templates/clauses/route.ts`

Enumeration alone does not establish that any route is live, dead, reachable, secured, or correct.

### Pages Enumerated

- `app/admin/page.tsx`
- `app/analyze/page.tsx`
- `app/analytics/page.tsx`
- `app/auth/signin/page.tsx`
- `app/auth/signup/page.tsx`
- `app/automation/page.tsx`
- `app/benchmark/page.tsx`
- `app/blockchain/page.tsx`
- `app/book/[lawyerId]/page.tsx`
- `app/chat/page.tsx`
- `app/clauses/page.tsx`
- `app/compare/page.tsx`
- `app/compliance/page.tsx`
- `app/contracts/page.tsx`
- `app/dashboard/page.tsx`
- `app/drafting/page.tsx`
- `app/esignature/page.tsx`
- `app/extension/page.tsx`
- `app/features/page.tsx`
- `app/intelligence/page.tsx`
- `app/lawyers/page.tsx`
- `app/lawyers/register/page.tsx`
- `app/lawyers/[id]/page.tsx`
- `app/library/page.tsx`
- `app/market-intelligence/page.tsx`
- `app/multi-language/page.tsx`
- `app/negotiate/page.tsx`
- `app/notifications/page.tsx`
- `app/obligations/page.tsx`
- `app/page.tsx`
- `app/playbooks/page.tsx`
- `app/profile/page.tsx`
- `app/renewals/page.tsx`
- `app/risk/page.tsx`
- `app/search/page.tsx`
- `app/settings/page.tsx`
- `app/share/[shareId]/page.tsx`
- `app/team/page.tsx`
- `app/template-builder/page.tsx`
- `app/templates/page.tsx`
- `app/templates-enhanced/page.tsx`
- `app/tools/page.tsx`
- `app/voice/page.tsx`

Enumeration alone does not establish that any page is linked, reachable through navigation, complete, or actively used.

### Components Enumerated

- `components/AdvancedAnalyticsDashboard.tsx`
- `components/AIContractDrafter.tsx`
- `components/AIContractNegotiationAssistant.tsx`
- `components/AnalysisResult.tsx`
- `components/AnalyticsDashboard.tsx`
- `components/AnimatedStats.tsx`
- `components/BlockchainVerification.tsx`
- `components/BookingForm.tsx`
- `components/BusinessIntelligenceDashboard.tsx`
- `components/ClauseCard.tsx`
- `components/CompareVersions.tsx`
- `components/ComplianceMonitoring.tsx`
- `components/ContractAutomation.tsx`
- `components/ContractChat.tsx`
- `components/ContractIntelligenceSearch.tsx`
- `components/ContractRepository.tsx`
- `components/DocumentIntelligence.tsx`
- `components/ErrorBoundary.tsx`
- `components/ESignature.tsx`
- `components/FileUpload.tsx`
- `components/Footer.tsx`
- `components/JsonLd.tsx`
- `components/LawyerMarketplace.tsx`
- `components/LawyerProfile.tsx`
- `components/LawyerRegistration.tsx`
- `components/LegalLibrary.tsx`
- `components/Loading.tsx`
- `components/MarketIntelligenceDashboard.tsx`
- `components/Navbar.tsx`
- `components/NotificationsCenter.tsx`
- `components/PDFTools.tsx`
- `components/Playbooks.tsx`
- `components/PredictiveAnalyticsDashboard.tsx`
- `components/ProgressStepper.tsx`
- `components/RenewalCalendar.tsx`
- `components/RiskGauge.tsx`
- `components/Skeleton.tsx`
- `components/SmartTemplateBuilder.tsx`
- `components/TeamCollaboration.tsx`
- `components/TemplateCustomizationWizard.tsx`
- `components/TemplatesEnhanced.tsx`
- `components/TemplatesLibrary.tsx`
- `components/ToastProvider.tsx`
- `components/UserDashboard.tsx`
- `components/VersionComparisonViewer.tsx`

Enumeration alone does not establish whether a component is imported, rendered, duplicated, obsolete, or unreachable.

---

## Files Inspected During This Session

### Source Files Read and Verified

- `auth.ts`
- `app/api/analyze/route.ts`
- `lib/document-parser.ts`
- `package.json`
- `next.config.ts`

### Audit Files Checked Before Creation

- `PROJECT_AUDIT_MASTER.md` — not present at the start of this session
- `SESSION_LOG.md` — not present at the start of this session

### Directories and Paths Enumerated

- Repository root
- Parent directory of the repository root
- `app/api`
- `app`
- `components`

Files listed by enumeration were not treated as content-inspected unless separately identified under “Source Files Read and Verified.”

---

## Commands Executed During This Session

Working directory for commands unless otherwise stated:
`C:\Personal Coding\Projects\beforeyousign-main\beforeyousign-main`

### Target File Discovery

```powershell
Get-Content -Raw -LiteralPath 'PROJECT_AUDIT_MASTER.md'
```

Result:
Failed because the file did not exist.

```powershell
Get-Content -Raw -LiteralPath 'SESSION_LOG.md'
```

Result:
Failed because the file did not exist.

```powershell
git status --short
```

Result:
Failed because the supplied directory is not a Git worktree and has no discoverable parent `.git` directory.

```powershell
rg --files -g 'PROJECT_AUDIT_MASTER.md' -g 'SESSION_LOG.md' -g '.git' -g 'package.json' 'C:\Personal Coding\Projects\beforeyousign-main'
```

Result:
Found the project `package.json`; no existing audit log files or `.git` path were returned.

```powershell
Get-ChildItem -Force | Select-Object Name,FullName,Mode
```

Result:
Enumerated the repository root.

```powershell
Get-ChildItem -Force -LiteralPath '..' | Select-Object Name,FullName,Mode
```

Result:
Enumerated the repository parent directory.

### Evidence Inspection

```powershell
Get-Content -Raw -LiteralPath 'auth.ts'
```

```powershell
Get-Content -Raw -LiteralPath 'app/api/analyze/route.ts'
```

```powershell
Get-Content -Raw -LiteralPath 'lib/document-parser.ts'
```

```powershell
Get-Content -Raw -LiteralPath 'package.json'; Get-Content -Raw -LiteralPath 'next.config.ts'
```

### Initial Enumerations

```powershell
rg --files app/api
```

```powershell
rg --files app -g 'page.tsx' -g 'page.ts' -g 'route.ts'
```

```powershell
rg --files components
```

```powershell
rg -n "@clerk/nextjs|next-auth|clerk" package.json next.config.ts auth.ts
```

### Audit File Verification

```powershell
Get-Item -LiteralPath 'PROJECT_AUDIT_MASTER.md','SESSION_LOG.md' | Select-Object Name,Length; Select-String -Path 'PROJECT_AUDIT_MASTER.md','SESSION_LOG.md' -Pattern '^## Audit Progress Snapshot$','^## Pending Audit Tasks$','^## Resume Instructions For Any Future IDE$','^## Commands Executed During This Session$','^## Files Inspected During This Session$' | Select-Object Path,LineNumber,Line
```

Result:
Confirmed that both files exist, contain content, and include the required section headings.

---

## Pending Audit Tasks

Priority Order:

1. Dead API Route Audit
2. Orphan Page Audit
3. Unused Component Audit
4. Unused Utility Audit
5. Duplicate System Audit
6. Feature Connectivity Audit
7. UI/Responsive Audit
8. Performance Audit

---

## Resume Instructions For Any Future IDE

### What Has Already Been Verified

- `auth.ts` uses NextAuth and an in-memory `Map` as its user store.
- The inspected authentication implementation does not contain a persistent database adapter.
- `app/api/analyze/route.ts` defaults the maximum contract prompt input to 6,000 characters and truncates longer extracted text.
- `app/api/analyze/route.ts` parses the AI response as `Record<string, unknown>` before passing it to `ContractAnalyzer.formatAnalysis`.
- `package.json` declares both `@clerk/nextjs` and `next-auth`.
- `next.config.ts` retains Clerk domains in its Content Security Policy.
- `lib/document-parser.ts` reads each uploaded file fully with `file.arrayBuffer()` before parsing.
- Initial API route, page, and component path enumerations are complete and recorded in this file.
- FINDING-001 through FINDING-005 are evidence-backed and remain OPEN.

### What Remains Unverified

- Whether each enumerated API route has a caller and is reachable from a current feature.
- Whether each enumerated page is linked from navigation or reachable through an intended user workflow.
- Whether each enumerated component is imported and rendered.
- Whether utilities, hooks, types, data modules, and library functions are unused.
- Whether apparently similar features are intentional variants or duplicate implementations.
- Whether UI controls connect to working APIs and persistence.
- Whether all pages are responsive and usable across target viewport sizes.
- Whether performance bottlenecks exist outside the verified parser memory-risk pattern.
- Whether Prisma and PostgreSQL are fully configured or used elsewhere for authentication or application persistence.
- Whether OpenAI and Gemini paths are active, fallback-only, experimental, or dead.
- Whether Clerk is actively used outside the files inspected so far or is only a dependency/configuration remnant.

### Assumptions That Must Not Be Repeated

- Do not label an API route dead merely because no caller has yet been found; search all server and client references first.
- Do not label a page orphaned merely because it is absent from the primary navbar; inspect links, redirects, dynamic routes, middleware, and programmatic navigation.
- Do not label a component unused from filename inspection; verify imports, dynamic imports, barrel exports, and indirect composition.
- Do not assume Clerk is unused solely because `auth.ts` uses NextAuth; complete a repository-wide Clerk symbol and configuration search.
- Do not assume Prisma/PostgreSQL authentication persistence exists solely because the technologies are declared in project documentation.
- Do not assume all AI providers are live solely because their dependencies are installed.
- Do not convert an enumerated path into a finding without reproducible evidence.
- Do not duplicate FINDING-001 through FINDING-005 under new IDs.
- Do not mark an existing finding resolved without verifying the implementation and recording replacement evidence.

### Where the Next Audit Should Continue

Continue with Priority 1: Dead API Route Audit.

For every route under `app/api`:

1. Record exported HTTP methods.
2. Search the entire repository for URL references, fetch calls, server actions, SDK wrappers, tests, and extension callers.
3. Check dynamic route construction and indirect callers before declaring a route unused.
4. Record authentication and authorization guards.
5. Record request validation, response schema, persistence dependencies, and external provider dependencies.
6. Classify each route as verified active, likely active, unreferenced, duplicate, stubbed, or requires runtime verification.
7. Create a new finding only when the evidence demonstrates a concrete defect or risk.

The first route inventory should begin with:
`app/api/analyze/route.ts`, then continue through every path listed under “API Routes Enumerated.”

---

## Decisions

Append future architectural decisions here. Each decision should include:

- Decision ID
- Date
- Context
- Decision
- Alternatives considered
- Consequences
- Related findings

No architectural decisions were recorded during this session.

---

## Resolved Issues

Move fixed issues here only after implementation and verification.

No issues have been resolved.

---

## Future Investigations

- Complete the pending audit tasks in priority order.
- Verify repository-wide authentication usage and select one production authentication architecture.
- Verify persistence coverage across contracts, users, collaboration, analytics, and lifecycle workflows.
- Verify AI provider ownership, fallback behavior, model configuration, and output schemas.
- Verify browser extension connectivity to current application APIs.

---

END OF MASTER LOG

---

## API Route Audit

Audit date:
2026-06-19

Audit scope:
All 25 `route.ts` files under `app/api`.

Caller-search scope:

- `fetch(...)`
- `axios(...)`
- `ky(...)`
- Literal API paths
- Endpoint variables
- Route constants
- Server actions
- API wrappers
- Browser extension code
- Dynamic route construction
- Test and specification filenames

No `axios` callers, `ky` callers, or test/specification files were found for the audited routes.

### ROUTE-001

Route:
`app/api/analyze-advanced/route.ts`

Methods:

- `POST`
- `GET`

Request Inputs:

- `POST` JSON body: `contractText`, `contractType`, `industry`, `jurisdiction`
- `GET`: no request values are read

Response Outputs:

- `POST` success: JSON containing `success: true`, `analysis`, and `metadata`
- `POST` validation failure: JSON `{ error: 'Contract text is required' }`, status 400
- `POST` exception: JSON containing `success: false`, `error`, and `message`, status 500
- `GET`: JSON service status, feature list, and timestamp

Auth:
No call to `auth()`, `auth.protect()`, session validation, token validation, or authorization check is present in this route.

Validation:
`POST` checks only whether `contractText` is truthy. No type, length, `contractType`, `industry`, or `jurisdiction` validation is present.

Dependencies:

- Internal: `AdvancedAnalyzer` from `lib/advanced-analyzer.ts`
- External service: NVIDIA NIM through `generateText` in `lib/advanced-analyzer.ts` and `lib/nvidia-client.ts`
- Database: none referenced by the route or `AdvancedAnalyzer`

Callers:
No runtime caller was found. Repository matches were limited to `vercel.json` function configuration and documentation-generation scripts.

Classification:
UNREFERENCED

Evidence:

```ts
const body = await request.json();
const { contractText, contractType, industry, jurisdiction } = body;

if (!contractText) {
  return NextResponse.json(
    { error: 'Contract text is required' },
    { status: 400 }
  );
}
```

```ts
const analyzer = new AdvancedAnalyzer();
const result = await analyzer.analyzeContract(
  contractText,
  contractType || 'general',
);
```

Caller search returned only:

```text
vercel.json
scripts/generate-docs.mjs
scripts/generate_docs.py
```

Notes:
Runtime invocation outside the repository is UNKNOWN.

---

### ROUTE-002

Route:
`app/api/analyze/route.ts`

Methods:

- `POST`

Request Inputs:

- Multipart form data field `file`
- Multipart form data field `jurisdiction`, defaulting to `US`
- Optional `x-request-id` request header
- Environment inputs: `NEXT_PUBLIC_MAX_FILE_SIZE`, `ANALYZE_MAX_PROMPT_CHARS`, and `ANALYZE_MAX_OUTPUT_TOKENS`

Response Outputs:

- Server-Sent Events with `status`, `chunk`, `done`, or `error` event payloads
- Response headers include `Content-Type: text/event-stream`, `Cache-Control`, `Connection`, and `X-Request-Id`

Auth:
No call to `auth()`, session validation, token validation, or authorization check is present in this route.

Validation:

- Requires `file`
- Calls `validateContractFile(file)`
- Calls `DocumentParser.validateFileType(file)`
- Calls `DocumentParser.validateFileSize(file, maxSize)`
- Requires extracted text of at least 100 non-whitespace characters
- Sanitizes `jurisdiction`

Dependencies:

- Internal: `DocumentParser`, `ContractAnalyzer`, `validateContractFile`, `sanitizeInput`, NVIDIA client helpers
- External packages: `mammoth`, `pdf-parse`, and `openai`
- External service: NVIDIA NIM at `https://integrate.api.nvidia.com/v1`
- Database: no database operation is executed by this route; `lib/security.ts` imports `db`, but the called file-validation and sanitization functions do not establish a route database operation

Callers:

- `app/analyze/AnalyzePageClient.tsx`
- `components/AnalysisResult.tsx`

The primary caller component is rendered by `app/analyze/page.tsx`. `AnalysisResult` is rendered by both the analyze page client and shared-analysis page.

Classification:
VERIFIED_ACTIVE

Evidence:

```ts
const response = await fetch('/api/analyze', {
  method: 'POST',
  body: formData,
});
```

```ts
app/analyze/page.tsx:38:      <AnalyzePageClient />
app/analyze/AnalyzePageClient.tsx:238:        {analysis && <AnalysisResult analysis={analysis} />}
```

Notes:
Runtime success against NVIDIA NIM was not executed during this audit.

---

### ROUTE-003

Route:
`app/api/analytics/kpis/route.ts`

Methods:

- `POST`

Request Inputs:
JSON body containing `contracts`.

Response Outputs:

- Success: JSON result from `BusinessIntelligenceEngine.generateExecutiveKPIs(contracts)`
- Unauthorized: JSON `{ error: 'Unauthorized' }`, status 401
- Invalid input: JSON `{ error: 'Contracts array required' }`, status 400
- Exception: JSON `{ error: 'Failed to generate KPIs' }`, status 500

Auth:
Requires a truthy result from `auth()`.

Validation:
Requires `contracts` to exist and satisfy `Array.isArray(contracts)`.

Dependencies:

- Internal: `BusinessIntelligenceEngine`
- Authentication: `auth` from `auth.ts`
- Database: none referenced by the route or `BusinessIntelligenceEngine`
- External service: none referenced by the route or `BusinessIntelligenceEngine`

Callers:
No caller or endpoint string reference was found outside the route.

Classification:
UNREFERENCED

Evidence:

```ts
const session = await auth();
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

```ts
if (!contracts || !Array.isArray(contracts)) {
  return NextResponse.json({ error: 'Contracts array required' }, { status: 400 });
}
```

Notes:
`components/BusinessIntelligenceDashboard.tsx` imports and instantiates `BusinessIntelligenceEngine` directly; it does not call this API route.

---

### ROUTE-004

Route:
`app/api/analytics/portfolio/route.ts`

Methods:

- `POST`

Request Inputs:
JSON body containing `contracts`.

Response Outputs:

- Success: JSON result from `BusinessIntelligenceEngine.analyzePortfolio(contracts)`
- Unauthorized: JSON `{ error: 'Unauthorized' }`, status 401
- Invalid input: JSON `{ error: 'Contracts array required' }`, status 400
- Exception: JSON `{ error: 'Failed to analyze portfolio' }`, status 500

Auth:
Requires a truthy result from `auth()`.

Validation:
Requires `contracts` to exist and satisfy `Array.isArray(contracts)`.

Dependencies:

- Internal: `BusinessIntelligenceEngine`
- Authentication: `auth` from `auth.ts`
- Database: none referenced by the route or `BusinessIntelligenceEngine`
- External service: none referenced by the route or `BusinessIntelligenceEngine`

Callers:
No caller or endpoint string reference was found outside the route.

Classification:
UNREFERENCED

Evidence:

```ts
const portfolio = await engine.analyzePortfolio(contracts);
return NextResponse.json(portfolio);
```

Notes:
`components/BusinessIntelligenceDashboard.tsx` uses the engine directly and does not call this route.

---

### ROUTE-005

Route:
`app/api/analytics/savings/route.ts`

Methods:

- `POST`

Request Inputs:
JSON body containing `contracts`.

Response Outputs:

- Success: JSON `{ opportunities }`
- Unauthorized: JSON `{ error: 'Unauthorized' }`, status 401
- Invalid input: JSON `{ error: 'Contracts array required' }`, status 400
- Exception: JSON `{ error: 'Failed to identify savings' }`, status 500

Auth:
Requires a truthy result from `auth()`.

Validation:
Requires `contracts` to exist and satisfy `Array.isArray(contracts)`.

Dependencies:

- Internal: `BusinessIntelligenceEngine`
- Authentication: `auth` from `auth.ts`
- Database: none referenced by the route or `BusinessIntelligenceEngine`
- External service: none referenced by the route or `BusinessIntelligenceEngine`

Callers:
No caller or endpoint string reference was found outside the route.

Classification:
UNREFERENCED

Evidence:

```ts
const opportunities = await engine.identifyCostSavings(contracts);
return NextResponse.json({ opportunities });
```

Notes:
`components/BusinessIntelligenceDashboard.tsx` uses the engine directly and does not call this route.

---

### ROUTE-006

Route:
`app/api/auth/[...nextauth]/route.ts`

Methods:

- `GET`
- `POST`

Request Inputs:
NextAuth handler inputs vary by the matched `/api/auth/*` subpath. Exact per-subpath input handling is delegated to `handlers` from `auth.ts`.

Response Outputs:
NextAuth handler responses. Exact per-subpath response schemas are delegated to NextAuth and are not defined in this route file.

Auth:
This is the NextAuth handler route. `auth.ts` configures GitHub, Google, and Credentials providers with JWT sessions.

Validation:

- Route-level validation is delegated to NextAuth handlers
- The Credentials provider in `auth.ts` requires email and password
- Credential passwords are checked with `bcryptjs.compare`

Dependencies:

- Internal: `handlers` from `auth.ts`
- External packages/services: NextAuth, GitHub OAuth, Google OAuth, `bcryptjs`
- Database: none; `auth.ts` uses an in-memory `Map`

Callers:

- `lib/auth-utils.ts`: `/api/auth/session`
- `lib/auth-utils.ts`: `/api/auth/signout`
- `lib/auth-utils.ts`: `/api/auth/callback/credentials`
- `lib/auth-utils.ts`: `/api/auth/register`
- `app/auth/signin/page.tsx`: dynamically builds `/api/auth/signin/${provider}`
- `app/auth/signup/page.tsx`: dynamically builds `/api/auth/signin/${provider}`

Classification:
VERIFIED_ACTIVE

Evidence:

```ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
```

```ts
const res = await fetch('/api/auth/session');
```

```ts
window.location.href = `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
```

Notes:
Whether `/api/auth/register` is handled as intended by the delegated NextAuth handlers is UNKNOWN because no runtime request was executed.

---

### ROUTE-007

Route:
`app/api/collaboration/sessions/route.ts`

Methods:

- `POST`
- `GET`

Request Inputs:

- `POST` JSON body with `action` and action-specific data
- Supported actions: `join`, `operation`, `cursor`, `comment`, `suggestion`, `review-suggestion`, and `replay`
- `GET` query parameter: `documentId`

Response Outputs:

- `POST`: action-specific session, operation, comment, suggestion, replay, or `{ success: true }` JSON
- `POST` invalid action: JSON error, status 400
- `POST` unauthorized: JSON error, status 401
- `GET`: session summary JSON
- `GET` missing document ID: status 400
- `GET` missing session: status 404
- Exceptions: JSON error, status 500

Auth:

- `POST` requires `session?.user` from `auth()`
- `GET` contains no authentication or authorization check

Validation:

- `POST` validates only the `action` by switch matching
- Action-specific fields are destructured but not explicitly validated in the route
- `GET` requires `documentId`

Dependencies:

- Internal: `RealtimeCollaborationEngine`
- Authentication: `auth` from `auth.ts` for `POST`
- Database: none; `RealtimeCollaborationEngine` stores sessions in a `Map`
- External service: none referenced

Callers:
No caller or endpoint string reference was found outside the route.

Classification:
UNREFERENCED

Evidence:

```ts
const engine = new RealtimeCollaborationEngine();
```

```ts
private sessions: Map<string, CollaborationSession> = new Map();
```

```ts
const session = await auth();
if (!session?.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

Notes:
Runtime invocation outside the repository is UNKNOWN.

---

### ROUTE-008

Route:
`app/api/detect-clauses/route.ts`

Methods:

- `POST`

Request Inputs:
JSON body containing string field `text`.

Response Outputs:

- Success: JSON containing `success: true`, `clauses`, and `riskSummary`
- Missing or non-string text: JSON error, status 400
- Empty AI response: JSON error, status 500
- Unparseable AI response: JSON error, status 500
- Exception: JSON error, status 500

Auth:
No authentication or authorization check is present in this route.

Validation:

- Requires `text`
- Requires `typeof text === 'string'`
- Truncates input to 8,000 characters
- Requires a JSON-shaped substring in the AI response
- Does not perform runtime schema validation of individual parsed clause fields

Dependencies:

- Internal: `generateText`, `NVIDIA_MODELS`
- External package: `openai` through `lib/nvidia-client.ts`
- External service: NVIDIA NIM
- Database: none referenced

Callers:
`browser-extension/content.js` calls this route using a configurable `apiBase`.

Classification:
VERIFIED_ACTIVE

Evidence:

```js
const res = await fetch(`${apiBase}/api/detect-clauses`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text }),
});
```

```ts
if (!text || typeof text !== 'string') {
  return NextResponse.json({ error: 'text is required' }, { status: 400 });
}
```

Notes:
Successful runtime communication between the extension and a deployed API instance was not executed during this audit.

---

### ROUTE-009

Route:
`app/api/drafting/route.ts`

Methods:

- `POST`

Request Inputs:
JSON body containing `action` plus action-specific data.

Supported action inputs:

- `draft`: fields matching `ContractDraftRequest`
- `refine`: `currentDraft`, `refinements`
- `variations`: `draftId`
- `recommendations`: `contractType`, `industry`, `parties`, `existingSections`

Response Outputs:

- Success: action-specific JSON from `AIContractDrafter`
- Unauthorized: JSON error, status 401
- Invalid action: JSON error, status 400
- Exception: JSON error, status 500

Auth:
Requires a truthy result from `auth()`.

Validation:
Validates only that `action` matches a supported switch case. No explicit validation of action-specific fields is present in the route.

Dependencies:

- Internal: `AIContractDrafter`
- Authentication: `auth` from `auth.ts`
- External service: NVIDIA NIM through `lib/ai-contract-drafter.ts`
- Database: none referenced

Callers:
`components/AIContractDrafter.tsx` calls `POST /api/drafting` with action `draft`. The component is rendered by `app/drafting/page.tsx`.

Classification:
VERIFIED_ACTIVE

Evidence:

```ts
const res = await fetch('/api/drafting', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'draft', ...request }),
});
```

```ts
app/drafting/page.tsx:1:import AIContractDrafter from '@/components/AIContractDrafter';
app/drafting/page.tsx:4:  return <AIContractDrafter />;
```

Notes:
Repository callers for `refine`, `variations`, and `recommendations` actions were not found.

---

### ROUTE-010

Route:
`app/api/lifecycle/workflows/route.ts`

Methods:

- `POST`

Request Inputs:
JSON body containing `action` plus action-specific data.

Supported action inputs:

- `create`: `contractType`, `contractValue`
- `approve`: `lifecycle`, `stepId`, `approverId`, `comments`, optional `approverName`
- `reject`: `lifecycle`, `stepId`, `approverId`, `comments`, optional `approverName`
- `obligations`: `contractId`, `contractText`
- `renewals`: `contracts`

Response Outputs:

- Success: action-specific JSON from `ContractLifecycleManager`
- Unauthorized: JSON error, status 401
- Invalid action: JSON error, status 400
- Exception: JSON error, status 500

Auth:
Requires a truthy result from `auth()`.

Validation:
Validates only that `action` matches a supported switch case. Action-specific fields are not explicitly validated in the route.

Dependencies:

- Internal: `ContractLifecycleManager`
- Authentication: `auth` from `auth.ts`
- Database: none referenced by the route or manager file
- External service: none referenced by the route or manager file

Callers:
No caller or endpoint string reference was found outside the route.

Classification:
UNREFERENCED

Evidence:

```ts
const manager = new ContractLifecycleManager();
```

```ts
switch (action) {
  case 'create':
  case 'approve':
  case 'reject':
  case 'obligations':
  case 'renewals':
```

Notes:
Runtime invocation outside the repository is UNKNOWN.

---

### ROUTE-011

Route:
`app/api/negotiate-live/route.ts`

Methods:

- `POST`

Request Inputs:
JSON matching `NegotiationRequest`:

- `contractText`
- `clause`
- `currentPosition`
- Optional `desiredOutcome`
- Optional `context.industry`
- Optional `context.relationshipImportance`
- Optional `context.timeframe`
- Optional `context.alternatives`

Response Outputs:

- Success: JSON matching `NegotiationResponse`
- Missing required fields: JSON error, status 400
- Exception: JSON error, status 500
- If AI response parsing fails, the route returns a hard-coded fallback `NegotiationResponse`

Auth:
No authentication or authorization check is present.

Validation:
Requires truthy `contractText` and `clause`. Other request fields are not explicitly validated.

Dependencies:

- Internal: `generateText`, `parseJsonResponse`
- External service: NVIDIA NIM
- Database: none referenced

Callers:
No caller or endpoint string reference was found outside the route.

Classification:
UNREFERENCED

Evidence:

```ts
if (!body.contractText || !body.clause) {
  return NextResponse.json(
    { error: 'Contract text and clause are required' },
    { status: 400 }
  );
}
```

```ts
const response = await generateText(prompt, undefined, 0.7, 4096);
```

Notes:
Runtime invocation outside the repository is UNKNOWN.

---

### ROUTE-012

Route:
`app/api/negotiate/route.ts`

Methods:

- `POST`

Request Inputs:
JSON body containing `clause` and `contractContext`.

Response Outputs:

- Success: JSON `{ success: true, script }`
- Missing fields: JSON `{ success: false, error: 'Missing required fields' }`, status 400
- Exception: JSON failure response, status 500

Auth:
No authentication or authorization check is present.

Validation:
Requires truthy `clause` and `contractContext`. No runtime schema validation of `clause` is present.

Dependencies:

- Internal: `generateNegotiationScript`
- External service: NVIDIA NIM through `lib/negotiation-scripts.ts`
- Database: none referenced

Callers:
`components/AnalysisResult.tsx` calls this route from its negotiation-script handler. `AnalysisResult` is rendered by the analyze and shared-analysis flows.

Classification:
VERIFIED_ACTIVE

Evidence:

```ts
const response = await fetch('/api/negotiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    clause,
    contractContext: `Contract: ${analysis.metadata.fileName}, Risk Score: ${analysis.riskScore}/100`,
  }),
});
```

Notes:
Runtime success against NVIDIA NIM was not executed during this audit.

---

### ROUTE-013

Route:
`app/api/pdf/compress/route.ts`

Methods:

- `POST`

Request Inputs:

- Multipart form field `file`
- Multipart form field `quality`, parsed as an integer and defaulting to 75

Response Outputs:

- Success: PDF binary with content-disposition and size/compression headers
- Missing file: JSON error, status 400
- Exception: JSON error, status 500

Auth:
No authentication or authorization check is present.

Validation:
Requires `file`. No MIME type, extension, file-size, or `quality` range validation is present.

Dependencies:

- External package: `pdf-lib`
- Database: none referenced
- External service: none referenced

Callers:
`components/PDFTools.tsx` selects `/api/pdf/compress` and passes the selected endpoint to `fetch`. `PDFTools` is rendered by `app/tools/page.tsx`.

Classification:
VERIFIED_ACTIVE

Evidence:

```ts
endpoint = '/api/pdf/compress';
```

```ts
const response = await fetch(endpoint, {
  method: 'POST',
  body: formData,
});
```

Notes:
The parsed `quality` value is not passed to `PDFDocument.save` in the route.

---

### ROUTE-014

Route:
`app/api/pdf/from-image/route.ts`

Methods:

- `POST`

Request Inputs:

- Multipart form fields `files`
- Multipart form field `pageSize`, defaulting to `A4`

Response Outputs:

- Success: PDF binary with content-disposition header
- No files: JSON error, status 400
- Exception: JSON error containing the caught message, status 500

Auth:
No authentication or authorization check is present.

Validation:
Requires at least one file. File type is selected from MIME type or filename; no file-size limit is present. `pageSize` is read but not validated.

Dependencies:

- External packages: `pdf-lib`, `sharp`
- Database: none referenced
- External service: none referenced

Callers:
`components/PDFTools.tsx` selects `/api/pdf/from-image` and fetches the selected endpoint. `PDFTools` is rendered by `app/tools/page.tsx`.

Classification:
VERIFIED_ACTIVE

Evidence:

```ts
endpoint = '/api/pdf/from-image';
```

```ts
const files = formData.getAll('files') as File[];
```

Notes:
The `pageSize` input is read but is not used to set the created page size.

---

### ROUTE-015

Route:
`app/api/pdf/info/route.ts`

Methods:

- `POST`

Request Inputs:
Multipart form field `file`.

Response Outputs:

- Success: JSON containing `success`, document `metadata`, file/page `stats`, and per-page dimensions
- Missing file: JSON error, status 400
- Exception: JSON error, status 500

Auth:
No authentication or authorization check is present.

Validation:
Requires `file`. No MIME type, extension, or file-size validation is present.

Dependencies:

- External package: `pdf-lib`
- Database: none referenced
- External service: none referenced

Callers:
`components/PDFTools.tsx` selects `/api/pdf/info` and fetches the selected endpoint. `PDFTools` is rendered by `app/tools/page.tsx`.

Classification:
VERIFIED_ACTIVE

Evidence:

```ts
endpoint = '/api/pdf/info';
```

```ts
return NextResponse.json({
  success: true,
  metadata: {
    title,
    author,
    subject,
    creator,
    producer,
    creationDate: creationDate?.toISOString(),
    modificationDate: modificationDate?.toISOString(),
  },
```

Notes:
Runtime PDF parsing was not executed during this audit.

---

### ROUTE-016

Route:
`app/api/pdf/merge/route.ts`

Methods:

- `POST`

Request Inputs:
Multipart form fields `files`.

Response Outputs:

- Success: merged PDF binary with content-disposition header
- Fewer than two files: JSON error, status 400
- Exception: JSON error, status 500

Auth:
No authentication or authorization check is present.

Validation:
Requires at least two files. No MIME type, extension, per-file size, total-size, or page-count validation is present.

Dependencies:

- External package: `pdf-lib`
- Database: none referenced
- External service: none referenced

Callers:
`components/PDFTools.tsx` selects `/api/pdf/merge` and fetches the selected endpoint. `PDFTools` is rendered by `app/tools/page.tsx`.

Classification:
VERIFIED_ACTIVE

Evidence:

```ts
endpoint = '/api/pdf/merge';
```

```ts
if (files.length < 2) {
  return NextResponse.json(
    { error: 'At least 2 PDF files required for merging' },
    { status: 400 }
  );
}
```

Notes:
Runtime PDF merging was not executed during this audit.

---

### ROUTE-017

Route:
`app/api/pdf/protect/route.ts`

Methods:

- `POST`

Request Inputs:

- Multipart form field `file`
- Multipart form field `password`
- Multipart form field `permissions`

Response Outputs:

- Success: watermarked PDF binary with `X-Protection: watermarked`
- Missing file or password: JSON error, status 400
- Exception: JSON error, status 500

Auth:
No authentication or authorization check is present.

Validation:
Requires truthy `file` and `password`. No file-type, file-size, password-strength, or permissions validation is present.

Dependencies:

- External package: `pdf-lib`
- Database: none referenced
- External service: none referenced

Callers:
`components/PDFTools.tsx` selects `/api/pdf/protect` and fetches the selected endpoint. `PDFTools` is rendered by `app/tools/page.tsx`.

Classification:
STUB

Evidence:

```ts
// Note: pdf-lib doesn't support encryption directly
// In production, you'd use a library like pdf-lib with additional encryption support
// or node-qpdf, hummus, etc.
    
// For now, we'll add a watermark indicating it should be password protected
```

```ts
'X-Protection': 'watermarked',
```

Notes:
The route reads `password` and `permissions` but does not encrypt the returned PDF.

---

### ROUTE-018

Route:
`app/api/pdf/rotate/route.ts`

Methods:

- `POST`

Request Inputs:

- Multipart form field `file`
- Multipart form field `rotation`, defaulting to 90
- Multipart form field `pages`, expected as `all` or a comma-separated list

Response Outputs:

- Success: rotated PDF binary with content-disposition header
- Missing file: JSON error, status 400
- Exception: JSON error, status 500

Auth:
No authentication or authorization check is present.

Validation:
Requires `file`. Parsed page indexes are filtered to the document range. Rotation values and missing/non-string `pages` are not explicitly validated.

Dependencies:

- External package: `pdf-lib`
- Database: none referenced
- External service: none referenced

Callers:
`components/PDFTools.tsx` selects `/api/pdf/rotate` and fetches the selected endpoint. `PDFTools` is rendered by `app/tools/page.tsx`.

Classification:
VERIFIED_ACTIVE

Evidence:

```ts
endpoint = '/api/pdf/rotate';
formData.append('rotation', '90');
formData.append('pages', 'all');
```

Notes:
Runtime PDF rotation was not executed during this audit.

---

### ROUTE-019

Route:
`app/api/pdf/split/route.ts`

Methods:

- `POST`

Request Inputs:

- Multipart form field `file`
- Multipart form field `pages`

Response Outputs:

- Success: selected-page PDF binary with content-disposition header
- Missing file: JSON error, status 400
- No valid pages: JSON error, status 400
- Exception: JSON error, status 500

Auth:
No authentication or authorization check is present.

Validation:

- Requires `file`
- Parses single pages and ranges
- Filters page indexes against the loaded document
- Requires at least one valid selected page
- No MIME type, extension, or file-size validation is present

Dependencies:

- External package: `pdf-lib`
- Database: none referenced
- External service: none referenced

Callers:
`components/PDFTools.tsx` selects `/api/pdf/split` and fetches the selected endpoint. `PDFTools` is rendered by `app/tools/page.tsx`.

Classification:
VERIFIED_ACTIVE

Evidence:

```ts
endpoint = '/api/pdf/split';
formData.append('pages', '1-3');
```

```ts
if (pageIndices.length === 0) {
  return NextResponse.json(
    { error: 'No valid pages specified' },
    { status: 400 }
  );
}
```

Notes:
Runtime PDF splitting was not executed during this audit.

---

### ROUTE-020

Route:
`app/api/pdf/to-image/route.ts`

Methods:

- `POST`

Request Inputs:

- Multipart form field `file`
- Multipart form field `format`, defaulting to `jpeg`
- Multipart form field `quality`, defaulting to 90

Response Outputs:

- Success: JSON containing page count, requested format and quality, and metadata entries for up to ten expected image filenames
- Missing file: JSON error, status 400
- Exception: JSON error, status 500

Auth:
No authentication or authorization check is present.

Validation:
Requires `file`. No MIME type, file-size, `format` allow-list, or `quality` range validation is present.

Dependencies:

- External packages: `pdf-lib`; `sharp` is imported
- Database: none referenced
- External service: none referenced

Callers:
`components/PDFTools.tsx` selects `/api/pdf/to-image` and fetches the selected endpoint. `PDFTools` is rendered by `app/tools/page.tsx`.

Classification:
STUB

Evidence:

```ts
// For demonstration, we'll return info about the conversion
// In production, you'd use pdf-to-img or similar library
```

```ts
message: 'PDF analysis complete. Image conversion requires additional libraries.',
```

Notes:
The route does not return image binaries. The imported `sharp` symbol is not used in the route.

---

### ROUTE-021

Route:
`app/api/playbook/route.ts`

Methods:

- `POST`

Request Inputs:
JSON body containing `analysis`.

Response Outputs:

- Success: JSON `{ success: true, playbook }`
- Missing analysis: JSON failure response, status 400
- Exception: JSON failure response, status 500

Auth:
No authentication or authorization check is present.

Validation:
Requires truthy `analysis`. The route then directly reads `analysis.metadata.fileName`, `analysis.riskScore`, `analysis.clauses`, and `analysis.redFlags` without runtime schema validation.

Dependencies:

- Internal: `generateNegotiationPlaybook`
- External service: NVIDIA NIM through `lib/negotiation-scripts.ts`
- Database: none referenced

Callers:
`components/AnalysisResult.tsx` calls this route from its playbook-generation handler. `AnalysisResult` is rendered by the analyze and shared-analysis flows.

Classification:
VERIFIED_ACTIVE

Evidence:

```ts
const response = await fetch('/api/playbook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ analysis }),
});
```

Notes:
Runtime success against NVIDIA NIM was not executed during this audit.

---

### ROUTE-022

Route:
`app/api/share/route.ts`

Methods:

- `POST`

Request Inputs:
JSON body containing `analysis`, optional `expiresInDays`, and optional `password`. The request `origin` header and `NEXT_PUBLIC_BASE_URL` may be used to construct the share URL.

Response Outputs:

- Success: JSON containing `success`, `shareId`, `shareUrl`, and `expiresInDays`
- Missing analysis: JSON error, status 400
- Exception: JSON error, status 500

Auth:
No authentication or authorization check is present.

Validation:
Requires truthy `analysis`. No runtime schema validation for `analysis`, expiry range validation, or password validation is present.

Dependencies:

- Internal: `createShareableLink`
- Database: none; `lib/share-links.ts` stores links in a module-level `Map`
- External service: none referenced

Callers:
`components/AnalysisResult.tsx` calls `POST /api/share`. `AnalysisResult` is rendered by the analyze and shared-analysis flows.

Classification:
VERIFIED_ACTIVE

Evidence:

```ts
const shareLinks = new Map<string, ShareableLink>();
```

```ts
const response = await fetch('/api/share', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    analysis,
    expiresInDays: shareExpiry,
    password: sharePassword || undefined,
  }),
});
```

Notes:
Persistence across process restarts is not provided by the evidenced `Map`.

---

### ROUTE-023

Route:
`app/api/share/[shareId]/route.ts`

Methods:

- `POST`

Request Inputs:

- Dynamic route parameter `shareId`
- JSON body field `password`

Response Outputs:

- Success: JSON `{ success: true, analysis }`
- Not found or expired: JSON failure response, status 404
- Invalid password: JSON failure response with `passwordRequired: true`, status 401
- Exception: JSON failure response, status 500

Auth:
No session or user authentication check is present. Access is controlled only by share ID and optional share password.

Validation:
No explicit format validation for `shareId` or `password` is present. Lookup behavior is delegated to `getSharedAnalysis`.

Dependencies:

- Internal: `getSharedAnalysis`
- Database: none; shared analyses are retrieved from the module-level `Map` in `lib/share-links.ts`
- External service: none referenced

Callers:
`app/share/[shareId]/page.tsx` dynamically calls `/api/share/${shareId}`.

Classification:
VERIFIED_ACTIVE

Evidence:

```ts
const response = await fetch(`/api/share/${shareId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: pwd }),
});
```

Notes:
Runtime retrieval after deployment or process restart was not executed during this audit.

---

### ROUTE-024

Route:
`app/api/templates/build/route.ts`

Methods:

- `POST`

Request Inputs:
JSON body containing `action`, `template`, and action-specific data.

Supported action inputs:

- `recommendations`: `contractType`, `industry`, `userRole`, `riskTolerance`
- `incompatibilities`: `clauseIds`
- `completeness`: `template`
- `compile`: `template`

Response Outputs:

- Success: action-specific JSON from `SmartTemplateBuilder`
- Unauthorized: JSON error, status 401
- Invalid action: JSON error, status 400
- Exception: JSON error, status 500

Auth:
Requires a truthy result from `auth()`.

Validation:
Validates only that `action` matches a supported switch case. No explicit validation of `template` or action-specific fields is present.

Dependencies:

- Internal: `SmartTemplateBuilder`
- Authentication: `auth` from `auth.ts`
- Database: none; `SmartTemplateBuilder` initializes an in-memory `Map` for its clause library
- External service: none referenced by the route or builder file

Callers:
No caller or endpoint string reference was found outside the route.

Classification:
UNREFERENCED

Evidence:

```ts
private clauseLibrary: Map<string, ClauseLibraryItem> = new Map();
```

```ts
const builder = new SmartTemplateBuilder();
```

Notes:
`components/SmartTemplateBuilder.tsx` imports and instantiates `SmartTemplateBuilder` directly; it does not call this route.

---

### ROUTE-025

Route:
`app/api/templates/clauses/route.ts`

Methods:

- `GET`

Request Inputs:
Query parameters:

- `category`
- `search`
- `industry`
- `riskLevel`
- `minRating`

Response Outputs:

- Search request: JSON clause search results
- Category request: JSON clauses in the category
- Missing both category and search: JSON error, status 400
- Exception: JSON error, status 500

Auth:
No authentication or authorization check is present.

Validation:

- Requires either truthy `search` or `category`
- Parses `minRating` with `parseFloat`
- Casts `category` and `riskLevel` without runtime allow-list validation in the route

Dependencies:

- Internal: `SmartTemplateBuilder`
- Database: none; clause data is held by the builder's in-memory `Map`
- External service: none referenced

Callers:
No caller or endpoint string reference was found outside the route.

Classification:
UNREFERENCED

Evidence:

```ts
if (search) {
  const clauses = builder.searchClauses(search, {
    industry: industry || undefined,
    riskLevel: riskLevel as any,
    minRating: minRating ? parseFloat(minRating) : undefined,
  });
  return NextResponse.json(clauses);
}
```

Notes:
`components/SmartTemplateBuilder.tsx` uses the builder directly and does not call this route.

---

## API Route Audit Classification Totals

- VERIFIED_ACTIVE: 13
- LIKELY_ACTIVE: 0
- UNREFERENCED: 10
- DUPLICATE: 0
- STUB: 2
- RUNTIME_VERIFICATION_REQUIRED: 0
- Total routes audited: 25

Verified active routes:

- `app/api/analyze/route.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `app/api/detect-clauses/route.ts`
- `app/api/drafting/route.ts`
- `app/api/negotiate/route.ts`
- `app/api/pdf/compress/route.ts`
- `app/api/pdf/from-image/route.ts`
- `app/api/pdf/info/route.ts`
- `app/api/pdf/merge/route.ts`
- `app/api/pdf/rotate/route.ts`
- `app/api/pdf/split/route.ts`
- `app/api/playbook/route.ts`
- `app/api/share/route.ts`
- `app/api/share/[shareId]/route.ts`

Correction:
The verified-active list contains 14 routes. The classification total is therefore:

- VERIFIED_ACTIVE: 14
- LIKELY_ACTIVE: 0
- UNREFERENCED: 9
- DUPLICATE: 0
- STUB: 2
- RUNTIME_VERIFICATION_REQUIRED: 0
- Total routes audited: 25

Unreferenced routes:

- `app/api/analyze-advanced/route.ts`
- `app/api/analytics/kpis/route.ts`
- `app/api/analytics/portfolio/route.ts`
- `app/api/analytics/savings/route.ts`
- `app/api/collaboration/sessions/route.ts`
- `app/api/lifecycle/workflows/route.ts`
- `app/api/negotiate-live/route.ts`
- `app/api/templates/build/route.ts`
- `app/api/templates/clauses/route.ts`

Stub routes:

- `app/api/pdf/protect/route.ts`
- `app/api/pdf/to-image/route.ts`

---

## Component Audit

Audit date:
2026-06-19

Audit scope:
All 45 `.tsx` files under `components/`.

Count definitions:

- Import Count: number of static import statements outside the component's own file that import the audited component file or exported component.
- Render Count: number of external JSX mount sites for the audited component. Internal JSX composition inside the same file is excluded.
- Pages Using: route pages or root layout files with a verified render path.
- Components Using: files under `components/` that import and render the audited component.

Global search results:

- Component dynamic imports: 0
- `React.lazy` component imports: 0
- `next/dynamic` component imports: 0
- Component barrel exports or re-exports: 0

### COMPONENT-001

File:
`components/AdvancedAnalyticsDashboard.tsx`

Export Type:
Default function export.

Component:
`AdvancedAnalyticsDashboard`

Classification:
UNUSED_COMPONENT

Import Count:
0

Render Count:
0

Pages Using:
None found.

Components Using:
None found.

Dynamic Imports:
None found.

Barrel Exports:
None found.

Conditional Rendering Paths:
No external render path found.

Evidence:

```ts
export default function AdvancedAnalyticsDashboard() {
```

Repository search found no import or JSX mount outside this file.

Notes:
The file contains the explicit comment `Simulated data - replace with actual API call` and a `mockData` object. Duplicate status is not established by static usage evidence.

---

### COMPONENT-002

File:
`components/AIContractDrafter.tsx`

Export Type:
Default function export.

Component:
`AIContractDrafterComponent`, imported as `AIContractDrafter`.

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/drafting/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `DraftingPage`. Internal content switches between `input`, `drafting`, and `result` states.

Evidence:

```ts
import AIContractDrafter from '@/components/AIContractDrafter';
```

```tsx
return <AIContractDrafter />;
```

Notes:
The component calls `POST /api/drafting`. Its variation handler contains an explicit placeholder comment, but the component itself has a verified page render path.

---

### COMPONENT-003

File:
`components/AIContractNegotiationAssistant.tsx`

Export Type:
Default function export.

Component:
`AINegotiationAssistant`, imported as `AIContractNegotiationAssistant`.

Classification:
DEMO_COMPONENT

Import Count:
1

Render Count:
1

Pages Using:
`app/negotiate/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `NegotiatePage`. Internal views depend on selected session, clause, and interaction state.

Evidence:

```tsx
return <AIContractNegotiationAssistant />;
```

```ts
// Demo data for visualization
const demoSession: NegotiationSession = {
  id: 'demo-session',
```

```ts
setSession(demoSession);
setSelectedClause(demoSession.clauses[0]);
```

Notes:
The demo classification is based on the component's own explicit `Demo data for visualization` declaration.

---

### COMPONENT-004

File:
`components/AnalysisResult.tsx`

Export Type:
Default function export.

Component:
`AnalysisResult`

Classification:
VERIFIED_IN_USE

Import Count:
2

Render Count:
2

Pages Using:

- `app/analyze/page.tsx`, through `app/analyze/AnalyzePageClient.tsx`
- `app/share/[shareId]/page.tsx`

Components Using:
None under `components/`.

Dynamic Imports:
The component dynamically imports library modules `@/lib/enhanced-export` and `@/lib/version-compare`; it is not itself dynamically imported.

Barrel Exports:
None.

Conditional Rendering Paths:

- In `AnalyzePageClient`, mounted only when `analysis` is truthy.
- In the shared-analysis page, mounted only after loading completes and `analysis` is non-null.

Evidence:

```tsx
{analysis && <AnalysisResult analysis={analysis} />}
```

```tsx
if (!analysis) return null;
```

```tsx
<AnalysisResult analysis={analysis} />
```

Notes:
Verified callers include negotiation, playbook, share, and re-analysis actions inside this component.

---

### COMPONENT-005

File:
`components/AnalyticsDashboard.tsx`

Export Type:
Default function export.

Component:
`AnalyticsDashboard`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/analytics/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `AnalyticsPage`.

Evidence:

```ts
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
```

```tsx
return <AnalyticsDashboard />;
```

Notes:
The displayed analytics values are declared as local arrays in the component. No duplicate classification is established.

---

### COMPONENT-006

File:
`components/AnimatedStats.tsx`

Export Type:
No exports.

Component:
UNKNOWN

Classification:
STUB_COMPONENT

Import Count:
0

Render Count:
0

Pages Using:
None found.

Components Using:
None found.

Dynamic Imports:
None found.

Barrel Exports:
None found.

Conditional Rendering Paths:
None.

Evidence:

```text
File size: 0 bytes
Line count: 0
```

Notes:
The file is empty.

---

### COMPONENT-007

File:
`components/BlockchainVerification.tsx`

Export Type:
Default function export.

Component:
`BlockchainVerification`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/blockchain/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `BlockchainPage`.

Evidence:

```tsx
return <BlockchainVerification />;
```

Notes:
No alternative render path was found.

---

### COMPONENT-008

File:
`components/BookingForm.tsx`

Export Type:
Default function export.

Component:
`BookingForm`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/book/[lawyerId]/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted only when `lawyers.find(...)` returns a lawyer; otherwise the page calls `notFound()`.

Evidence:

```ts
const lawyer = lawyers.find(l => l.id === params.lawyerId);

if (!lawyer) {
  notFound();
}

return <BookingForm lawyer={lawyer} />;
```

Notes:
The component receives the selected lawyer as a prop.

---

### COMPONENT-009

File:
`components/BusinessIntelligenceDashboard.tsx`

Export Type:
Default function export.

Component:
`BusinessIntelligenceDashboard`

Classification:
UNUSED_COMPONENT

Import Count:
0

Render Count:
0

Pages Using:
None found.

Components Using:
None found.

Dynamic Imports:
None found.

Barrel Exports:
None found.

Conditional Rendering Paths:
No external render path found.

Evidence:

```ts
export default function BusinessIntelligenceDashboard() {
```

```ts
// In production, fetch actual contract data
const mockContracts = generateMockContracts();
```

Repository search found no import or JSX mount outside this file.

Notes:
The component directly instantiates `BusinessIntelligenceEngine`. Duplicate status is not established.

---

### COMPONENT-010

File:
`components/ClauseCard.tsx`

Export Type:
Default function export.

Component:
`ClauseCard`

Classification:
UNUSED_COMPONENT

Import Count:
0

Render Count:
0

Pages Using:
None found.

Components Using:
None found.

Dynamic Imports:
None found.

Barrel Exports:
None found.

Conditional Rendering Paths:
No external render path found.

Evidence:

```ts
export default function ClauseCard({
```

Repository search found no `ClauseCard` import or external JSX mount.

Notes:
`AnalysisResult.tsx` renders clause UI internally but does not import `ClauseCard`.

---

### COMPONENT-011

File:
`components/CompareVersions.tsx`

Export Type:
Default function export.

Component:
`CompareVersions`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/compare/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally inside the compare page wrapper.

Evidence:

```tsx
<CompareVersions />
```

Notes:
No use of `VersionComparisonViewer` was found in this component.

---

### COMPONENT-012

File:
`components/ComplianceMonitoring.tsx`

Export Type:
Default function export.

Component:
`ComplianceMonitoring`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/compliance/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `CompliancePage`.

Evidence:

```tsx
return <ComplianceMonitoring />;
```

Notes:
No alternate component implementation was linked from the compliance page.

---

### COMPONENT-013

File:
`components/ContractAutomation.tsx`

Export Type:
Default function export.

Component:
`ContractAutomation`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/automation/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `AutomationPage`.

Evidence:

```tsx
return <ContractAutomation />;
```

Notes:
No component-level caller other than the route page was found.

---

### COMPONENT-014

File:
`components/ContractChat.tsx`

Export Type:
Default function export.

Component:
`ContractChat`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/chat/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally inside the chat page container.

Evidence:

```tsx
<ContractChat />
```

Notes:
No second `ContractChat` mount was found.

---

### COMPONENT-015

File:
`components/ContractIntelligenceSearch.tsx`

Export Type:
Default function export.

Component:
`ContractIntelligenceSearch`

Classification:
DEMO_COMPONENT

Import Count:
1

Render Count:
1

Pages Using:
`app/search/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `SearchPage`. Internal results depend on search state.

Evidence:

```tsx
return <ContractIntelligenceSearch />;
```

```ts
// Demo data
```

Notes:
The demo classification is based on the component's explicit `Demo data` declaration.

---

### COMPONENT-016

File:
`components/ContractRepository.tsx`

Export Type:
Default function export.

Component:
`ContractRepository`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/contracts/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `ContractsPage`.

Evidence:

```tsx
return <ContractRepository />;
```

Notes:
No component composition caller was found.

---

### COMPONENT-017

File:
`components/DocumentIntelligence.tsx`

Export Type:
Default function export.

Component:
`DocumentIntelligence`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/intelligence/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `IntelligencePage`.

Evidence:

```tsx
return <DocumentIntelligence />;
```

Notes:
This route-level feature is distinct from the `/analyze` page by file and route path. Functional equivalence is not established.

---

### COMPONENT-018

File:
`components/ErrorBoundary.tsx`

Export Type:
Named class export.

Component:
`ErrorBoundary`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/layout.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted for the full application tree inside `ToastProvider`. Its fallback UI is conditional on the class error state.

Evidence:

```tsx
<ErrorBoundary>
  <Navbar />
  {children}
  <Footer />
</ErrorBoundary>
```

Notes:
The source includes a TODO for external error reporting, but the boundary has a verified root-layout render path.

---

### COMPONENT-019

File:
`components/ESignature.tsx`

Export Type:
Default function export.

Component:
`ESignature`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/esignature/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `ESignaturePage`. Internal screens depend on component state.

Evidence:

```tsx
return <ESignature />;
```

Notes:
No alternate e-signature component import was found.

---

### COMPONENT-020

File:
`components/FileUpload.tsx`

Export Type:
Default function export.

Component:
`FileUpload`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/analyze/page.tsx`, through `app/analyze/AnalyzePageClient.tsx`

Components Using:
None under `components/`.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted only when `!analysis && !isAnalyzing`.

Evidence:

```tsx
{!analysis && !isAnalyzing && (
```

```tsx
<FileUpload onFileSelect={handleFileSelect} isAnalyzing={false} />
```

Notes:
The component's callback initiates the `/api/analyze` request in its parent.

---

### COMPONENT-021

File:
`components/Footer.tsx`

Export Type:
Default function export.

Component:
`Footer`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/layout.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally after `{children}` in the root layout's `ErrorBoundary`.

Evidence:

```tsx
{children}
<Footer />
```

Notes:
The root layout applies this render path to application routes.

---

### COMPONENT-022

File:
`components/JsonLd.tsx`

Export Type:
Named function exports.

Component:
`JsonLd`

Classification:
VERIFIED_IN_USE

Import Count:
9 import statements across 8 files.

Render Count:
11

Pages Using:

- `app/layout.tsx`
- `app/page.tsx`
- `app/analyze/page.tsx`
- `app/benchmark/page.tsx`
- `app/clauses/page.tsx`
- `app/multi-language/page.tsx`
- `app/obligations/page.tsx`
- `app/risk/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
All 11 located JSX mounts are unconditional within their page or layout output.

Evidence:

```tsx
<JsonLd data={websiteSchema()} />
<JsonLd data={organizationSchema()} />
<JsonLd data={softwareApplicationSchema()} />
```

```tsx
<JsonLd data={homepageFaqSchema()} />
```

Notes:
`app/risk/page.tsx` uses two separate import statements from this component file, producing 9 import statements across 8 consuming files.

---

### COMPONENT-023

File:
`components/LawyerMarketplace.tsx`

Export Type:
Default function export.

Component:
`LawyerMarketplace`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/lawyers/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `LawyersPage`. Filters and view layout are conditional on local state.

Evidence:

```tsx
return <LawyerMarketplace />;
```

Notes:
The component reads shared lawyer data from `lib/lawyers-data.ts`.

---

### COMPONENT-024

File:
`components/LawyerProfile.tsx`

Export Type:
Default function export.

Component:
`LawyerProfile`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/lawyers/[id]/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted only when the dynamic route ID resolves to a lawyer; otherwise `notFound()` is called.

Evidence:

```tsx
return <LawyerProfile lawyer={lawyer} />;
```

Notes:
The component links to the booking route rather than rendering `BookingForm` directly.

---

### COMPONENT-025

File:
`components/LawyerRegistration.tsx`

Export Type:
Default function export.

Component:
`LawyerRegistration`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/lawyers/register/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `RegisterPage`. Internal form steps are conditional on component state.

Evidence:

```tsx
return <LawyerRegistration />;
```

```ts
// TODO: Send formData to backend API endpoint
```

Notes:
The component is route-mounted. Backend submission is explicitly marked TODO in the component source.

---

### COMPONENT-026

File:
`components/LegalLibrary.tsx`

Export Type:
Default function export.

Component:
`LegalLibrary`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/library/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally inside the library page wrapper.

Evidence:

```tsx
<LegalLibrary />
```

Notes:
No second legal-library implementation was imported by the route.

---

### COMPONENT-027

File:
`components/Loading.tsx`

Export Type:

- Named function exports: `Loading`, `ContractCardSkeleton`, `TableRowSkeleton`, `StatsCardSkeleton`, `ListItemSkeleton`, `ChartSkeleton`
- Default export: `Loading`

Component:
`Loading` and five skeleton helper components.

Classification:
UNUSED_COMPONENT

Import Count:
0

Render Count:
0

Pages Using:
None found.

Components Using:
None found.

Dynamic Imports:
None found.

Barrel Exports:
None found.

Conditional Rendering Paths:
No external render path found for any exported component.

Evidence:
Repository search found no imports from `components/Loading` and no external mounts of its exported component names.

Notes:
`components/Skeleton.tsx` separately defines other skeleton components, but duplicate equivalence is not established.

---

### COMPONENT-028

File:
`components/MarketIntelligenceDashboard.tsx`

Export Type:
Default function export.

Component:
`MarketIntelligenceDashboard`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/market-intelligence/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `MarketIntelligencePage`.

Evidence:

```tsx
return <MarketIntelligenceDashboard />;
```

Notes:
The component declares local `marketTrends`, `pricingBenchmarks`, `emergingClauses`, and `competitors` arrays.

---

### COMPONENT-029

File:
`components/Navbar.tsx`

Export Type:
Default function export.

Component:
`Navbar`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/layout.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally in the root layout. Internal desktop, mobile, authentication, and menu branches depend on viewport and state.

Evidence:

```tsx
<ErrorBoundary>
  <Navbar />
  {children}
  <Footer />
</ErrorBoundary>
```

Notes:
The component imports Clerk client components.

---

### COMPONENT-030

File:
`components/NotificationsCenter.tsx`

Export Type:
Default function export.

Component:
`NotificationsCenter`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/notifications/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `NotificationsPage`.

Evidence:

```tsx
return <NotificationsCenter />;
```

Notes:
No alternative notification component import was found.

---

### COMPONENT-031

File:
`components/PDFTools.tsx`

Export Type:
Default function export.

Component:
`PDFTools`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/tools/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `ToolsPage`. Individual tool forms and result states depend on `selectedTool`, `processing`, `error`, and `result`.

Evidence:

```tsx
return <PDFTools />;
```

Notes:
The component selects and calls multiple `/api/pdf/*` endpoints.

---

### COMPONENT-032

File:
`components/Playbooks.tsx`

Export Type:
Default function export.

Component:
`Playbooks`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/playbooks/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally inside the playbooks page wrapper. Internal playbook details depend on local selection state.

Evidence:

```tsx
<Playbooks />
```

Notes:
This is separate from the playbook action embedded in `AnalysisResult.tsx` by route and component path. Duplicate equivalence is not established.

---

### COMPONENT-033

File:
`components/PredictiveAnalyticsDashboard.tsx`

Export Type:
Default function export.

Component:
`PredictiveAnalyticsDashboard`

Classification:
UNUSED_COMPONENT

Import Count:
0

Render Count:
0

Pages Using:
None found.

Components Using:
None found.

Dynamic Imports:
None found.

Barrel Exports:
None found.

Conditional Rendering Paths:
No external render path found.

Evidence:

```ts
// Mock data - in production, fetch from API
```

Repository search found no import or JSX mount outside this file.

Notes:
The component imports `AdvancedAnalytics` from `lib/predictive-analytics.ts`. Duplicate status is not established.

---

### COMPONENT-034

File:
`components/ProgressStepper.tsx`

Export Type:
Default function export.

Component:
`ProgressStepper`

Classification:
UNUSED_COMPONENT

Import Count:
0

Render Count:
0

Pages Using:
None found.

Components Using:
None found.

Dynamic Imports:
None found.

Barrel Exports:
None found.

Conditional Rendering Paths:
No external render path found.

Evidence:

```ts
export default function ProgressStepper({ currentStep = 0, isComplete = false }: ProgressStepperProps) {
```

```ts
// Auto-advance animation for demo purposes
```

Notes:
No caller supplies `currentStep` or `isComplete`.

---

### COMPONENT-035

File:
`components/RenewalCalendar.tsx`

Export Type:
Default function export.

Component:
`RenewalCalendar`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/renewals/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `RenewalsPage`.

Evidence:

```tsx
return <RenewalCalendar />;
```

Notes:
No second renewal component was mounted by the route.

---

### COMPONENT-036

File:
`components/RiskGauge.tsx`

Export Type:
Default function export.

Component:
`RiskGauge`

Classification:
UNUSED_COMPONENT

Import Count:
0

Render Count:
0

Pages Using:
None found.

Components Using:
None found.

Dynamic Imports:
None found.

Barrel Exports:
None found.

Conditional Rendering Paths:
No external render path found.

Evidence:

```ts
export default function RiskGauge({
```

Repository search found no `RiskGauge` import or external JSX mount.

Notes:
Risk values are rendered elsewhere in the repository without importing this component.

---

### COMPONENT-037

File:
`components/Skeleton.tsx`

Export Type:
Named function exports: `Skeleton`, `CardSkeleton`, `LawyerCardSkeleton`, `TableRowSkeleton`, and `AnalysisResultSkeleton`.

Component:
Five skeleton components.

Classification:
UNUSED_COMPONENT

Import Count:
0

Render Count:
0 external mounts.

Pages Using:
None found.

Components Using:
None found outside this file.

Dynamic Imports:
None found.

Barrel Exports:
None found.

Conditional Rendering Paths:
No external render path found. `CardSkeleton`, `LawyerCardSkeleton`, `TableRowSkeleton`, and `AnalysisResultSkeleton` render `Skeleton` internally, but none of the exported parent skeletons has an external caller.

Evidence:
Repository search found no imports from `components/Skeleton`.

Notes:
Internal `<Skeleton>` composition does not create a route-level render path.

---

### COMPONENT-038

File:
`components/SmartTemplateBuilder.tsx`

Export Type:
Default function export.

Component:
`SmartTemplateBuilderComponent`, imported as `SmartTemplateBuilder`.

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/template-builder/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `TemplateBuildPage`. Builder panes and dialogs depend on local state.

Evidence:

```tsx
return <SmartTemplateBuilder />;
```

Notes:
The component instantiates the library class `SmartTemplateBuilder` directly.

---

### COMPONENT-039

File:
`components/TeamCollaboration.tsx`

Export Type:
Default function export.

Component:
`TeamCollaboration`

Classification:
DEMO_COMPONENT

Import Count:
1

Render Count:
1

Pages Using:
`app/team/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `TeamPage`. Comments, approvals, team lists, and invite modal are conditional on tabs and local state.

Evidence:

```tsx
return <TeamCollaboration />;
```

```ts
const mockTeam: TeamMember[] = [
```

```ts
const mockComments: Comment[] = [
```

```ts
const mockApprovals: ApprovalRequest[] = [
```

```ts
// Would send comment to backend
```

Notes:
The demo classification is based on the component's named mock datasets and explicit backend placeholder comment.

---

### COMPONENT-040

File:
`components/TemplateCustomizationWizard.tsx`

Export Type:
Default function export.

Component:
`TemplateCustomizationWizard`

Classification:
INDIRECTLY_USED

Import Count:
1

Render Count:
1

Pages Using:
`app/templates/page.tsx`, through `TemplatesLibrary`.

Components Using:
`components/TemplatesLibrary.tsx`

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted only when `customizingTemplate` is truthy inside `TemplatesLibrary`.

Evidence:

```ts
import TemplateCustomizationWizard from './TemplateCustomizationWizard';
```

```tsx
{customizingTemplate && (
  <TemplateCustomizationWizard
    template={customizingTemplate}
    onClose={() => setCustomizingTemplate(null)}
  />
)}
```

Notes:
This is the only verified component-to-component import and render path in the audited directory.

---

### COMPONENT-041

File:
`components/TemplatesEnhanced.tsx`

Export Type:
Default function export.

Component:
`TemplatesEnhanced`

Classification:
UNUSED_COMPONENT

Import Count:
0

Render Count:
0

Pages Using:
None found.

Components Using:
None found.

Dynamic Imports:
None found.

Barrel Exports:
None found.

Conditional Rendering Paths:
No external render path found.

Evidence:
Repository search found no `TemplatesEnhanced` import or JSX mount.

The similarly named route does not import the component:

```ts
export default function TemplatesEnhancedPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/templates');
  }, [router]);
```

Notes:
`app/templates-enhanced/page.tsx` redirects to `/templates`.

---

### COMPONENT-042

File:
`components/TemplatesLibrary.tsx`

Export Type:
Default function export.

Component:
`TemplatesLibrary`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/templates/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally inside the templates page wrapper. It conditionally mounts `TemplateCustomizationWizard`.

Evidence:

```tsx
<TemplatesLibrary />
```

Notes:
The component imports template data from `lib/templates-data.ts`.

---

### COMPONENT-043

File:
`components/ToastProvider.tsx`

Export Type:
Named function exports: `useToast` and `ToastProvider`.

Component:
`ToastProvider`

Classification:
VERIFIED_IN_USE

Import Count:
1

Render Count:
1

Pages Using:
`app/layout.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
`ToastProvider` is mounted unconditionally inside `ClerkProvider`. Individual toast items depend on provider state. No external call to exported `useToast()` was found.

Evidence:

```tsx
<ClerkProvider>
  <ToastProvider>
```

Notes:
The provider has a verified root-layout mount even though the exported hook has no located external caller.

---

### COMPONENT-044

File:
`components/UserDashboard.tsx`

Export Type:
Default function export.

Component:
`UserDashboard`

Classification:
DEMO_COMPONENT

Import Count:
1

Render Count:
1

Pages Using:
`app/dashboard/page.tsx`

Components Using:
None.

Dynamic Imports:
None.

Barrel Exports:
None.

Conditional Rendering Paths:
Mounted unconditionally by `DashboardPage`. Internal cards and lists depend on local state.

Evidence:

```tsx
return <UserDashboard />;
```

```ts
// Sample data for demonstration
```

Notes:
The demo classification is based on the component's explicit sample-data declaration.

---

### COMPONENT-045

File:
`components/VersionComparisonViewer.tsx`

Export Type:
Default function export.

Component:
`VersionComparisonViewer`

Classification:
UNUSED_COMPONENT

Import Count:
0

Render Count:
0

Pages Using:
None found.

Components Using:
None found.

Dynamic Imports:
None found.

Barrel Exports:
None found.

Conditional Rendering Paths:
No external render path found.

Evidence:

```ts
export default function VersionComparisonViewer({ versions, contractId }: VersionComparisonViewerProps) {
```

Repository search found no import or external JSX mount.

Notes:
`app/compare/page.tsx` renders `CompareVersions`, not `VersionComparisonViewer`.

---

## Component Audit Classification Totals

- VERIFIED_IN_USE: 31
- INDIRECTLY_USED: 1
- UNUSED_COMPONENT: 8
- DUPLICATE_COMPONENT: 0
- STUB_COMPONENT: 1
- DEMO_COMPONENT: 4
- RUNTIME_VERIFICATION_REQUIRED: 0
- Total component files audited: 45

Unused components:

- `components/AdvancedAnalyticsDashboard.tsx`
- `components/BusinessIntelligenceDashboard.tsx`
- `components/ClauseCard.tsx`
- `components/Loading.tsx`
- `components/PredictiveAnalyticsDashboard.tsx`
- `components/ProgressStepper.tsx`
- `components/RiskGauge.tsx`
- `components/Skeleton.tsx`
- `components/TemplatesEnhanced.tsx`
- `components/VersionComparisonViewer.tsx`

Correction:
The unused-component list contains 10 files. The classification totals are therefore:

- VERIFIED_IN_USE: 29
- INDIRECTLY_USED: 1
- UNUSED_COMPONENT: 10
- DUPLICATE_COMPONENT: 0
- STUB_COMPONENT: 1
- DEMO_COMPONENT: 4
- RUNTIME_VERIFICATION_REQUIRED: 0
- Total component files audited: 45

Stub components:

- `components/AnimatedStats.tsx`

Demo components:

- `components/AIContractNegotiationAssistant.tsx`
- `components/ContractIntelligenceSearch.tsx`
- `components/TeamCollaboration.tsx`
- `components/UserDashboard.tsx`

---

## Component System Overlap Analysis

### Multiple Dashboards

Files examined:

- `components/AnalyticsDashboard.tsx`
- `components/AdvancedAnalyticsDashboard.tsx`
- `components/BusinessIntelligenceDashboard.tsx`
- `components/MarketIntelligenceDashboard.tsx`
- `components/PredictiveAnalyticsDashboard.tsx`

Verified route usage:

- `AnalyticsDashboard` is mounted by `app/analytics/page.tsx`.
- `MarketIntelligenceDashboard` is mounted by `app/market-intelligence/page.tsx`.
- `AdvancedAnalyticsDashboard`, `BusinessIntelligenceDashboard`, and `PredictiveAnalyticsDashboard` have no import or render path.

Verified implementation differences:

- `AnalyticsDashboard` declares local portfolio metric arrays.
- `AdvancedAnalyticsDashboard` declares `mockData` and labels it simulated data.
- `BusinessIntelligenceDashboard` calls `BusinessIntelligenceEngine` with `generateMockContracts()`.
- `MarketIntelligenceDashboard` declares market-trend, pricing-benchmark, emerging-clause, and competitor arrays.
- `PredictiveAnalyticsDashboard` calls `AdvancedAnalytics` methods with values explicitly labeled mock data.

Determination:
Two dashboards are separate route-mounted features by route and component path. Three are unused implementations. `DUPLICATE_COMPONENT` is not established because equivalent inputs, outputs, and render purpose were not proven.

### Multiple Template Systems

Files examined:

- `components/TemplatesLibrary.tsx`
- `components/TemplateCustomizationWizard.tsx`
- `components/SmartTemplateBuilder.tsx`
- `components/TemplatesEnhanced.tsx`

Verified route usage:

- `/templates` mounts `TemplatesLibrary`.
- `TemplatesLibrary` conditionally mounts `TemplateCustomizationWizard`.
- `/template-builder` mounts `SmartTemplateBuilder`.
- `TemplatesEnhanced` has no caller.
- `/templates-enhanced` redirects to `/templates` and does not import `TemplatesEnhanced`.

Determination:
The library/customization flow and smart-builder flow are separate features by route and composition evidence. `TemplatesEnhanced` is an unused implementation. Duplicate equivalence is not established.

### Multiple Contract Analysis Systems

Files examined:

- `components/FileUpload.tsx`
- `components/AnalysisResult.tsx`
- `components/DocumentIntelligence.tsx`
- `components/CompareVersions.tsx`
- `components/ClauseCard.tsx`
- `components/RiskGauge.tsx`
- `components/VersionComparisonViewer.tsx`

Verified route usage:

- `/analyze` conditionally mounts `FileUpload` and `AnalysisResult`.
- `/intelligence` mounts `DocumentIntelligence`.
- `/compare` mounts `CompareVersions`.
- `ClauseCard`, `RiskGauge`, and `VersionComparisonViewer` have no callers.

Determination:
Three route-mounted analysis-related flows have distinct route paths and mounted components. Three component implementations are unused. Duplicate equivalence is not established.

### Multiple Negotiation Systems

Files examined:

- `components/AIContractNegotiationAssistant.tsx`
- `components/AnalysisResult.tsx`
- `components/Playbooks.tsx`

Verified route and action usage:

- `/negotiate` mounts `AIContractNegotiationAssistant`, which explicitly loads a demo session.
- `AnalysisResult` calls `/api/negotiate` and `/api/playbook` from contract-analysis actions.
- `/playbooks` mounts `Playbooks`.

Determination:
The standalone negotiation page, analysis-result actions, and playbooks page are separate render and route paths. Duplicate equivalence is not established.

### Multiple Lawyer Marketplace Systems

Files examined:

- `components/LawyerMarketplace.tsx`
- `components/LawyerProfile.tsx`
- `components/LawyerRegistration.tsx`
- `components/BookingForm.tsx`

Verified route usage:

- `/lawyers` mounts `LawyerMarketplace`.
- `/lawyers/[id]` mounts `LawyerProfile` when a lawyer is found.
- `/lawyers/register` mounts `LawyerRegistration`.
- `/book/[lawyerId]` mounts `BookingForm` when a lawyer is found.

Determination:
The components implement listing, profile, registration, and booking route roles respectively. No duplicate component evidence was found.

### Multiple Collaboration Systems

Files examined:

- `components/TeamCollaboration.tsx`
- `components/ContractChat.tsx`
- `components/VersionComparisonViewer.tsx`

Verified route usage:

- `/team` mounts `TeamCollaboration`, which uses `mockTeam`, `mockComments`, and `mockApprovals`.
- `/chat` mounts `ContractChat`.
- `VersionComparisonViewer` has no caller.

Determination:
Team collaboration and contract chat are separate route-mounted features. `VersionComparisonViewer` is unused. Duplicate equivalence is not established.
