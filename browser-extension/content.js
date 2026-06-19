/**
 * BeforeYouSign Content Script
 * Grammarly-style contract risk highlighter for any web page
 */

const API_BASE = 'https://beforeyousign.vercel.app';
const BYS_CLASS = 'bys-highlight';
const BYS_TOOLTIP_ID = 'bys-tooltip';
const BYS_BADGE_ID = 'bys-page-badge';

const RISK_COLORS = {
  critical: { bg: '#fee2e2', underline: '#dc2626', dot: '#dc2626', label: 'Critical Risk' },
  high:     { bg: '#ffedd5', underline: '#ea580c', dot: '#ea580c', label: 'High Risk' },
  medium:   { bg: '#fef9c3', underline: '#ca8a04', dot: '#ca8a04', label: 'Medium Risk' },
  low:      { bg: '#f0fdf4', underline: '#16a34a', dot: '#16a34a', label: 'Low Risk' },
};

const CATEGORY_ICONS = {
  indemnification: '⚖️',
  non_compete:     '🚫',
  ip_transfer:     '💡',
  auto_renewal:    '🔄',
  termination:     '📋',
  arbitration:     '🏛️',
  amendment:       '✏️',
  liability:       '⚠️',
  penalty:         '💸',
  confidentiality: '🔒',
  payment:         '💵',
  general:         '📄',
};

// State
let highlightsEnabled = true;
let detectedClauses = [];
let activeTooltip = null;
let analysisInProgress = false;

// ─────────────────────────────────────────────
// MAIN ENTRY POINT
// ─────────────────────────────────────────────
async function init() {
  // Load settings
  const stored = await chrome.storage.local.get(['highlightsEnabled', 'apiBase']);
  highlightsEnabled = stored.highlightsEnabled !== false;
  const apiBase = stored.apiBase || API_BASE;

  // Only run on pages that look like they contain contracts
  if (!looksLikeContract()) return;

  const contractText = extractContractText();
  if (!contractText || contractText.length < 200) return;

  // Show "analyzing" badge
  showPageBadge('analyzing');

  try {
    const result = await callDetectClauses(contractText, apiBase);
    if (result && result.clauses && result.clauses.length > 0) {
      detectedClauses = result.clauses;
      if (highlightsEnabled) {
        applyHighlights(result.clauses);
      }
      showPageBadge('done', result.riskSummary);
      // Notify background so popup can show data
      chrome.runtime.sendMessage({
        type: 'ANALYSIS_COMPLETE',
        data: { clauses: result.clauses, riskSummary: result.riskSummary, url: location.href }
      });
    } else {
      showPageBadge('safe');
    }
  } catch (err) {
    console.error('[BeforeYouSign] Analysis error:', err);
    showPageBadge('error');
  }
}

// ─────────────────────────────────────────────
// CONTRACT DETECTION HEURISTICS
// ─────────────────────────────────────────────

// Pages to NEVER run on (social feeds, video, search, email etc.)
const SKIP_DOMAINS = [
  'twitter.com', 'x.com', 'facebook.com', 'instagram.com',
  'tiktok.com', 'youtube.com', 'reddit.com', 'linkedin.com',
  'google.com/search', 'bing.com/search', 'duckduckgo.com',
  'gmail.com', 'mail.google.com', 'outlook.com', 'yahoo.com/mail',
  'netflix.com', 'spotify.com', 'twitch.tv', 'discord.com',
  'wikipedia.org', // informational, not signing anything
  'news.ycombinator.com',
];

