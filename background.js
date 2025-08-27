let isEnabled = false; // Global state, OFF by default

// Set initial badge text when extension is installed or Chrome starts
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF'
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  // Next state will always be the opposite
  const nextState = prevState === 'ON' ? 'OFF' : 'ON';

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState
  });

  if (nextState === 'ON') {
    // Inject styles and script into the active tab
    try {
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["style.css"]
      });
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
      chrome.tabs.sendMessage(tab.id, { action: "enable" });
    } catch (err) {
      console.error("Error injecting scripts:", err);
    }
  } else {
    // Tell the active tab's content script to remove the clock
    chrome.tabs.sendMessage(tab.id, { action: "disable" });
  }
});
