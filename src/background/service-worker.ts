import type { ExtensionMessage, PuzzleType } from '../types';
import { storage, DEFAULT_SETTINGS } from '../lib/storage';

console.log('[BrainWait] Service worker started');

// Initialize default settings on installation
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[BrainWait] Extension installed:', details.reason);

  if (details.reason === 'install') {
    await storage.setSettings(DEFAULT_SETTINGS);
    await storage.setProgress({
      totalPuzzlesSolved: 0,
      streakDays: 0,
      lastPlayedDate: new Date().toISOString(),
      difficultyHistory: [],
      puzzleStats: {
        riddle: { attempted: 0, solved: 0, averageTime: 0 },
        quickMath: { attempted: 0, solved: 0, averageTime: 0 },
        wordAnagram: { attempted: 0, solved: 0, averageTime: 0 },
        wordLadder: { attempted: 0, solved: 0, averageTime: 0 },
        patternRecognition: { attempted: 0, solved: 0, averageTime: 0 },
      },
    });

    console.log('[BrainWait] Default settings and progress initialized');
  }
});

// Handle messages from content scripts and UI
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender) => {
  console.log('[BrainWait] Received message:', message.type, 'from:', sender.tab?.id);

  switch (message.type) {
    case 'LOADING_STARTED':
      handleLoadingStarted(sender);
      break;

    case 'LOADING_COMPLETE':
      handleLoadingComplete(message.payload);
      break;

    case 'TRIGGER_PUZZLE':
      handleTriggerPuzzle(sender);
      break;

    case 'PUZZLE_COMPLETED':
      handlePuzzleCompleted(message.payload);
      break;

    case 'PUZZLE_ABANDONED':
      handlePuzzleAbandoned(message.payload);
      break;

    case 'UPDATE_SETTINGS':
      handleUpdateSettings(message.payload);
      break;

    case 'OPEN_SIDE_PANEL':
      handleOpenSidePanel(sender);
      break;

    case 'CLOSE_SIDE_PANEL':
      handleCloseSidePanel(sender);
      break;
  }

  return true; // Keep message channel open for async responses
});

async function handleLoadingStarted(sender: chrome.runtime.MessageSender): Promise<void> {
  console.log('[BrainWait] AI loading started on tab:', sender.tab?.id);
  // Could update badge or icon here
}

async function handleLoadingComplete(payload: any): Promise<void> {
  console.log('[BrainWait] AI loading completed, duration:', payload?.duration);
  // Could close side panel if puzzle was not engaged
}

async function handleTriggerPuzzle(sender: chrome.runtime.MessageSender): Promise<void> {
  const settings = await storage.getSettings();

  if (!settings.autoActivation) {
    console.log('[BrainWait] Auto-activation disabled, skipping puzzle');
    return;
  }

  const tabId = sender.tab?.id;
  if (!tabId) {
    console.error('[BrainWait] No tab ID found');
    return;
  }

  console.log('[BrainWait] Opening side panel for tab:', tabId);

  try {
    // Open side panel for the specific tab
    await chrome.sidePanel.open({ tabId });
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'sidepanel.html',
      enabled: true,
    });

    // Update badge to show active state
    await chrome.action.setBadgeText({ text: '🧩', tabId });
    await chrome.action.setBadgeBackgroundColor({ color: '#4CAF50', tabId });
  } catch (error) {
    console.error('[BrainWait] Error opening side panel:', error);
  }
}

async function handlePuzzleCompleted(payload: any): Promise<void> {
  console.log('[BrainWait] Puzzle completed:', payload);

  const progress = await storage.getProgress();
  const puzzleType = payload.puzzleType as PuzzleType;
  const timeSpent = payload.timeSpent as number;

  // Update stats
  progress.totalPuzzlesSolved++;
  if (puzzleType && progress.puzzleStats[puzzleType]) {
    const stats = progress.puzzleStats[puzzleType];
    stats.attempted++;
    stats.solved++;
    stats.averageTime =
      (stats.averageTime * (stats.solved - 1) + timeSpent) / stats.solved;
  }

  // Update streak
  const today = new Date().toISOString().split('T')[0];
  const lastPlayed = new Date(progress.lastPlayedDate).toISOString().split('T')[0];

  if (today !== lastPlayed) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastPlayed === yesterday) {
      progress.streakDays++;
    } else {
      progress.streakDays = 1;
    }
    progress.lastPlayedDate = new Date().toISOString();
  }

  await storage.setProgress(progress);
  await storage.setCurrentSession(null);

  console.log('[BrainWait] Progress updated, streak:', progress.streakDays);
}

async function handlePuzzleAbandoned(payload: any): Promise<void> {
  console.log('[BrainWait] Puzzle abandoned:', payload);

  const progress = await storage.getProgress();
  const puzzleType = payload.puzzleType as PuzzleType;

  // Update attempted count
  if (puzzleType && progress.puzzleStats[puzzleType]) {
    progress.puzzleStats[puzzleType].attempted++;
  }

  await storage.setProgress(progress);
  await storage.setCurrentSession(null);
}

async function handleUpdateSettings(payload: any): Promise<void> {
  console.log('[BrainWait] Updating settings:', payload);
  const currentSettings = await storage.getSettings();
  const newSettings = { ...currentSettings, ...payload };
  await storage.setSettings(newSettings);

  // Broadcast settings update to all content scripts
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'UPDATE_SETTINGS',
        payload: newSettings,
      }).catch(() => {
        // Ignore errors for tabs without content script
      });
    }
  }
}

async function handleOpenSidePanel(sender: chrome.runtime.MessageSender): Promise<void> {
  const tabId = sender.tab?.id;
  if (tabId) {
    await chrome.sidePanel.open({ tabId });
  }
}

async function handleCloseSidePanel(sender: chrome.runtime.MessageSender): Promise<void> {
  const tabId = sender.tab?.id;
  if (tabId) {
    await chrome.action.setBadgeText({ text: '', tabId });
  }
}

// Keep service worker alive by periodically checking storage
setInterval(() => {
  storage.getSettings().catch(() => {
    // Ignore errors, just keeping worker alive
  });
}, 20000);