function looksLikeContract() {
  const host = location.hostname + location.pathname;

  // Skip social media / entertainment / search / email
  if (SKIP_DOMAINS.some(d => host.includes(d))) return false;

  // Always ON for known document / e-signature / legal sites
  const CONTRACT_SITES = [
    'docs.google.com', 'docusign.com', 'hellosign.com', 'pandadoc.com',
    'docuware.com', 'contractsafe.com', 'ironclad.com', 'dropbox.com/paper',
    'notion.so', 'sharepoint.com', 'confluence', 'conga.com',
    'adobesign.com', 'esignlive.com', 'signrequest.com', 'signnow.com',
  ];
  if (CONTRACT_SITES.some(s => host.includes(s))) return true;

  // URL / title hint — agreements, NDAs, leases, terms etc.
  const titleOrUrl = (document.title + ' ' + location.href).toLowerCase();
  if (/\b(contract|agreement|terms|nda|lease|employ|offer.?letter|policy|waiver|consent|privacy)\b/.test(titleOrUrl)) return true;

  // Run on ANY page with reasonable text length — let the API decide
  const bodyLen = (document.body.innerText || '').trim().length;
  return bodyLen > 600; // covers most real documents / PDFs / web apps
}

// ─────────────────────────────────────────────
// TEXT EXTRACTION
// ─────────────────────────────────────────────
function extractContractText() {
  // ── Google Docs ──────────────────────────────────────────
  if (location.hostname.includes('docs.google.com')) {
    // Google Docs renders text into .kix-lineview spans
    const lines = Array.from(document.querySelectorAll('.kix-lineview'))
      .map(el => el.innerText)
      .filter(Boolean)
      .join(' ');
    if (lines.length > 200) return lines;

    // Fallback: aria-label on canvas wrapper
    const canvas = document.querySelector('.kix-appview-editor');
    if (canvas) {
      const text = canvas.innerText;
      if (text && text.length > 200) return text;
    }
  }

  // ── Try semantic content selectors ───────────────────────
  const selectors = [
    'main', 'article', '.contract', '.document', '.content',
    '[role="main"]', '.ql-editor', '.ProseMirror', '.document-content',
    '.contract-text', '#contract', '#document',
    // DocuSign / PandaDoc / HelloSign
    '.document-page', '.page-content', '.signing-page',
    '[data-qa="document-body"]', '.document-body',
  ];

  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) {
      const text = el.innerText;
      if (text && text.length > 300) return text;
    }
  }

  // ── Paragraph fallback ────────────────────────────────────
  const paras = Array.from(document.querySelectorAll('p, div, section'))
    .map(el => el.innerText)
    .filter(t => t && t.length > 100)
    .join('\n');

  return paras || document.body.innerText;
}

