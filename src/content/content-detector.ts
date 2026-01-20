import type { Platform, PlatformSelectors, DetectorCallbacks, ExtensionMessage } from '../types';

/**
 * AI Loading Detector
 * Monitors AI chat platforms for "thinking" states and triggers puzzles
 */
class AILoadingDetector {
  private platform: Platform;
  private isLoading = false;
  private loadingStartTime: number | null = null;
  private puzzleTriggered = false;
  private minTriggerDelay = 1500; // Don't trigger for quick responses (reduced for better responsiveness)
  private animationFrameId: number | null = null;
  private lastCheckTime = 0;
  private checkInterval = 250; // Check every 250ms instead of every frame

  private selectors: Record<Platform, PlatformSelectors> = {
    chatgpt: {
      stopButton: [
        'button[aria-label="Stop generating"]',
        'button[aria-label*="Stop"]',
        'button[data-testid="stop-button"]',
        'button[data-testid="fruitjuice-stop-button"]',
        'button:has(svg):not([disabled])', // Stop button usually has an SVG icon
      ],
      streamingClass: 'result-streaming',
      responseContainer: 'div[data-message-author-role="assistant"]',
      sendButtonDisabled: 'button[data-testid="send-button"]:disabled, button[data-testid="fruitjuice-send-button"]:disabled',
    },
    claude: {
      stopButton: [
        'button[aria-label*="Stop" i]',
        'button[aria-label*="Cancel" i]',
        'button[title*="Stop" i]',
        'button.stop-button',
      ],
      sendButtonDisabled: 'button[type="submit"]:disabled, form button[disabled]',
      loadingIndicator: ['[class*="loading" i]', '[class*="thinking" i]', '[class*="generating" i]'],
    },
    gemini: {
      loadingIndicator: [
        '.loading-line',
        '[class*="animate-loading" i]',
        '[class*="response-loading" i]',
        '[class*="generating" i]',
      ],
      stopButton: ['button[aria-label*="Stop" i]'],
      sendButtonDisabled: 'button[disabled]',
    },
    deepseek: {
      stopButton: ['button[aria-label*="Stop" i]', 'button[title*="Stop" i]'],
      streamingClass: 'streaming',
      sendButtonDisabled: 'button[type="submit"]:disabled',
    },
    perplexity: {
      stopButton: ['button[aria-label*="Stop" i]'],
      loadingIndicator: ['[class*="loading" i]', '[class*="searching" i]'],
      sendButtonDisabled: 'button[disabled]',
    },
    generic: {
      stopButton: ['button[aria-label*="Stop" i]'],
      loadingIndicator: ['[class*="loading" i]'],
      sendButtonDisabled: 'button:disabled',
    },
  };

  constructor() {
    this.platform = this.detectPlatform();
    console.log('[BrainWait] Initialized detector for platform:', this.platform);
  }

  private detectPlatform(): Platform {
    const url = window.location.hostname;
    if (url.includes('chatgpt') || url.includes('openai')) return 'chatgpt';
    if (url.includes('claude')) return 'claude';
    if (url.includes('gemini')) return 'gemini';
    if (url.includes('deepseek')) return 'deepseek';
    if (url.includes('perplexity')) return 'perplexity';
    return 'generic';
  }

  private checkLoadingState(): boolean {
    const sel = this.selectors[this.platform];

    // Check stop button presence
    const stopBtn = sel.stopButton?.some((s) => document.querySelector(s));

    // Check streaming class
    const streaming = sel.streamingClass && document.querySelector(`.${sel.streamingClass}`);

    // Check loading indicators
    const loading = sel.loadingIndicator?.some((s) => document.querySelector(s));

    // Check disabled send button
    const sendDisabled = sel.sendButtonDisabled && document.querySelector(sel.sendButtonDisabled);

    // Extended thinking mode detection
    const extendedThinking = this.isExtendedThinkingMode();

    const isLoading = !!(stopBtn || streaming || loading || sendDisabled || extendedThinking);

    // Debug logging (only log state changes to avoid spam)
    if (isLoading !== this.isLoading) {
      console.log('[BrainWait] Detection state change:', {
        platform: this.platform,
        stopBtn: !!stopBtn,
        streaming: !!streaming,
        loading: !!loading,
        sendDisabled: !!sendDisabled,
        extendedThinking: !!extendedThinking,
        result: isLoading,
      });
    }

    return isLoading;
  }

