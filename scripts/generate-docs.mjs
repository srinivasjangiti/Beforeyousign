/**
 * generate-docs.mjs
 * Run with: node scripts/generate-docs.mjs
 * Generates BeforeYouSign_Documentation.docx explaining the entire codebase.
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  PageBreak,
  NumberFormat,
} from 'docx';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, '..', 'BeforeYouSign_Documentation.docx');

// ─── Palette helpers ────────────────────────────────────────────────────────
const STONE_900 = '1c1917';   // near-black
const STONE_600 = '57534e';   // medium grey
const STONE_200 = 'e7e5e4';   // light grey
const WHITE     = 'ffffff';
const AMBER     = 'b45309';    // accent

// ─── Style helpers ──────────────────────────────────────────────────────────
const h1 = (text) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 160 },
    border: { bottom: { color: STONE_900, size: 8, style: BorderStyle.SINGLE } },
  });

const h2 = (text) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 120 },
  });

const h3 = (text) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 80 },
  });

const para = (text, { bold = false, color = STONE_600, size = 22 } = {}) =>
  new Paragraph({
    children: [
      new TextRun({ text, bold, color, size, font: 'Calibri' }),
    ],
    spacing: { before: 80, after: 80 },
  });

const bullet = (text, level = 0) =>
  new Paragraph({
    bullet: { level },
    children: [new TextRun({ text, color: STONE_600, size: 22, font: 'Calibri' })],
    spacing: { before: 40, after: 40 },
  });

const code = (text) =>
  new Paragraph({
    children: [
      new TextRun({
        text,
        font: 'Courier New',
        size: 20,
        color: '1a1a1a',
        highlight: 'yellow',
      }),
    ],
    spacing: { before: 60, after: 60 },
    shading: { type: ShadingType.SOLID, color: 'F5F5F5', fill: 'F5F5F5' },
  });

const keyVal = (key, val) =>
  new Paragraph({
    children: [
      new TextRun({ text: `${key}: `, bold: true, color: STONE_900, size: 22, font: 'Calibri' }),
      new TextRun({ text: val, color: STONE_600, size: 22, font: 'Calibri' }),
    ],
    spacing: { before: 60, after: 60 },
  });

const divider = () =>
  new Paragraph({
    border: { bottom: { color: STONE_200, size: 4, style: BorderStyle.SINGLE } },
    spacing: { before: 200, after: 200 },
  });

const pageBreak = () =>
  new Paragraph({ children: [new PageBreak()] });

// ─── Table helper ─────────────────────────────────────────────────────────
function makeTable(headers, rows) {
  const headerRow = new TableRow({
    children: headers.map(h =>
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: h, bold: true, color: WHITE, size: 20, font: 'Calibri' })],
        })],
        shading: { type: ShadingType.SOLID, color: STONE_900, fill: STONE_900 },
        width: { size: Math.floor(9000 / headers.length), type: WidthType.DXA },
      })
    ),
  });

  const dataRows = rows.map((row, ri) =>
    new TableRow({
      children: row.map(cell =>
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: cell, size: 20, font: 'Calibri', color: STONE_600 })],
          })],
          shading: {
            type: ShadingType.SOLID,
            color: ri % 2 === 0 ? 'FAFAF9' : WHITE,
            fill:  ri % 2 === 0 ? 'FAFAF9' : WHITE,
          },
          width: { size: Math.floor(9000 / row.length), type: WidthType.DXA },
        })
      ),
    })
  );

  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    rows: [headerRow, ...dataRows],
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// DOCUMENT CONTENT
// ═══════════════════════════════════════════════════════════════════════════
const doc = new Document({
  creator: 'BeforeYouSign Dev Team',
  title:   'BeforeYouSign – Full Technical Documentation',
  description: 'Comprehensive explanation of every module, file, and flow in the BeforeYouSign codebase.',
  styles: {
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        run: { size: 48, bold: true, color: STONE_900, font: 'Calibri' },
        paragraph: { spacing: { before: 400, after: 160 } },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        run: { size: 36, bold: true, color: STONE_900, font: 'Calibri' },
        paragraph: { spacing: { before: 320, after: 120 } },
      },
      {
        id: 'Heading3',
        name: 'Heading 3',
        run: { size: 28, bold: true, color: AMBER, font: 'Calibri' },
        paragraph: { spacing: { before: 240, after: 80 } },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1200, right: 1000, bottom: 1200, left: 1000 },
        },
      },
      children: [

        // ── TITLE PAGE ──────────────────────────────────────────────────────
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 2000, after: 400 },
          children: [
            new TextRun({
              text: 'BeforeYouSign',
              bold: true,
              size: 80,
              color: STONE_900,
              font: 'Calibri',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 200 },
          children: [
            new TextRun({
              text: 'Complete Technical Documentation',
              size: 36,
              color: STONE_600,
              font: 'Calibri',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 3000 },
          children: [
            new TextRun({
              text: 'AI-Powered Contract Analysis Platform — Codebase Walkthrough',
              size: 24,
              color: AMBER,
              italics: true,
              font: 'Calibri',
            }),
          ],
        }),

        divider(),
        pageBreak(),

        // ════════════════════════════════════════════════════════════════════
        // 1. PROJECT OVERVIEW
        // ════════════════════════════════════════════════════════════════════
        h1('1. Project Overview'),

        para(
          'BeforeYouSign is a Next.js 16 web application that gives everyday people '
          + 'institutional-grade contract intelligence. Users upload a PDF, DOCX, or TXT contract '
          + 'and receive an AI-powered risk assessment — including clause-by-clause analysis, red '
          + 'flags, negotiation strategies, and plain-English summaries.',
          { color: STONE_600 }
        ),

        h2('1.1 Mission'),
        para(
          '"Legal comprehension has never been democratized — until now." The platform aims to '
          + 'level the playing field between parties who have institutional legal resources and '
          + 'those who do not.',
          { color: STONE_600 }
        ),

        h2('1.2 Technology Stack'),
        makeTable(
          ['Layer', 'Technology', 'Version'],
          [
            ['Framework',       'Next.js (App Router)',       '16.0.7'],
            ['Language',        'TypeScript',                  '5.x'],
            ['Styling',         'Tailwind CSS (v4)',           '4.x'],
            ['AI / LLM',        'NVIDIA NIM (OpenAI-compat.)', 'API v1'],
            ['Auth',            'NextAuth.js (v5 beta)',       '5.0.0-beta.30'],
            ['Database (MVP)',  'localStorage / Supabase',    '2.89'],
            ['PDF Parsing',     'pdf-parse',                   '2.4.5'],
            ['DOCX Parsing',    'mammoth',                     '1.11.0'],
            ['Charts',          'Recharts',                    '2.15.0'],
            ['Deployment',      'Vercel',                      'Edge/Serverless'],
          ]
        ),

        h2('1.3 Key NPM Dependencies'),
        bullet('openai — OpenAI-compatible SDK used to call the NVIDIA NIM API'),
        bullet('pdf-parse — extracts raw text from PDF binary buffers'),
        bullet('mammoth — extracts raw text from Word (.docx) binary buffers'),
        bullet('next-auth — full-featured authentication (OAuth + credentials)'),
        bullet('bcryptjs — password hashing for credential sign-in'),
        bullet('docx — generates Word documents (used for export features)'),
        bullet('jspdf + html2canvas — client-side PDF export'),
        bullet('recharts — React charting library used in dashboards'),
        bullet('@supabase/supabase-js — optional cloud database integration'),
        bullet('lucide-react — icon set used throughout the UI'),
        bullet('diff-match-patch — text diff for contract version comparison'),

        divider(),
        pageBreak(),

        // ════════════════════════════════════════════════════════════════════
        // 2. DIRECTORY STRUCTURE
        // ════════════════════════════════════════════════════════════════════
        h1('2. Directory Structure'),

        para('Top-level layout:', { bold: true }),
        code('beforeyousign/'),
        code('├── app/               Next.js App Router pages & API routes'),
        code('│   ├── api/           Server-side API route handlers'),
        code('│   ├── analyze/       /analyze page (main feature)'),
        code('│   ├── dashboard/     User dashboard'),
        code('│   ├── negotiate/     AI negotiation assistant'),
        code('│   ├── templates/     Contract template browser'),
        code('│   └── … 38 more pages'),
        code('├── components/        Shared React components (44 files)'),
        code('├── lib/               Business logic & utilities (57 files)'),
        code('├── prisma/            Prisma ORM schema (future PostgreSQL)'),
        code('├── supabase/          Supabase SQL migrations'),
        code('├── public/            Static assets'),
        code('├── auth.ts            NextAuth.js configuration'),
        code('├── vercel.json        Vercel serverless function timeouts'),
        code('└── .env.example       Environment variable template'),

        h2('2.1 app/ — Pages and API Routes'),
        para(
          'Next.js 16 uses "App Router" where each folder under app/ maps to a URL route. '
          + 'Files named page.tsx export the UI component. Files named route.ts export HTTP '
          + 'handler functions (GET, POST, etc.).',
          { color: STONE_600 }
        ),
        makeTable(
          ['Route (URL)', 'File', 'Purpose'],
          [
            ['/',                   'app/page.tsx',                      'Marketing homepage'],
            ['/analyze',            'app/analyze/page.tsx',              'Core analysis upload + results'],
            ['/dashboard',          'app/dashboard/page.tsx',            'User activity dashboard'],
            ['/negotiate',          'app/negotiate/page.tsx',            'AI negotiation helper'],
            ['/templates',          'app/templates/page.tsx',            'Browse contract templates'],
            ['/clauses',            'app/clauses/page.tsx',              '5,000+ clause library'],
            ['/risk',               'app/risk/page.tsx',                 'ML dispute prediction'],
            ['/compliance',         'app/compliance/page.tsx',           'Regulatory compliance'],
            ['/blockchain',         'app/blockchain/page.tsx',           'Blockchain verification'],
            ['/voice',              'app/voice/page.tsx',                'Voice-to-contract creator'],
            ['/lawyers',            'app/lawyers/page.tsx',              'Lawyer marketplace'],
            ['/esignature',         'app/esignature/page.tsx',           'E-signature workflow'],
            ['API /api/analyze',    'app/api/analyze/route.ts',          'Core analysis endpoint (SSE)'],
            ['API /api/negotiate',  'app/api/negotiate/route.ts',        'Negotiation AI endpoint'],
            ['API /api/drafting',   'app/api/drafting/route.ts',         'Contract drafting endpoint'],
            ['API /api/templates',  'app/api/templates/route.ts',        'Template CRUD'],
            ['API /api/pdf',        'app/api/pdf/route.ts',              'PDF tools'],
            ['API /api/share',      'app/api/share/route.ts',            'Share link generation'],
          ]
        ),

        divider(),
        pageBreak(),

        // ════════════════════════════════════════════════════════════════════
        // 3. CORE ANALYSIS PIPELINE (DEEP DIVE)
        // ════════════════════════════════════════════════════════════════════
        h1('3. Core Analysis Pipeline'),

        para(
          'The contract analysis workflow is the heart of BeforeYouSign. It follows a clean '
          + 'pipeline from file upload to rendered results, using Server-Sent Events (SSE) for '
          + 'real-time streaming so the user sees live AI output while it is generated.',
          { color: STONE_600 }
        ),

        h2('3.1 End-to-End Flow'),
        bullet('1. User drops a file on the upload widget (FileUpload component)'),
        bullet('2. Browser POSTs multipart/form-data to /api/analyze'),
        bullet('3. API validates, parses the file, builds an AI prompt, streams NVIDIA NIM response'),
        bullet('4. Browser reads the SSE stream and updates UI state in real time'),
        bullet('5. On stream completion the structured analysis object is rendered by AnalysisResult'),

        h2('3.2 File: app/api/analyze/route.ts — The Streaming API Handler'),
        para(
          'This is the most important server-side file. It is a Next.js 16 Route Handler that '
          + 'streams results back to the browser using the Server-Sent Events (SSE) protocol.',
          { color: STONE_600 }
        ),

        h3('Key settings'),
        keyVal('runtime', '"nodejs" — runs in Node.js environment, not Edge, to support PDF/DOCX parsing'),
        keyVal('maxDuration', '60 — Vercel gives this function a full 60-second budget'),

        h3('How it works step by step'),
        bullet('Step 1 — Parse form data: extracts the uploaded File object and optional jurisdiction string.'),
        bullet('Step 2 — Validate: calls validateContractFile() (size ≤ 10 MB, type = pdf/docx/doc/txt) and DocumentParser.validateFileType().'),
        bullet('Step 3 — Parse document: DocumentParser.parse(file) converts the binary to plain text.'),
        bullet('Step 4 — Build prompt: ContractAnalyzer.buildAnalysisPrompt(text, jurisdiction) produces a detailed JSON-schema prompt.'),
        bullet('Step 5 — Stream from NVIDIA NIM: opens a streaming chat completion; each delta chunk is forwarded to the browser as an SSE "chunk" event.'),
        bullet('Step 6 — Finalise: when streaming ends, the accumulated JSON is parsed by parseJsonResponse() and sent as a "done" event with the full ContractAnalysis object.'),
        bullet('Error handling: any exception is caught and sent as an "error" SSE event so the UI can display it gracefully.'),

        h3('SSE message types sent to the browser'),
        makeTable(
          ['Event type', 'Payload fields', 'Meaning'],
          [
            ['status', 'message: string',                    'Progress text (e.g. "Parsing document…")'],
            ['chunk',  'content: string',                    'One AI text delta to display in the terminal'],
            ['done',   'analysis: ContractAnalysis',         'Full structured result, analysis complete'],
            ['error',  'error: string, requestId: string',   'Something went wrong, display to user'],
          ]
        ),

        h2('3.3 File: lib/document-parser.ts — File Text Extraction'),
        para(
          'DocumentParser has one public method: parse(file). It dispatches to the right '
          + 'private handler based on MIME type.',
          { color: STONE_600 }
        ),
        bullet('PDF files → parsePDF(): lazy-imports pdf-parse to avoid Vercel cold-start crashes, then returns data.text'),
        bullet('DOCX files → parseDOCX(): uses mammoth.extractRawText({ buffer }) to get plain text'),
        bullet('TXT files → parseTXT(): converts the Buffer to a UTF-8 string directly'),
        bullet('validateFileType(): checks MIME against an allowlist (pdf, docx, doc, txt)'),
        bullet('validateFileSize(): checks file.size ≤ maxSizeInBytes (default 10 MB)'),

        para(
          'PDF import is intentionally lazy (dynamic import inside the function) because pdf-parse '
          + 'does some module-level initialisation that crashes Vercel serverless environments '
          + 'when imported at the top of the file.',
          { color: AMBER, bold: true }
        ),

        h2('3.4 File: lib/contract-analyzer.ts — The AI Brain'),
        para(
          'ContractAnalyzer is a pure-static class with three public members.',
          { color: STONE_600 }
        ),

        h3('analyze() — batch (non-streaming) analysis'),
        bullet('Used by non-streaming endpoints. Accepts contractText, fileName, fileSize, jurisdiction.'),
        bullet('Trims the contract text to ANALYZE_MAX_PROMPT_CHARS (default 6000) to fit within token limits.'),
        bullet('Calls generateText() from nvidia-client to get a synchronous response.'),
        bullet('Implements exponential-backoff retry (up to ANALYZE_MAX_RETRIES attempts) for HTTP 503/429 rate-limit errors.'),
        bullet('Returns a fully typed ContractAnalysis object via formatAnalysis().'),

        h3('buildAnalysisPrompt() — the master prompt'),
        para(
          'This method constructs the exact text sent to the AI model. Key design decisions:',
          { color: STONE_600 }
        ),
        bullet('Jurisdiction-aware: translates 2-letter ISO codes (e.g. "US-California") to full names for the model'),
        bullet('Strict length constraints: each field is capped (e.g. plainLanguage max 100 chars) to keep model output small and fast'),
        bullet('JSON-only output: the prompt instructs the model to return ONLY a JSON object — no markdown, no preamble'),
        bullet('Schema is hard-coded in the prompt to enforce a consistent structure'),
        bullet('Covers 8 clause types: IP, liability, auto-renewal, termination, indemnification, non-compete, payment, arbitration'),

        h3('formatAnalysis() — results normalisation'),
        para(
          'Maps the raw parsed JSON from the AI onto the strict ContractAnalysis TypeScript type. '
          + 'Handles missing fields gracefully (defaults to empty arrays, 0 scores, etc.) so the '
          + 'UI never crashes from an incomplete model response.',
          { color: STONE_600 }
        ),

        h3('Confidence scoring'),
        bullet('calculateOverallConfidence() — starts at 85, deducts points for missing summary/clauses/recommendations'),
        bullet('calculateRiskConfidence() — starts at 88, deducts for mis-matched risk flags vs. score'),
        bullet('calculateClauseConfidence() — starts at 90, deducts for missing industryComparison data'),
        bullet('generateConfidenceNotes() — human-readable strings appended to the analysis result'),

        h2('3.5 File: lib/nvidia-client.ts — Centralised AI Gateway'),
        para(
          'All AI calls in the app go through this single module. The NVIDIA API key and base URL '
          + 'are configured here once and never exposed to the browser.',
          { color: STONE_600 }
        ),

        h3('Model catalogue — NVIDIA_MODELS'),
        makeTable(
          ['Key', 'Model ID', 'Use case'],
          [
            ['primary',  'meta/llama-3.3-70b-instruct', 'Highest capability; used for complex tasks'],
            ['fallback', 'meta/llama-3.1-70b-instruct', 'High quality and slightly faster'],
            ['fast',     'meta/llama-3.1-8b-instruct',  'Contract analysis (speed-optimised)'],
          ]
        ),

        h3('createNvidiaClient()'),
        para(
          'Reads NVIDIA_API_KEY from environment variables and creates an OpenAI SDK client '
          + 'pointed at https://integrate.api.nvidia.com/v1 — the NVIDIA NIM endpoint that '
          + 'is fully compatible with the OpenAI chat completions API.',
          { color: STONE_600 }
        ),

        h3('generateText()'),
        para(
          'Single-prompt synchronous text generation with configurable temperature and token limit. '
          + 'Uses AbortController to enforce a hard timeout (default 45 seconds) so requests never '
          + 'hang indefinitely.',
          { color: STONE_600 }
        ),

        h3('generateWithSystem()'),
        para(
          'Like generateText() but accepts a separate system prompt — used by advanced features '
          + 'like the AI negotiation assistant and contract drafter.',
          { color: STONE_600 }
        ),

        h3('parseJsonResponse<T>()'),
        para(
          'Robust JSON parser for AI output. Handles two common failure modes:',
          { color: STONE_600 }
        ),
        bullet('Markdown fences: strips ```json … ``` wrappers that models sometimes add'),
        bullet('Truncated JSON: if JSON.parse fails, repairTruncatedJson() walks the string, closes any open strings/arrays/objects, and retries — ensuring partial AI responses are still usable'),

        divider(),
        pageBreak(),

        // ════════════════════════════════════════════════════════════════════
        // 4. FRONTEND PAGES
        // ════════════════════════════════════════════════════════════════════
        h1('4. Frontend Pages (app/)'),

        h2('4.1 Homepage — app/page.tsx'),
        para(
          'Pure marketing page rendered client-side. Contains no data fetching. Uses Lucide icons '
          + 'and Tailwind classes for a dark/light design with:',
          { color: STONE_600 }
        ),
        bullet('Hero section with a CTA button linking to /analyze'),
        bullet('"The Problem" section highlighting the legal asymmetry problem'),
        bullet('"The Solution" grid of three core feature cards'),
        bullet('"AI-Powered" grid showcasing advanced features (Negotiate, Risk, Benchmark, Voice, Blockchain, Clause Library, Obligation Tracker, Multi-Language)'),
        bullet('Social proof stats (10,000+ contracts analysed, <30 s average time)'),
        bullet('Legal disclaimer footer'),

        h2('4.2 Analyze Page — app/analyze/page.tsx'),
        para(
          'THE main user-facing page. This is a "use client" React component managing four states:',
          { color: STONE_600 }
        ),
        bullet('Upload state: shows the FileUpload component and trust badges'),
        bullet('Analyzing state: shows a loading screen with a live terminal-style stream of raw AI JSON output'),
        bullet('Error state: shows the error message and a Restart button'),
        bullet('Result state: renders the AnalysisResult component with all analysis data'),

        h3('handleFileSelect() — the stream consumer'),
        bullet('Posts multipart/form-data to /api/analyze using fetch()'),
        bullet('Opens a ReadableStream reader and decodes chunks using TextDecoder'),
        bullet('Splits the buffer on SSE boundary "\\n\\n" and parses each "data: …" line as JSON'),
        bullet('Dispatches each event type: "status" → setStatusMessage, "chunk" → append to streamingText, "done" → setAnalysis, "error" → setError'),
        bullet('Auto-scrolls the terminal div to the bottom as new streaming text arrives (via useEffect + ref)'),

        h2('4.3 Other Pages (summaries)'),
        makeTable(
          ['Page', 'Component', 'What it does'],
          [
            ['Dashboard',    'UserDashboard.tsx',                 'Shows past analyses, stats, quick actions'],
            ['Negotiate',    'AIContractNegotiationAssistant.tsx', 'Chat-style AI negotiation coach'],
            ['Templates',    'TemplatesLibrary.tsx',              'Browse and download pre-vetted contract templates'],
            ['Clauses',      'ClauseCard.tsx',                    'Searchable library of 5,000+ pre-vetted clauses'],
            ['Risk',         'RiskGauge.tsx',                     'ML-powered dispute probability prediction'],
            ['Compliance',   'ComplianceMonitoring.tsx',          'GDPR / SOC2 / HIPAA compliance scanner'],
            ['Blockchain',   'BlockchainVerification.tsx',        'Cryptographic contract registry'],
            ['Voice',        'ContractChat.tsx + voice engine',   'Speech-to-contract creation'],
            ['Lawyers',      'LawyerMarketplace.tsx',             'Directory of vetted lawyers for consultation'],
            ['E-Signature',  'ESignature.tsx',                    'Digital signature workflow'],
          ]
        ),

        divider(),
        pageBreak(),

        // ════════════════════════════════════════════════════════════════════
        // 5. COMPONENTS
        // ════════════════════════════════════════════════════════════════════
        h1('5. React Components (components/)'),

        h2('5.1 FileUpload.tsx'),
        para(
          'Drag-and-drop file upload widget powered by react-dropzone. Displays file name and size '
          + 'after selection, lets the user pick a jurisdiction (country + optional state), and '
          + 'calls the onFileSelect callback with the File and jurisdiction string.',
          { color: STONE_600 }
        ),

        h2('5.2 AnalysisResult.tsx'),
        para(
          'The largest single component (~190 KB). Renders the entire contract analysis result once '
          + 'the AI finishes. Contains multiple sub-sections:',
          { color: STONE_600 }
        ),
        bullet('Risk score gauge (circular SVG meter, colour-coded Low/Medium/High/Critical)'),
        bullet('Document metadata (file name, type, parties, governing law, dates)'),
        bullet('Summary card with key takeaways'),
        bullet('Red flags list with severity badges (Warning / Danger / Critical)'),
        bullet('Clause cards: each showing original text, plain-English explanation, risk level, fairness score, industry compared percentile, and negotiation strategy'),
        bullet('Insights panel: missing clauses, contradictions found, unusual terms, strengths to keep'),
        bullet('Recommendations list with numbered action items'),
        bullet('Export buttons for PDF and DOCX'),
        bullet('Confidence score breakdown'),

        h2('5.3 Navbar.tsx'),
        para(
          'The top navigation bar (~45 KB). Includes navigation links to all major features, '
          + 'authentication state (sign-in / user avatar), a mobile hamburger menu, and '
          + 'responsive collapsed menus for the 40+ available routes.',
          { color: STONE_600 }
        ),

        h2('5.4 Other Notable Components'),
        makeTable(
          ['Component', 'Purpose'],
          [
            ['RiskGauge.tsx',                    'Animated circular risk score dial'],
            ['ESignature.tsx',                   'Full digital signature workflow with canvas drawing'],
            ['AIContractDrafter.tsx',             'AI-assisted contract drafting wizard'],
            ['AIContractNegotiationAssistant.tsx','Step-by-step negotiation coach with counter-proposal logic'],
            ['TeamCollaboration.tsx',             'Multi-user commenting and approval workflow'],
            ['ComplianceMonitoring.tsx',          'Regulatory flag summary dashboard'],
            ['BlockchainVerification.tsx',        'Generates + verifies cryptographic hashes of contracts'],
            ['ErrorBoundary.tsx',                 'React error boundary wrapper to prevent full-page crashes'],
            ['ToastProvider.tsx',                 'Global notification toast system'],
            ['Loading.tsx',                       'Full-screen loading spinner for Suspense boundaries'],
            ['Skeleton.tsx',                      'Loading placeholder UI for individual cards'],
          ]
        ),

        divider(),
        pageBreak(),

        // ════════════════════════════════════════════════════════════════════
        // 6. LIBRARY MODULES (lib/)
        // ════════════════════════════════════════════════════════════════════
        h1('6. Library Modules (lib/)'),

        h2('6.1 lib/types.ts — TypeScript Interfaces'),
        para(
          'Defines the core data shapes used throughout the entire application. Key interfaces:',
          { color: STONE_600 }
        ),
        makeTable(
          ['Interface', 'Purpose'],
          [
            ['ContractAnalysis',      'Top-level type returned by the AI analysis; holds all sub-types'],
            ['ClauseAnalysis',        'Single clause: text, risk level, plain language, fairness score, industry comparison, negotiation strategy'],
            ['RedFlag',               'A critical issue found in the contract: type, severity, affected clauses, recommendation'],
            ['ContractInsights',      'Missing clauses, contradictions between clauses, unusual terms, strengths'],
            ['ContractMetadata',      'File-level meta: name, size, parties, dates, governing law, document type'],
            ['AnalysisConfidence',    'Model name, version, confidence scores, notes'],
            ['IndustryBenchmark',     'Compares the contract against industry averages'],
            ['ComparativeInsight',    'A single comparative observation (stricter/fairer than market)'],
          ]
        ),
        para('ClauseCategory union type includes: payment, termination, liability, intellectual_property, confidentiality, dispute_resolution, warranties, indemnification, non_compete, general, other.', { color: STONE_600 }),
        para('RedFlagType union type includes: ip_transfer, unlimited_liability, auto_renewal, restricted_termination, one_sided_amendment, venue_forum, waiver_of_rights, confidentiality_overreach, indemnification, non_compete, payment_terms, dispute_resolution, other.', { color: STONE_600 }),

        h2('6.2 lib/security.ts — Security Utilities'),
        para(
          'A comprehensive security module covering multiple protection layers:',
          { color: STONE_600 }
        ),
        bullet('sanitizeInput(input): escapes HTML special characters to prevent XSS attacks in any user-supplied text'),
        bullet('sanitizeHTML(html): while preserving a safe allowlist of tags (b, i, em, strong, a, p, br, ul, ol, li), strips all script tags and on* event attributes'),
        bullet('CSRFManager class: generates/stores/validates CSRF tokens in sessionStorage with 24-hour expiry'),
        bullet('RateLimiter class: in-memory sliding window rate limiter; checkLimit(key, config) checks whether a given key has exceeded maxRequests in windowMs'),
        bullet('validateContractFile(file): wrapper that calls validateFile() with contract-specific rules (10 MB max, pdf/docx/doc/txt only, no null bytes, max 255-char filename)'),
        bullet('SessionManager class: creates, reads, refreshes, and destroys sessions stored in sessionStorage with 30-minute TTL'),
        bullet('logSecurityEvent(): writes audit log entries to localStorage (in development logs to console; in production would send to e.g. DataDog)'),
        bullet('validatePasswordStrength(password): scores a password 0–4 based on length, character variety, and common-pattern detection'),
        bullet('generateSecureToken(length): uses the Web Crypto API to generate cryptographically-safe random tokens'),
        bullet('hashData(data): SHA-256 hashes a string using the SubtleCrypto API for integrity verification'),
        bullet('CSP_HEADERS constant: ready-to-use Content-Security-Policy and related security response headers'),

        h2('6.3 lib/database.ts — Data Persistence Layer'),
        para(
          'An abstraction over localStorage designed to be swapped out for a real database '
          + '(PostgreSQL, MongoDB, Supabase) in production.',
          { color: STONE_600 }
        ),
        bullet('getItem<T>(key): reads and JSON-parses a single localStorage key'),
        bullet('setItem<T>(key, value): JSON-serialises and writes; handles QuotaExceededError by running cleanup() first'),
        bullet('getAllItems<T>(collection, options): reads a collection array and applies sorting and pagination'),
        bullet('insert<T>(collection, item): appends an item to a collection, rejects duplicate IDs'),
        bullet('update<T>(collection, id, updates): finds an item by ID and merges updates'),
        bullet('delete<T>(collection, id): removes item by ID'),
        bullet('find<T>(collection, predicate): filters a collection with a custom predicate'),
        bullet('In-memory cache layer: results are cached with a 5-minute TTL; writes invalidate relevant cache entries'),
        bullet('exportData() / importData(): full backup/restore of all localStorage data'),
        bullet('getStorageStats(): reports used/available storage bytes and item count'),
        bullet('Schema versioning: on first init, migrate() builds indexes for faster queries'),

        h2('6.4 lib/auth-utils.ts'),
        para(
          'Helper utilities for session and permission checking on both client and server. '
          + 'Provides wrappers around the NextAuth session for common checks like '
          + '"is the user an admin?" or "is the session still valid?".',
          { color: STONE_600 }
        ),

        h2('6.5 lib/advanced-analyzer.ts'),
        para(
          'An extended analysis engine that performs multi-step contract analysis with:',
          { color: STONE_600 }
        ),
        bullet('Deep clause extraction with position tracking'),
        bullet('Industry benchmark comparison'),
        bullet('Cross-clause contradiction detection'),
        bullet('Missing clause identification (e.g. "this NDA has no dispute resolution clause")'),

        h2('6.6 lib/ai-contract-drafter.ts'),
        para(
          'AI-assisted contract drafting. Accepts a description of what the user needs and '
          + 'produces a complete, jurisdiction-aware contract draft using NVIDIA NIM. '
          + 'Supports templates for NDA, employment, service agreement, and more.',
          { color: STONE_600 }
        ),

        h2('6.7 lib/ai-negotiation-assistant.ts'),
        para(
          'Powers the /negotiate page. Generates clause-by-clause counter-proposals and '
          + 'negotiation strategies. Uses the primary 70B model for highest quality reasoning. '
          + 'Outputs structured JSON with proposed text, rationale, leverage assessment, and '
          + 'BATNA (Best Alternative to Negotiated Agreement) analysis.',
          { color: STONE_600 }
        ),

        h2('6.8 lib/smart-template-builder.ts (62 KB)'),
        para(
          'The largest library file. A comprehensive template engine that can:',
          { color: STONE_600 }
        ),
        bullet('Merge user variables into template placeholders'),
        bullet('Apply jurisdiction-specific clause variants'),
        bullet('Validate completeness (required fields, minimum term lengths)'),
        bullet('Score templates for risk before the user even signs'),

        h2('6.9 Other Notable Library Files'),
        makeTable(
          ['File', 'Purpose'],
          [
            ['lib/contract-versioning.ts',           'Tracks document revisions and diffs between versions'],
            ['lib/version-compare.ts',               'Side-by-side diff using diff-match-patch'],
            ['lib/compliance-security.ts',           'GDPR, HIPAA, SOC2 compliance clause scanner'],
            ['lib/regulatory-compliance-scanner.ts', 'Matches clauses against known regulatory requirements per jurisdiction'],
            ['lib/contract-lifecycle-automation.ts', 'Automates renewal reminders, obligation deadlines, alerts'],
            ['lib/obligation-tracker.ts',             'Extracts and tracks deadlines and obligations from contracts'],
            ['lib/lawyers-data.ts',                  'Static data for the lawyer marketplace (profiles, specialisms, pricing)'],
            ['lib/negotiation-playbook.ts',          'Pre-built negotiation playbooks for common contract types'],
            ['lib/templates-data.ts (124 KB)',       'Large library of contract template text and metadata'],
            ['lib/ml-risk-predictor.ts',             'Heuristic ML model for dispute-probability prediction'],
            ['lib/multi-language-analyzer.ts',       'Routes analysis through translation layer for non-English contracts'],
            ['lib/voice-contract-engine.ts',         'Converts speech transcript to structured contract'],
            ['lib/export-manager.ts',                'Unified export: PDF (jsPDF), DOCX (docx package), plain text'],
            ['lib/share-links.ts',                   'Generates shareable links with expiry tokens'],
            ['lib/analytics.ts',                     'User event tracking (privacy-preserving, no PII)'],
            ['lib/performance.ts',                   'Web Vitals measurement utilities'],
            ['lib/health.ts',                        'Service health check aggregator'],
          ]
        ),

        divider(),
        pageBreak(),

        // ════════════════════════════════════════════════════════════════════
        // 7. AUTHENTICATION
        // ════════════════════════════════════════════════════════════════════
        h1('7. Authentication — auth.ts'),

        para(
          'NextAuth v5 (beta) is used. The configuration file auth.ts is the single source of '
          + 'truth for all authentication logic.',
          { color: STONE_600 }
        ),

        h2('7.1 Supported Sign-In Methods'),
        bullet('GitHub OAuth — via AUTH_GITHUB_ID and AUTH_GITHUB_SECRET environment variables'),
        bullet('Google OAuth — via AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET environment variables'),
        bullet('Email + Password (Credentials) — passwords hashed with bcryptjs (salt rounds: 10)'),

        h2('7.2 How Credentials Auth Works'),
        bullet('1. User submits email + password on /auth/signin'),
        bullet('2. authorize() callback looks up the user in a mock in-memory Map (replace with DB in production)'),
        bullet('3. bcrypt.compare() validates the submitted password against the stored hash'),
        bullet('4. On success, the user object { id, name, email, image } is returned and stored in a JWT'),

        h2('7.3 JWT Session Strategy'),
        bullet('strategy: "jwt" — sessions are stored in signed HTTP-only cookies, not the database'),
        bullet('maxAge: 30 days — tokens are valid for 30 days'),
        bullet('jwt() callback: injects user.id and the OAuth provider name into the token payload'),
        bullet('session() callback: copies token.id into session.user.id for easy access in components'),

        h2('7.4 Custom Auth Pages'),
        makeTable(
          ['URL', 'Purpose'],
          [
            ['/auth/signin',   'Custom sign-in form (email/password + OAuth buttons)'],
            ['/auth/signout',  'Sign-out confirmation page'],
            ['/auth/error',    'Error display for failed auth attempts'],
            ['/auth/welcome',  'Welcome page for newly registered users'],
          ]
        ),

        h2('7.5 registerUser() helper'),
        para(
          'Exported async function that hashes a password and adds the user to the in-memory store. '
          + 'In production this should be replaced with a database INSERT and proper email verification flow.',
          { color: STONE_600 }
        ),

        h2('7.6 OAuth User Auto-Registration'),
        para(
          'The signIn() callback auto-creates a user record when a GitHub or Google user signs in '
          + 'for the first time — so they can immediately use the platform without a separate '
          + 'registration step.',
          { color: STONE_600 }
        ),

        divider(),
        pageBreak(),

        // ════════════════════════════════════════════════════════════════════
        // 8. ENVIRONMENT VARIABLES
        // ════════════════════════════════════════════════════════════════════
        h1('8. Environment Variables'),

        makeTable(
          ['Variable', 'Required', 'Description'],
          [
            ['NVIDIA_API_KEY',              'YES',       'API key for NVIDIA NIM (from build.nvidia.com)'],
            ['AUTH_SECRET',                 'YES',       'Random 32-byte secret for NextAuth JWT signing'],
            ['NEXT_PUBLIC_APP_URL',         'YES',       'Full URL of the deployed app (e.g. https://app.example.com)'],
            ['NEXT_PUBLIC_MAX_FILE_SIZE',   'No',        'Max upload bytes (default: 10485760 = 10 MB)'],
            ['AUTH_GITHUB_ID',              'No',        'GitHub OAuth Client ID'],
            ['AUTH_GITHUB_SECRET',         'No',        'GitHub OAuth Client Secret'],
            ['AUTH_GOOGLE_ID',              'No',        'Google OAuth Client ID'],
            ['AUTH_GOOGLE_SECRET',         'No',        'Google OAuth Client Secret'],
            ['NEXT_PUBLIC_SUPABASE_URL',   'No',        'Supabase project URL for cloud DB'],
            ['NEXT_PUBLIC_SUPABASE_ANON_KEY','No',      'Supabase anonymous/public key'],
            ['SUPABASE_SERVICE_ROLE_KEY',  'No',        'Supabase admin key (server-only)'],
            ['ANALYZE_MAX_PROMPT_CHARS',   'No',        'Max chars sent to AI (default: 6000)'],
            ['ANALYZE_MAX_OUTPUT_TOKENS',  'No',        'Max AI output tokens (default: 4096)'],
            ['ANALYZE_MAX_RETRIES',        'No',        'Retry attempts on 503/429 errors (default: 1)'],
            ['NVIDIA_REQUEST_TIMEOUT_MS',  'No',        'Hard timeout for NVIDIA requests (default: 45000)'],
          ]
        ),

        divider(),
        pageBreak(),

        // ════════════════════════════════════════════════════════════════════
        // 9. DEPLOYMENT (Vercel)
        // ════════════════════════════════════════════════════════════════════
        h1('9. Deployment Configuration — vercel.json'),

        para(
          'The app is configured for Vercel serverless deployment. vercel.json overrides the '
          + 'default function timeout for five AI-heavy endpoints:',
          { color: STONE_600 }
        ),

        makeTable(
          ['API Route', 'maxDuration', 'Reason'],
          [
            ['app/api/analyze/route.ts',          '60 s', 'Contract parsing + NVIDIA NIM streaming'],
            ['app/api/analyze-advanced/route.ts', '60 s', 'Multi-step deep analysis'],
            ['app/api/detect-clauses/route.ts',   '45 s', 'Clause detection pass'],
            ['app/api/negotiate/route.ts',        '60 s', 'AI negotiation response generation'],
            ['app/api/drafting/route.ts',         '60 s', 'Full contract draft generation'],
          ]
        ),

        para(
          'All other routes use Vercel\'s default timeout (10 s for Hobby, 60 s for Pro).',
          { color: STONE_600 }
        ),

        h2('9.1 Streaming Solves the Timeout Problem'),
        para(
          'The /api/analyze route streams responses using Server-Sent Events rather than waiting '
          + 'for a complete JSON blob. This means:',
          { color: STONE_600 }
        ),
        bullet('The HTTP connection is kept alive from the first byte (status event) rather than only when the full response is ready'),
        bullet('Vercel\'s timeout clock resets on each chunk, allowing the full 60-second budget to be used'),
        bullet('Users see live AI output instead of a blank spinner, improving perceived performance'),

        divider(),
        pageBreak(),

        // ════════════════════════════════════════════════════════════════════
        // 10. DATA FLOW DIAGRAMS
        // ════════════════════════════════════════════════════════════════════
        h1('10. Data Flow — Text Diagrams'),

        h2('10.1 Contract Analysis Flow'),
        code('User (Browser)'),
        code('  │'),
        code('  │  drops contract file onto /analyze page'),
        code('  │'),
        code('  ▼'),
        code('FileUpload Component'),
        code('  │  calls handleFileSelect(file, jurisdiction)'),
        code('  ▼'),
        code('fetch POST /api/analyze (multipart/form-data)'),
        code('  │'),
        code('  ▼'),
        code('app/api/analyze/route.ts  [Node.js, 60 s budget]'),
        code('  │  1. extract File + jurisdiction from formData'),
        code('  │  2. validateContractFile(file)   → security checks'),
        code('  │  3. DocumentParser.parse(file)   → plain text'),
        code('  │  4. ContractAnalyzer.buildPrompt → AI prompt'),
        code('  │  5. createNvidiaClient()          → NVIDIA NIM'),
        code('  │  6. stream chat completion'),
        code('  │     ├─ each delta → send SSE "chunk" event'),
        code('  │     └─ on end    → parseJsonResponse() + formatAnalysis()'),
        code('  │  7. send SSE "done" event with ContractAnalysis'),
        code('  │'),
        code('  ▼'),
        code('Browser SSE reader (analyze/page.tsx)'),
        code('  │  "status" → setStatusMessage'),
        code('  │  "chunk"  → append to streamingText'),
        code('  │  "done"   → setAnalysis(data.analysis)'),
        code('  │  "error"  → setError(data.error)'),
        code('  │'),
        code('  ▼'),
        code('AnalysisResult component renders full report'),

        h2('10.2 Authentication Flow (Credentials)'),
        code('User fills /auth/signin form'),
        code('  │'),
        code('  ▼'),
        code('Next.js auth.ts — authorize() callback'),
        code('  │  1. Look up user by email in mock users Map'),
        code('  │  2. bcrypt.compare(password, user.password)'),
        code('  │  3. Return user object on success'),
        code('  │'),
        code('  ▼'),
        code('NextAuth creates JWT with user.id + provider'),
        code('  │'),
        code('  ▼'),
        code('JWT stored in encrypted HTTP-only cookie (30 days)'),
        code('  │'),
        code('  ▼'),
        code('session() callback exposes user.id to all page components'),

        divider(),
        pageBreak(),

        // ════════════════════════════════════════════════════════════════════
        // 11. SECURITY ARCHITECTURE
        // ════════════════════════════════════════════════════════════════════
        h1('11. Security Architecture'),

        h2('11.1 File Upload Security'),
        bullet('MIME type allow-listing (pdf/docx/doc/txt only) — checked in both route.ts AND DocumentParser'),
        bullet('10 MB file size cap enforced before any parsing occurs'),
        bullet('Null byte detection in filenames (potential path traversal)'),
        bullet('File name length cap (255 chars)'),
        bullet('Files are parsed in memory and immediately discarded — nothing is persisted to disk or DB'),

        h2('11.2 Input Sanitization'),
        bullet('All string form inputs pass through sanitizeInput() which HTML-encodes special characters'),
        bullet('This prevents XSS in any value that is reflected into the UI'),

        h2('11.3 CSRF Protection'),
        bullet('CSRFManager generates 32-character random tokens stored in sessionStorage'),
        bullet('Tokens expire after 24 hours and are rotated on each use'),

        h2('11.4 Rate Limiting'),
        bullet('RateLimiter provides in-memory sliding window rate limiting'),
        bullet('Can be applied per IP, per user ID, or per API key'),
        bullet('For production, this should be replaced with a Redis-backed distributed limiter'),

        h2('11.5 API Key Security'),
        bullet('NVIDIA_API_KEY lives only in server-side environment variables'),
        bullet('It is NEVER in any NEXT_PUBLIC_ variable or client bundle'),
        bullet('The single createNvidiaClient() function is the only place the key is read'),

        h2('11.6 Password Security'),
        bullet('User passwords hashed with bcryptjs at cost factor 10 (≈100 ms per hash)'),
        bullet('Plaintext passwords never stored or logged'),
        bullet('validatePasswordStrength() enforces minimum complexity requirements'),

        h2('11.7 Content Security Policy'),
        bullet('CSP_HEADERS object in lib/security.ts defines strict source policies'),
        bullet('frame-ancestors: none prevents clickjacking'),
        bullet('form-action: self prevents cross-site form posting'),
        bullet('connect-src restricts XHR/fetch to self + NVIDIA API'),

        divider(),
        pageBreak(),

        // ════════════════════════════════════════════════════════════════════
        // 12. HOW TO RUN LOCALLY
        // ════════════════════════════════════════════════════════════════════
        h1('12. How to Run Locally'),

        h2('Step 1 — Install dependencies'),
        code('npm install'),

        h2('Step 2 — Create environment file'),
        code('copy .env.example .env.local'),
        para('Then edit .env.local and fill in at minimum:', { color: STONE_600 }),
        code('NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxxxxxx'),
        code('AUTH_SECRET=<output of: openssl rand -base64 32>'),
        code('NEXT_PUBLIC_APP_URL=http://localhost:3000'),

        h2('Step 3 — Start development server'),
        code('npm run dev'),
        para('The app will be available at http://localhost:3000', { color: STONE_600 }),

        h2('Optional commands'),
        code('npm run build     # Build production bundle'),
        code('npm run start     # Start production server'),
        code('npm run lint      # Run ESLint'),
        code('npm run clean     # Delete .next cache'),
        code('npm run fresh     # Clean + dev (full reset)'),

        divider(),
        pageBreak(),

        // ════════════════════════════════════════════════════════════════════
        // 13. FREQUENTLY ASKED QUESTIONS
        // ════════════════════════════════════════════════════════════════════
        h1('13. Frequently Asked Questions (FAQs)'),

        h2('Q: Why does the app use NVIDIA NIM instead of OpenAI?'),
        para(
          'NVIDIA NIM runs the same Meta Llama models but on NVIDIA\'s globally distributed '
          + 'GPU infrastructure, often with lower latency and cost at scale. The client is '
          + '100% OpenAI SDK-compatible so switching to any other provider requires only '
          + 'changing the baseURL and model name in nvidia-client.ts.',
          { color: STONE_600 }
        ),

        h2('Q: Is the contract stored anywhere?'),
        para(
          'No. The contract text is extracted in memory, sent to NVIDIA\'s API over HTTPS, '
          + 'and then immediately discarded. Nothing is written to disk or database. '
          + 'The analysis result may be cached in localStorage on the user\'s own browser '
          + 'device, but that is entirely under the user\'s control.',
          { color: STONE_600 }
        ),

        h2('Q: What happens if the AI response is cut off (token limit)?'),
        para(
          'The repairTruncatedJson() function in lib/nvidia-client.ts handles this. It walks '
          + 'the partial JSON string, detects unclosed strings/arrays/objects, and closes them '
          + 'syntactically before attempting JSON.parse() a second time. This ensures partial '
          + 'responses still produce a usable analysis object.',
          { color: STONE_600 }
        ),

        h2('Q: Why is pdf-parse imported lazily?'),
        para(
          'pdf-parse executes module-level code that reads a local file during import. In Vercel\'s '
          + 'serverless environment (read-only filesystem + module bundling), this causes a crash '
          + 'at cold-start time. Dynamic import() inside the function bypasses this because '
          + 'the code only runs when an actual PDF is being processed.',
          { color: STONE_600 }
        ),

        h2('Q: How does streaming prevent the 504 timeout on Vercel?'),
        para(
          'Vercel\'s timeout countdown begins when the HTTP connection opens and resets when the '
          + 'first byte of the response body is sent. By immediately flushing a "status" SSE event '
          + 'at the start of the request (before any AI call), the response stream is open and '
          + 'data flows continuously — preventing a 30 s idle timeout from firing.',
          { color: STONE_600 }
        ),

        h2('Q: What is the database.ts localStorage used for?'),
        para(
          'The localStorage-backed Database class is the MVP persistence layer for features like '
          + 'saved analyses, bookmarks, audit logs, and session data — all stored locally in the '
          + 'user\'s browser. In production, the plan is to replace these calls with Supabase '
          + 'or PostgreSQL via Prisma (schema already defined in prisma/).',
          { color: STONE_600 }
        ),

        divider(),

        // ════════════════════════════════════════════════════════════════════
        // FOOTER
        // ════════════════════════════════════════════════════════════════════
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 0 },
          children: [
            new TextRun({
              text: '© 2025 BeforeYouSign — Technical Documentation',
              size: 18,
              color: STONE_600,
              font: 'Calibri',
              italics: true,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: 'This document is auto-generated from codebase analysis.',
              size: 16,
              color: STONE_200,
              font: 'Calibri',
            }),
          ],
        }),
      ],
    },
  ],
});

// ─── Write file ──────────────────────────────────────────────────────────────
const buffer = await Packer.toBuffer(doc);
writeFileSync(OUTPUT, buffer);
console.log(`✅  Documentation written to: ${OUTPUT}`);
