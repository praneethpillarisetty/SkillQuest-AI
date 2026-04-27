const DEFAULT_URL = 'http://localhost:5173';

function normalizeUrl(value) {
  if (!value || typeof value !== 'string') return DEFAULT_URL;
  return value.trim().replace(/\/$/, '') || DEFAULT_URL;
}

async function getAppUrl() {
  const { skillQuestAppUrl } = await chrome.storage.sync.get(['skillQuestAppUrl']);
  return normalizeUrl(skillQuestAppUrl);
}

(async () => {
  const url = await getAppUrl();
  const frame = document.getElementById('appFrame');
  const hint = document.getElementById('urlHint');

  hint.textContent = `Connected to: ${url}`;
  frame.src = url;

  document.getElementById('openTabBtn').addEventListener('click', () => {
    chrome.tabs.create({ url });
  });

  document.getElementById('optionsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
})();
