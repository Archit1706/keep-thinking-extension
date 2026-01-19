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
  private minTriggerDelay = 2500; // Don't trigger for quick responses
  private animationFrameId: number | null = null;

  private selectors: Record<Platform, PlatformSelectors> = {
    chatgpt: {
      stopButton: [
        'button[aria-label="Stop generating"]',
        'button[data-testid="stop-button"]',
        'button[data-testid="fruitjuice-stop-button"]',
      ],
      streamingClass: 'result-streaming',
      responseContainer: 'div[data-message-author-role="assistant"]',
    },
    claude: {
      stopButton: [
        'button[aria-label*="Stop"]',
        'button[aria-label*="Cancel"]',
        'button[title*="Stop"]',
      ],
      sendButtonDisabled: 'button[type="submit"]:disabled',
      loadingIndicator: ['[class*="loading"]', '[class*="thinking"]'],
    },
    gemini: {
      loadingIndicator: [
        '.loading-line',
        '[class*="animate-loading"]',
        '[class*="response-loading"]',
      ],
      stopButton: ['button[aria-label*="Stop"]'],
    },
    deepseek: {
      stopButton: ['button[aria-label*="Stop"]', 'button[title*="Stop"]'],
      streamingClass: 'streaming',
    },
    perplexity: {
      stopButton: ['button[aria-label*="Stop"]'],
      loadingIndicator: ['[class*="loading"]', '[class*="searching"]'],
    },
    generic: {
      stopButton: ['button[aria-label*="Stop"]'],
      loadingIndicator: ['[class*="loading"]'],
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

    return !!(stopBtn || streaming || loading || sendDisabled || extendedThinking);
  }

  private isExtendedThinkingMode(): boolean {
    const thinkingIndicators = [
      '[class*="thinking"]',
      '[aria-label*="Thinking"]',
      '[data-extended="true"]',
      'text()',
    ];
    return thinkingIndicators.some((s) => {
      const elements = document.querySelectorAll(s);
      return Array.from(elements).some((el) =>
        el.textContent?.toLowerCase().includes('thinking')
      );
    });
  }

  private sendMessage(message: ExtensionMessage): void {
    chrome.runtime.sendMessage(message).catch((error) => {
      console.error('[BrainWait] Message send error:', error);
    });
  }

  start(callbacks?: DetectorCallbacks): void {
    const check = () => {
      const nowLoading = this.checkLoadingState();

      if (nowLoading && !this.isLoading) {
        // Loading just started
        this.isLoading = true;
        this.loadingStartTime = Date.now();
        this.puzzleTriggered = false;

        console.log('[BrainWait] Loading started');
        this.sendMessage({ type: 'LOADING_STARTED' });
        callbacks?.onStart?.();
      } else if (!nowLoading && this.isLoading) {
        // Loading just completed
        const duration = Date.now() - (this.loadingStartTime || 0);
        this.isLoading = false;

        console.log('[BrainWait] Loading completed, duration:', duration);
        this.sendMessage({ type: 'LOADING_COMPLETE', payload: { duration } });
        callbacks?.onComplete?.(duration);
      } else if (nowLoading && !this.puzzleTriggered) {
        // Still loading, check if we should trigger puzzle
        const elapsed = Date.now() - (this.loadingStartTime || 0);
        if (elapsed >= this.minTriggerDelay) {
          this.puzzleTriggered = true;

          console.log('[BrainWait] Triggering puzzle after', elapsed, 'ms');
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
  }
}

// Initialize detector when script loads
const detector = new AILoadingDetector();
detector.start();

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
