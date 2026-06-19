/**
 * BeforeYouSign Popup Script
 * Drives the extension popup UI
 */

const RISK_COLORS = {
  critical: '#dc2626',
  high:     '#ea580c',
  medium:   '#ca8a04',
  low:      '#16a34a',
};

const CATEGORY_ICONS = {
  indemnification: '⚖️', non_compete: '🚫', ip_transfer: '💡',
  auto_renewal: '🔄', termination: '📋', arbitration: '🏛️',
  amendment: '✏️', liability: '⚠️', penalty: '💸',
  confidentiality: '🔒', payment: '💵', general: '📄',
};

// DOM refs
const states = {
  idle:      document.getElementById('state-idle'),
  analyzing: document.getElementById('state-analyzing'),
  results:   document.getElementById('state-results'),
  safe:      document.getElementById('state-safe'),
};
const gaugeScore   = document.getElementById('gauge-score');
const gaugeLabel   = document.getElementById('gauge-label');
const gaugeFill    = document.getElementById('gauge-fill');
const gaugeNeedle  = document.getElementById('gauge-needle');
const statRow      = document.getElementById('stat-row');
const summaryText  = document.getElementById('summary-text');
const issueList    = document.getElementById('issue-list');
const btnToggle    = document.getElementById('btn-toggle');
const btnReanalyze = document.getElementById('btn-reanalyze');
const btnSettings  = document.getElementById('btn-settings');

function showState(name) {
  Object.values(states).forEach(el => el?.classList.add('hidden'));
  states[name]?.classList.remove('hidden');
}

// ─────── Load data ───────
async function loadData() {
  showState('analyzing');

  const response = await new Promise(resolve => {
    chrome.runtime.sendMessage({ type: 'GET_TAB_DATA' }, resolve);
  });

  if (!response || !response.data) {
    // No stored data, check if content script has something
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (!tabId) { showState('idle'); return; }

      chrome.tabs.sendMessage(tabId, { type: 'GET_CLAUSES' }, (res) => {
        if (chrome.runtime.lastError || !res || !res.clauses || res.clauses.length === 0) {
          showState('idle');
          return;
        }
        renderResults(res.clauses, computeSummary(res.clauses));
      });
    });
    return;
  }

  const { clauses, riskSummary } = response.data;
  if (!clauses || clauses.length === 0) {
    showState('safe');
    return;
  }
  renderResults(clauses, riskSummary);
}

function computeSummary(clauses) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0, total: clauses.length };
  clauses.forEach(c => counts[c.riskLevel]++);
  const weights = { critical: 40, high: 20, medium: 8, low: 2 };
  counts.overallRisk = Math.min(100, clauses.reduce((s, c) => s + (weights[c.riskLevel] || 0), 0));
  return counts;
}

// ─────── Render ───────
function renderResults(clauses, summary) {
  showState('results');

  // Gauge
  const score = summary.overallRisk || 0;
  gaugeScore.textContent = score;
  gaugeScore.style.color = score >= 70 ? RISK_COLORS.critical
    : score >= 40 ? RISK_COLORS.high
    : score >= 20 ? RISK_COLORS.medium : RISK_COLORS.low;

  gaugeLabel.textContent = score >= 70 ? 'High Risk Contract'
    : score >= 40 ? 'Moderate Risk'
    : score >= 10 ? 'Low Risk' : 'Minimal Risk';

  // Animate gauge arc (SVG stroke-dashoffset: 141.4 = full arc)
  const fillPct = score / 100;
  const offset = 141.4 - (141.4 * fillPct);
  gaugeFill.style.strokeDashoffset = String(offset);
  gaugeFill.style.stroke = score >= 70 ? RISK_COLORS.critical
    : score >= 40 ? RISK_COLORS.high
    : score >= 20 ? RISK_COLORS.medium : RISK_COLORS.low;

  // Needle rotation: -90° (left) to +90° (right), proportional to score
  const needleAngle = -90 + (score / 100) * 180;
  gaugeNeedle.setAttribute('transform', `rotate(${needleAngle} 50 50)`);

  // Stat chips
  statRow.innerHTML = '';
  const levels = ['critical', 'high', 'medium', 'low'];
  levels.forEach(level => {
    const count = summary[level] || 0;
    if (count === 0) return;
    const chip = document.createElement('div');
    chip.className = `stat-chip stat-chip-${level}`;
    chip.innerHTML = `<span class="stat-chip-dot"></span>${count} ${level.charAt(0).toUpperCase() + level.slice(1)}`;
    statRow.appendChild(chip);
  });

  // Summary
  summaryText.textContent = `${summary.total} clause${summary.total !== 1 ? 's' : ''} analyzed · ${summary.critical || 0} critical · ${summary.high || 0} high risk`;

  // Issue list
  issueList.innerHTML = '';
  const sorted = [...clauses].sort((a, b) => {
    const p = { critical: 4, high: 3, medium: 2, low: 1 };
    return (p[b.riskLevel] || 0) - (p[a.riskLevel] || 0);
  });

  sorted.forEach(clause => {
    const card = document.createElement('div');
    card.className = `issue-card issue-card-${clause.riskLevel}`;
    const icon = CATEGORY_ICONS[clause.category] || '📄';
    card.innerHTML = `
      <div class="issue-row">
        <span class="issue-badge issue-badge-${clause.riskLevel}">${clause.riskLevel}</span>
        <span class="issue-category">${icon} ${(clause.category || 'general').replace(/_/g, ' ')}</span>
      </div>
      <div class="issue-plain">${clause.plainLanguage}</div>
    `;
    card.addEventListener('click', () => scrollToClause(clause.id));
    issueList.appendChild(card);
  });
}

// ─────── Scroll to clause in page ───────
function scrollToClause(clauseId) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'SCROLL_TO_CLAUSE', clauseId });
  });
}

// ─────── Buttons ───────
btnToggle?.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'TOGGLE_HIGHLIGHTS' }, (res) => {
    if (res?.highlightsEnabled === false) {
      btnToggle.style.opacity = '0.4';
      btnToggle.title = 'Highlights hidden (click to show)';
    } else {
      btnToggle.style.opacity = '1';
      btnToggle.title = 'Toggle highlights';
    }
  });
});

btnReanalyze?.addEventListener('click', () => {
  showState('analyzing');
  chrome.runtime.sendMessage({ type: 'REQUEST_REANALYZE' }, () => {
    setTimeout(loadData, 4000);
  });
});

btnSettings?.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// ─────── Init ───────
loadData();
