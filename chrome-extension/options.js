const DEFAULT_URL = 'http://localhost:5173';

function normalizeUrl(value) {
  if (!value || typeof value !== 'string') return DEFAULT_URL;
  return value.trim().replace(/\/$/, '') || DEFAULT_URL;
}

async function load() {
  const { skillQuestAppUrl } = await chrome.storage.sync.get(['skillQuestAppUrl']);
  document.getElementById('urlInput').value = normalizeUrl(skillQuestAppUrl);
}

async function save() {
  const value = normalizeUrl(document.getElementById('urlInput').value);
  await chrome.storage.sync.set({ skillQuestAppUrl: value });
  document.getElementById('status').textContent = `Saved: ${value}`;
}

document.getElementById('saveBtn').addEventListener('click', save);
load();
