const MENU_ID = 'open-skillquest-ai';
const DEFAULT_URL = 'http://localhost:5173';

function normalizeUrl(value) {
  if (!value || typeof value !== 'string') return DEFAULT_URL;
  return value.trim().replace(/\/$/, '') || DEFAULT_URL;
}

async function getAppUrl() {
  const { skillQuestAppUrl } = await chrome.storage.sync.get(['skillQuestAppUrl']);
  return normalizeUrl(skillQuestAppUrl);
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: 'Open SkillQuest AI',
    contexts: ['action']
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === MENU_ID) {
    const url = await getAppUrl();
    chrome.tabs.create({ url });
  }
});
