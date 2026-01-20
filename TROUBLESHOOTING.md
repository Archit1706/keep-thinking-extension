# BrainWait - Troubleshooting & Testing Guide

## Quick Fix Applied ✅

**Issue Fixed**: JavaScript error with invalid CSS selector `text()`
**Changes Made**:
- Fixed invalid selector in extended thinking detection
- Improved detection logic with more reliable selectors
- Reduced trigger delay to 1.5 seconds (from 2.5s) for faster activation
- Added comprehensive debug logging
- Added case-insensitive selector matching
- Improved selectors for ChatGPT and Claude

## Testing the Extension

### Step 1: Reload the Extension

1. Go to `chrome://extensions/`
2. Find **BrainWait** in the list
3. Click the **Refresh** icon (circular arrow) on the extension card
4. The extension will reload with the fixes

### Step 2: Verify Content Script is Loaded

1. Go to ChatGPT: https://chat.openai.com or Claude: https://claude.ai
2. Open Chrome DevTools (F12 or right-click → Inspect)
3. Go to the **Console** tab
4. You should see these messages:
   ```
   [BrainWait] 🧩 Content script loaded!
   [BrainWait] URL: https://...
   [BrainWait] Initialized detector for platform: chatgpt
   [BrainWait] Starting detector for platform: chatgpt
   [BrainWait] 💡 Debug tip: Run window.brainwaitDetector.testDetection() to test detection
   ```

If you DON'T see these messages:
- The content script didn't load - check if the URL matches the patterns in manifest.json
- Try refreshing the page after reloading the extension

### Step 3: Test AI Response Detection

#### Method 1: Automatic Test
1. Ask the AI a question (e.g., "Write a short story about a robot")
2. Watch the console for these messages:
   ```
   [BrainWait] 🚀 AI started generating response!
   [BrainWait] 🧩 Triggering puzzle after 1500 ms
   ```
3. The side panel should open after 1.5 seconds

#### Method 2: Manual Test
1. In the DevTools console, run:
   ```javascript
   window.brainwaitDetector.testDetection()
   ```
2. This will test detection RIGHT NOW and show what it finds
3. Try running it WHILE the AI is responding to see it return `true`

### Step 4: Check Extension Settings

1. Click the BrainWait icon in the Chrome toolbar
2. Verify **"Auto-activate puzzles"** is checked (ON)
3. Check that at least one puzzle type is enabled

### Step 5: Test Side Panel Opening

If detection works but side panel doesn't open:

1. Click the BrainWait extension icon
2. Click **"Start a Puzzle"** button
3. If this works but automatic doesn't:
   - Check browser console for errors
   - Check if Side Panel permission is granted

## Common Issues & Solutions

### Issue: "Content script not loaded"

**Symptoms**: No console messages starting with `[BrainWait]`

**Solutions**:
1. Reload the extension in `chrome://extensions/`
2. Refresh the AI chat page
3. Check that you're on a supported site:
   - chat.openai.com or chatgpt.com
   - claude.ai
   - gemini.google.com
   - chat.deepseek.com
   - perplexity.ai

### Issue: "Extension detects but doesn't activate"

**Symptoms**: See "AI started generating" but no puzzle appears

**Solutions**:
1. Check if auto-activation is enabled (extension popup → settings)
2. Check browser console for error messages about Side Panel API
3. Ensure you're using Chrome 114+ (Side Panel API requirement)
4. Try manually opening with "Start a Puzzle" button

### Issue: "Never detects AI responses"

**Symptoms**: No "AI started generating" messages in console

**Solutions**:
1. Run manual test while AI is responding:
   ```javascript
   window.brainwaitDetector.testDetection()
   ```
2. Check what the test reports - it will show which detection methods it tried
3. If it shows `isLoading: false` even when AI is responding:
   - The selectors might be outdated
   - Open an issue with the browser console logs
   - Try a different AI platform to see if detection works there

### Issue: "Triggers too quickly/slowly"

**Solution**: Adjust trigger delay in settings
1. Click extension icon → Settings (gear icon)
2. Adjust "Trigger delay" slider
3. Lower = activates faster, Higher = waits longer

## Debug Commands

Run these in the browser console (DevTools → Console):

### Check if detector is running
```javascript
window.brainwaitDetector
```
Should return the detector object

### Manually test detection RIGHT NOW
```javascript
window.brainwaitDetector.testDetection()
```
Returns `true` if AI is currently detected as loading

### Get current platform
```javascript
window.brainwaitDetector.platform
```
Returns: 'chatgpt', 'claude', 'gemini', etc.

### Check if currently tracking
```javascript
window.brainwaitDetector.isLoading
```
Returns `true` if the detector thinks AI is currently generating

## Logging

The extension now has comprehensive logging. Watch the console for:

- 🧩 Content script loaded
- 🚀 AI started generating response
- ✅ AI finished responding
- 🧩 Triggering puzzle after X ms

Each message includes relevant details for debugging.

## Still Having Issues?

### Collect Debug Information

1. Open DevTools Console (F12)
2. Reproduce the issue
3. Copy ALL console messages starting with `[BrainWait]`
4. Note:
   - Which AI platform (ChatGPT, Claude, etc.)
   - What you expected to happen
   - What actually happened
   - Any error messages

### Check Extension Status

Run this in the console to get full status:
```javascript
console.log({
  detectorLoaded: typeof window.brainwaitDetector !== 'undefined',
  platform: window.brainwaitDetector?.platform,
  currentlyLoading: window.brainwaitDetector?.isLoading,
  testNow: window.brainwaitDetector?.testDetection(),
});
```

### Report an Issue

If the extension still doesn't work:
1. Include the debug information above
2. Include your Chrome version (chrome://version/)
3. Include the AI platform and URL
4. Include any error messages from the console
5. Open an issue on GitHub

## Testing Checklist

Use this checklist to verify everything works:

- [ ] Extension loads in Chrome (visible in chrome://extensions/)
- [ ] Content script loads on AI chat pages (see console messages)
- [ ] Manual detection test works (`window.brainwaitDetector.testDetection()`)
- [ ] Detector finds AI when it's responding (test returns `true`)
- [ ] Extension triggers after 1.5 seconds of AI generation
- [ ] Side panel opens with a puzzle
- [ ] Can solve puzzles and see stats
- [ ] Settings can be changed and persist
- [ ] Extension icon shows statistics

If all checks pass, the extension is working correctly! 🎉

---

**Note**: The extension checks for AI responses every 250ms, so there may be a slight delay in detection. This is normal and helps reduce CPU usage.