  private isExtendedThinkingMode(): boolean {
    // Check for elements with thinking-related classes or attributes
    const thinkingIndicators = [
      '[class*="thinking" i]',
      '[aria-label*="Thinking" i]',
      '[data-extended="true"]',
    ];

    for (const selector of thinkingIndicators) {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          return true;
        }
      } catch (e) {
        // Ignore selector errors
      }
    }

    // Also check for visible text containing "thinking"
    const body = document.body;
    if (body && body.textContent?.toLowerCase().includes('thinking')) {
      // Make sure it's in a visible element
      const allElements = document.querySelectorAll('div, span, p');
      for (const el of Array.from(allElements)) {
        const text = el.textContent?.toLowerCase() || '';
        if (text.includes('thinking') && text.length < 100) {
          // Short text containing "thinking" is likely a status indicator
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            return true;
          }
        }
      }
    }

    return false;
  }

  private sendMessage(message: ExtensionMessage): void {
    chrome.runtime.sendMessage(message).catch((error) => {
      console.error('[BrainWait] Message send error:', error);
    });
  }

  start(callbacks?: DetectorCallbacks): void {
    console.log('[BrainWait] Starting detector for platform:', this.platform);

    const check = () => {
      const now = Date.now();

      // Throttle checks to reduce CPU usage
      if (now - this.lastCheckTime < this.checkInterval) {
        this.animationFrameId = requestAnimationFrame(check);
        return;
      }
      this.lastCheckTime = now;

      const nowLoading = this.checkLoadingState();

      if (nowLoading && !this.isLoading) {
        // Loading just started
        this.isLoading = true;
        this.loadingStartTime = Date.now();
        this.puzzleTriggered = false;

        console.log('[BrainWait] 🚀 AI started generating response!');
        this.sendMessage({ type: 'LOADING_STARTED' });
        callbacks?.onStart?.();
      } else if (!nowLoading && this.isLoading) {
        // Loading just completed
        const duration = Date.now() - (this.loadingStartTime || 0);
        this.isLoading = false;

        console.log('[BrainWait] ✅ AI finished responding, duration:', duration, 'ms');
        this.sendMessage({ type: 'LOADING_COMPLETE', payload: { duration } });
        callbacks?.onComplete?.(duration);
      } else if (nowLoading && !this.puzzleTriggered) {
        // Still loading, check if we should trigger puzzle
        const elapsed = Date.now() - (this.loadingStartTime || 0);
        if (elapsed >= this.minTriggerDelay) {
          this.puzzleTriggered = true;

          console.log('[BrainWait] 🧩 Triggering puzzle after', elapsed, 'ms');
          this.sendMessage({ type: 'TRIGGER_PUZZLE' });
          callbacks?.onTriggerPuzzle?.();
        }
      }

      // Continue checking
      this.animationFrameId = requestAnimationFrame(check);
    };

    check();
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  updateMinTriggerDelay(delay: number): void {
    this.minTriggerDelay = delay;
    console.log('[BrainWait] Updated trigger delay to:', delay, 'ms');
  }

  // Debug method to manually test detection
  testDetection(): boolean {
    const state = this.checkLoadingState();
    console.log('[BrainWait] Manual detection test:', {
      platform: this.platform,
      isLoading: state,
      currentlyTracking: this.isLoading,
    });
    return state;
  }
}

// Initialize detector when script loads
console.log('[BrainWait] 🧩 Content script loaded!');
console.log('[BrainWait] URL:', window.location.href);

const detector = new AILoadingDetector();
detector.start();

// Expose detector to window for debugging
(window as any).brainwaitDetector = detector;
console.log('[BrainWait] 💡 Debug tip: Run window.brainwaitDetector.testDetection() to test detection');

// Handle visibility changes - pause when tab is hidden to save battery
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('[BrainWait] Tab hidden, pausing detector');
    detector.stop();
  } else {
    console.log('[BrainWait] Tab visible, resuming detector');
    detector.start();
  }
});

// Listen for settings updates
chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
  if (message.type === 'UPDATE_SETTINGS' && message.payload?.triggerDelay) {
    detector.updateMinTriggerDelay(message.payload.triggerDelay);
  }
});