// ─────────────────────────────────────────────
// API CALL
// ─────────────────────────────────────────────
async function callDetectClauses(text, apiBase) {
  const res = await fetch(`${apiBase}/api/detect-clauses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text.slice(0, 8000) }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─────────────────────────────────────────────
// HIGHLIGHT APPLICATION (Grammarly-style underlines)
// ─────────────────────────────────────────────
function applyHighlights(clauses) {
  clauses.forEach((clause) => {
    const snippet = clause.text.slice(0, 80).trim();
    if (!snippet) return;

    // Walk the DOM text nodes and wrap matching text
    wrapTextInDOM(document.body, snippet, clause);
  });
}

function wrapTextInDOM(root, searchText, clause) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        // Skip script, style, highlight spans we already made
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (['script', 'style', 'noscript', 'head'].includes(tag)) return NodeFilter.FILTER_REJECT;
        if (parent.classList.contains(BYS_CLASS)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);

  // Normalize search (collapse whitespace)
  const normalizedSearch = searchText.replace(/\s+/g, ' ').toLowerCase();

  for (const textNode of nodes) {
    const content = textNode.textContent || '';
    const normalizedContent = content.replace(/\s+/g, ' ').toLowerCase();
    const idx = normalizedContent.indexOf(normalizedSearch.slice(0, 40));
    if (idx === -1) continue;

    try {
      const range = document.createRange();
      range.setStart(textNode, idx);
      range.setEnd(textNode, Math.min(idx + searchText.length, content.length));

      const colors = RISK_COLORS[clause.riskLevel] || RISK_COLORS.medium;
      const span = document.createElement('span');
      span.className = `${BYS_CLASS} bys-${clause.riskLevel}`;
      span.setAttribute('data-bys-id', clause.id);
      span.setAttribute('data-bys-risk', clause.riskLevel);
      span.style.cssText = `
        background: ${colors.bg} !important;
        border-bottom: 2.5px wavy ${colors.underline} !important;
        border-radius: 2px !important;
        cursor: pointer !important;
        position: relative !important;
        display: inline !important;
      `;

      range.surroundContents(span);

      // Attach tooltip events
      span.addEventListener('mouseenter', (e) => showTooltip(e, clause));
      span.addEventListener('mouseleave', hideTooltipDelayed);
      span.addEventListener('click', (e) => { e.stopPropagation(); showTooltip(e, clause, true); });

      break; // only wrap first occurrence per clause
    } catch {
      // DOM manipulation can fail on complex nodes — skip gracefully
    }
  }
}

// ─────────────────────────────────────────────
// TOOLTIP
// ─────────────────────────────────────────────
let tooltipTimer = null;

function showTooltip(e, clause, pinned = false) {
  clearTimeout(tooltipTimer);
  removeTooltip();

  const colors = RISK_COLORS[clause.riskLevel] || RISK_COLORS.medium;
  const icon = CATEGORY_ICONS[clause.category] || '📄';

  const tooltip = document.createElement('div');
  tooltip.id = BYS_TOOLTIP_ID;
  if (pinned) tooltip.setAttribute('data-pinned', 'true');

  tooltip.innerHTML = `
    <div class="bys-tt-header">
      <span class="bys-tt-dot" style="background:${colors.dot}"></span>
      <span class="bys-tt-risk" style="color:${colors.dot}">${colors.label}</span>
      <span class="bys-tt-icon">${icon}</span>
      <span class="bys-tt-category">${clause.category.replace(/_/g, ' ')}</span>
      ${pinned ? `<button class="bys-tt-close" onclick="document.getElementById('${BYS_TOOLTIP_ID}').remove()">✕</button>` : ''}
    </div>
    <div class="bys-tt-plain">${clause.plainLanguage}</div>
    ${clause.concerns.length ? `
      <div class="bys-tt-concerns">
        ${clause.concerns.map(c => `<div class="bys-tt-concern">⚠ ${c}</div>`).join('')}
      </div>` : ''}
    <div class="bys-tt-suggestion">
      <span class="bys-tt-suggestion-label">💡 Suggestion</span>
      <div>${clause.suggestion}</div>
    </div>
    <a class="bys-tt-link" href="https://beforeyousign.vercel.app/analyze" target="_blank">
      Full Analysis on BeforeYouSign →
    </a>
  `;

  document.body.appendChild(tooltip);
  activeTooltip = tooltip;

  // Position tooltip near the element
  positionTooltip(tooltip, e.target);

  if (!pinned) {
    tooltip.addEventListener('mouseenter', () => clearTimeout(tooltipTimer));
    tooltip.addEventListener('mouseleave', hideTooltipDelayed);
  }
}

function positionTooltip(tooltip, target) {
  const rect = target.getBoundingClientRect();
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  let top = rect.bottom + scrollY + 8;
  let left = rect.left + scrollX;

  // Don't overflow right edge
  const vw = window.innerWidth;
  if (left + 340 > vw + scrollX) {
    left = vw + scrollX - 350;
  }
  // Don't overflow bottom — flip above
  const vh = window.innerHeight;
  if (top - scrollY + 200 > vh) {
    top = rect.top + scrollY - 210;
  }

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
}

function hideTooltipDelayed() {
  tooltipTimer = setTimeout(() => {
    if (activeTooltip && !activeTooltip.getAttribute('data-pinned')) {
      removeTooltip();
    }
  }, 300);
}

function removeTooltip() {
  const existing = document.getElementById(BYS_TOOLTIP_ID);
  if (existing) existing.remove();
  activeTooltip = null;
}

// ─────────────────────────────────────────────
// PAGE BADGE (floating indicator bottom-right)
// ─────────────────────────────────────────────
function showPageBadge(state, summary = null) {
  const existing = document.getElementById(BYS_BADGE_ID);
  if (existing) existing.remove();

  const badge = document.createElement('div');
  badge.id = BYS_BADGE_ID;

  let content = '';
  let bgColor = '#1c1917';

  if (state === 'analyzing') {
    content = `<span class="bys-badge-spinner"></span> Analyzing contract…`;
    bgColor = '#1c1917';
  } else if (state === 'done' && summary) {
    const { critical, high, medium, total } = summary;
    const hasSerious = critical > 0 || high > 0;
    bgColor = critical > 0 ? '#dc2626' : high > 0 ? '#ea580c' : '#ca8a04';
    content = `
      <span class="bys-badge-logo">⚖</span>
      <span><strong>${total} risk${total !== 1 ? 's' : ''}</strong> found</span>
      ${critical ? `<span class="bys-badge-chip bys-chip-critical">${critical} Critical</span>` : ''}
      ${high ? `<span class="bys-badge-chip bys-chip-high">${high} High</span>` : ''}
      ${medium ? `<span class="bys-badge-chip bys-chip-medium">${medium} Med</span>` : ''}
    `;
  } else if (state === 'safe') {
    bgColor = '#16a34a';
    content = `<span class="bys-badge-logo">⚖</span> <strong>No risks found.</strong> Looks safe!`;
  } else if (state === 'error') {
    bgColor = '#6b7280';
    content = `<span class="bys-badge-logo">⚖</span> BeforeYouSign offline — start the app`;
  }

  badge.innerHTML = content;
  badge.style.cssText = `
    position: fixed !important;
    bottom: 24px !important;
    right: 24px !important;
    background: ${bgColor} !important;
    color: white !important;
    padding: 10px 16px !important;
    border-radius: 999px !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.35) !important;
    z-index: 2147483646 !important;
    cursor: pointer !important;
    max-width: 380px !important;
    animation: bysBadgeIn 0.3s ease !important;
    transition: opacity 0.2s !important;
  `;

  badge.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
  });

  // Auto-hide after 8 seconds for safe/error states
  if (state === 'safe' || state === 'error') {
    setTimeout(() => badge.style.opacity = '0', 7000);
    setTimeout(() => badge.remove(), 7400);
  }

  document.body.appendChild(badge);
}

// ─────────────────────────────────────────────
// MESSAGE LISTENER (from popup / background)
// ─────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'GET_CLAUSES') {
    sendResponse({ clauses: detectedClauses });
  }

  if (msg.type === 'SCROLL_TO_CLAUSE') {
    const span = document.querySelector(`[data-bys-id="${msg.clauseId}"]`);
    if (span) {
      span.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Pulse animation to draw attention
      span.style.transition = 'outline 0.1s';
      span.style.outline = `3px solid ${RISK_COLORS[span.dataset.bysRisk]?.underline || '#dc2626'}`;
      span.style.outlineOffset = '2px';
      setTimeout(() => { span.style.outline = 'none'; }, 1200);
      const clause = detectedClauses.find(c => c.id === msg.clauseId);
      if (clause) {
        setTimeout(() => showTooltip({ target: span }, clause, true), 300);
      }
    }
    sendResponse({ ok: true });
  }

  if (msg.type === 'TOGGLE_HIGHLIGHTS') {
    highlightsEnabled = !highlightsEnabled;
    chrome.storage.local.set({ highlightsEnabled });
    document.querySelectorAll(`.${BYS_CLASS}`).forEach(el => {
      el.style.borderBottom = highlightsEnabled
        ? `2.5px wavy ${RISK_COLORS[el.dataset.bysRisk]?.underline || '#dc2626'}`
        : 'none';
      el.style.background = highlightsEnabled
        ? `${RISK_COLORS[el.dataset.bysRisk]?.bg || '#fee2e2'}`
        : 'transparent';
    });
    sendResponse({ highlightsEnabled });
  }

  if (msg.type === 'REANALYZE') {
    document.querySelectorAll(`.${BYS_CLASS}`).forEach(el => {
      const parent = el.parentNode;
      parent?.replaceChild(document.createTextNode(el.textContent || ''), el);
    });
    detectedClauses = [];
    removeTooltip();
    init();
    sendResponse({ ok: true });
  }

  return true;
});

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
// Wait a moment for dynamic content to load
setTimeout(init, 1500);
