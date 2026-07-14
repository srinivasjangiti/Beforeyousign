# Implementation Plan

## Phase 1: Work Items

### FINDING-001: Mock Authentication Database
* **Priority:** P0
* **Impact:** Critical - no persistent user storage; in-memory users lost on restart.
* **Estimated effort:** Medium
* **Risk level:** High (core auth persistence layer change)
* **Files affected:** `auth.ts`
* **Dependencies:** PostgreSQL, Prisma Schema

### FINDING-002: Contract Analysis Truncation
* **Priority:** P0
* **Impact:** Critical - limits analysis of large contracts, leading to systematically partial risk analysis results.
* **Estimated effort:** Medium
* **Risk level:** Medium (requires handling AI provider context window limits)
* **Files affected:** `app/api/analyze/route.ts`
* **Dependencies:** AI provider models (NVIDIA/Gemini/OpenAI)

### FINDING-003: Weak AI Output Validation
* **Priority:** P1
* **Impact:** Moderate - malformed data can reach the UI since there is no runtime domain-schema validation.
* **Estimated effort:** Low/Medium
* **Risk level:** Low
* **Files affected:** `app/api/analyze/route.ts`
* **Dependencies:** None

### FINDING-004: Dual Authentication Systems
* **Priority:** P1
* **Impact:** Moderate - ambiguous architecture and increased maintenance risk from competing dependencies.
* **Estimated effort:** Low
* **Risk level:** Low
* **Files affected:** `package.json`, `next.config.ts`
* **Dependencies:** None

### FINDING-005: Parser Memory Pressure Risk
* **Priority:** P2
* **Impact:** Low/Moderate - potential memory exhaustion during concurrent or large uploads.
* **Estimated effort:** Medium
* **Risk level:** Medium (requires refactoring file processing)
* **Files affected:** `lib/document-parser.ts`
* **Dependencies:** Node.js streams

### High Confidence Delete Candidates (from Audit Handoff)
* **Priority:** P2
* **Impact:** Architectural bloat; dead code maintainability tax.
* **Estimated effort:** Low
* **Risk level:** Low
* **Files affected:** 10 unused components, 9 unreferenced APIs, 3 stubs
* **Dependencies:** None

---

## Phase 2: Implementation Order

**P0 First:**
1. Fix FINDING-001 (Mock Authentication Database)
2. Fix FINDING-002 (Contract Analysis Truncation)

**P1 Second:**
3. Fix FINDING-004 (Dual Authentication Systems)
4. Fix FINDING-003 (Weak AI Output Validation)

**P2 Third:**
5. Fix FINDING-005 (Parser Memory Pressure Risk)
6. Execute Dead Code & Stubs Deletion

---

## Phase 3: Task Breakdown

### TASK-001
**Related Finding:** FINDING-001
**Goal:** Replace in-memory auth storage with Prisma/PostgreSQL NextAuth adapter.
**Files:** `auth.ts`
**Validation:** Restart application, perform signup and login, and verify user session and data persist in the PostgreSQL database.
**Rollback:** Revert `auth.ts` to the in-memory Map implementation.

### TASK-002
**Related Finding:** FINDING-002
**Goal:** Remove character limit truncation and properly handle token limits for large contracts.
**Files:** `app/api/analyze/route.ts`
**Validation:** Upload a contract significantly exceeding the 6,000-character limit and verify the analysis spans the complete document.
**Rollback:** Restore the ternary string slice operator for `maxPromptChars`.

### TASK-003
**Related Finding:** FINDING-004
**Goal:** Clean up dual authentication remnants by removing Clerk from configurations.
**Files:** `package.json`, `next.config.ts`
**Validation:** Run project build to ensure no dependency errors occur, and ensure NextAuth remains fully functional.
**Rollback:** Revert changes in `package.json` and `next.config.ts`.

### TASK-004
**Related Finding:** FINDING-003
**Goal:** Implement runtime domain-schema validation for parsed AI output.
**Files:** `app/api/analyze/route.ts`
**Validation:** Mock malformed AI responses and verify the API cleanly handles the validation failure before passing to formatting logic.
**Rollback:** Revert to the `Record<string, unknown>` type cast.

### TASK-005
**Related Finding:** FINDING-005
**Goal:** Mitigate parser memory pressure by refactoring to use streams or chunking instead of full buffer conversion.
**Files:** `lib/document-parser.ts`
**Validation:** Upload large documents (>10MB) concurrently and monitor process memory utilization to confirm spikes are reduced.
**Rollback:** Restore the `ArrayBuffer` to `Buffer` conversion logic.

### TASK-006
**Related Finding:** High Confidence Delete Candidates
**Goal:** Delete unused files, orphaned routes, and stubs identified in the audit.
**Files:** 
- `components/` (11 unused/stub files)
- `app/api/` (11 unreferenced/stub routes)
**Validation:** Run a full project build to ensure no unresolved imports exist.
**Rollback:** Restore deleted files from version control.

---

## Phase 4: Implementation Batches

**Batch 1: Highest impact, lowest risk**
- TASK-003 (Clean up Clerk remnants)
- TASK-004 (Implement AI output schema validation)
- TASK-006 (Delete high confidence dead code and stubs)

**Batch 2: Core platform stability**
- TASK-001 (Replace in-memory auth with Prisma adapter)
- TASK-002 (Fix contract truncation logic)

**Batch 3: Architecture cleanup**
- TASK-005 (Refactor document parser for memory efficiency)
