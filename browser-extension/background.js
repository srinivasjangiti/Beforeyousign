/**
 * BeforeYouSign Background Service Worker (MV3)
 * Manages state, relay messages between popup and content scripts
 */

// Store analysis results per tab
const tabData = new Map();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'ANALYSIS_COMPLETE') {
    if (sender.tab?.id) {
      tabData.set(sender.tab.id, msg.data);
      // Update the extension badge with risk count
      const { critical, high, total } = msg.data.riskSummary;
      const badgeText = total > 0 ? String(total) : '';
      const badgeColor = critical > 0 ? '#dc2626' : high > 0 ? '#ea580c' : '#ca8a04';
      chrome.action.setBadgeText({ text: badgeText, tabId: sender.tab.id });
      chrome.action.setBadgeBackgroundColor({ color: badgeColor, tabId: sender.tab.id });
    }
  }

  if (msg.type === 'GET_TAB_DATA') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      const data = tabId ? tabData.get(tabId) : null;
      sendResponse({ data });
    });
    return true; // async
  }

  if (msg.type === 'OPEN_POPUP') {
    chrome.action.openPopup?.();
  }

  if (msg.type === 'REQUEST_REANALYZE') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId) {
        chrome.tabs.sendMessage(tabId, { type: 'REANALYZE' }, sendResponse);
      }
    });
    return true;
  }

  if (msg.type === 'TOGGLE_HIGHLIGHTS') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId) {
        chrome.tabs.sendMessage(tabId, { type: 'TOGGLE_HIGHLIGHTS' }, sendResponse);
      }
    });
    return true;
  }
});

// Clear data when tab navigates away
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    tabData.delete(tabId);
    chrome.action.setBadgeText({ text: '', tabId });
  }
});

// Context menu: "Analyze this page with BeforeYouSign"
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'bys-analyze',
    title: 'Analyze contract with BeforeYouSign',
    contexts: ['page', 'selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'bys-analyze' && tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'REANALYZE' });
  }
});

// Keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'analyze-page' || command === 'toggle-highlights') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId) {
        const type = command === 'analyze-page' ? 'REANALYZE' : 'TOGGLE_HIGHLIGHTS';
        chrome.tabs.sendMessage(tabId, { type });
      }
    });
  }
});
