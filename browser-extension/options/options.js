// Options page JS — save/load settings from chrome.storage.local

const fields = {
  apiBase:      document.getElementById('apiBase'),
  autoAnalyze:  document.getElementById('autoAnalyze'),
  showBadge:    document.getElementById('showBadge'),
  highlightsOn: document.getElementById('highlightsOn'),
};

// Load saved settings
chrome.storage.local.get(['apiBase', 'autoAnalyze', 'showBadge', 'highlightsEnabled'], (stored) => {
  fields.apiBase.value        = stored.apiBase         || 'https://beforeyousign.vercel.app';
  fields.autoAnalyze.checked  = stored.autoAnalyze     !== false;
  fields.showBadge.checked    = stored.showBadge        !== false;
  fields.highlightsOn.checked = stored.highlightsEnabled !== false;
});

// Save
document.getElementById('save').addEventListener('click', () => {
  chrome.storage.local.set({
    apiBase:           fields.apiBase.value.trim() || 'http://localhost:3000',
    autoAnalyze:       fields.autoAnalyze.checked,
    showBadge:         fields.showBadge.checked,
    highlightsEnabled: fields.highlightsOn.checked,
  }, () => {
    const msg = document.getElementById('saved-msg');
    msg.style.display = 'inline';
    setTimeout(() => msg.style.display = 'none', 2000);
  });
});
