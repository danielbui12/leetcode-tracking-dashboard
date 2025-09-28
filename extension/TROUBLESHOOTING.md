# Extension Troubleshooting Guide

## Common Issues and Solutions

### 1. "Side panel file path must exist" Error

**Problem:** Chrome shows error "Side panel file path must exist"

**Solution:**
1. Make sure you've built the extension: `npm run build:extension`
2. Verify the file structure:
   ```
   extension/
   ├── manifest.json
   ├── background/
   │   └── background.js
   ├── content/
   │   └── content.js
   └── sidepanel/
       ├── index.html          ← This file must exist
       └── assets/
           ├── main-*.css
           └── main-*.js
   ```
3. If `sidepanel/index.html` is missing, rebuild the extension

### 2. Extension Not Detecting LeetCode Problems

**Problem:** Side panel shows "Navigate to LeetCode problem" even when on LeetCode

**Solutions:**
1. **Refresh the LeetCode page** - Content script needs to reload
2. **Check URL format** - Must be `https://leetcode.com/problems/*`
3. **Check browser console** (F12) for errors
4. **Verify content script is loaded:**
   - Go to `chrome://extensions/`
   - Click "Details" on LeetCode Tracker
   - Click "Inspect views: background page"
   - Check console for errors

### 3. Side Panel Not Opening

**Problem:** Clicking extension icon doesn't open side panel

**Solutions:**
1. **Check extension is enabled** in `chrome://extensions/`
2. **Try right-clicking** the extension icon → "Open side panel"
3. **Check for errors** in background script console
4. **Restart Chrome** if needed

### 4. Data Not Persisting

**Problem:** Problems disappear after closing/reopening side panel

**Solutions:**
1. **Check Chrome storage permissions** in manifest.json
2. **Verify storage in DevTools:**
   - F12 → Application → Storage → Local Storage
   - Look for `chrome-extension://[id]/` entries
3. **Check for storage errors** in console

### 5. Build Issues

**Problem:** `npm run build:extension` fails

**Solutions:**
1. **Clear node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. **Check TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```
3. **Check Vite build:**
   ```bash
   npx vite build --config vite.extension.config.ts
   ```

### 6. Content Script Not Loading

**Problem:** LeetCode pages don't trigger problem detection

**Solutions:**
1. **Check manifest.json** - URL pattern must match exactly
2. **Verify content script file exists** at `extension/content/content.js`
3. **Check for JavaScript errors** in LeetCode page console
4. **Try reloading the extension** in `chrome://extensions/`

## Debug Steps

### 1. Check Extension Status
- Go to `chrome://extensions/`
- Ensure "Developer mode" is ON
- Verify LeetCode Tracker is enabled
- Check for any error messages

### 2. Check Console Logs
- **Background script:** Extension details → Inspect views: background page
- **Content script:** LeetCode page → F12 → Console
- **Side panel:** Side panel → F12 → Console

### 3. Verify File Structure
```bash
ls -la extension/
ls -la extension/sidepanel/
ls -la extension/sidepanel/assets/
```

### 4. Test Content Script Manually
1. Go to any LeetCode problem page
2. Open browser console (F12)
3. Type: `window.leetcodeCrawler`
4. Should return the crawler object

### 5. Test Storage
1. Open side panel
2. Add a test problem
3. Check Chrome storage in DevTools
4. Should see `leetcode-problems` key with data

## Still Having Issues?

1. **Check Chrome version** - Requires Chrome 114+ for side panel API
2. **Try incognito mode** - Disable other extensions
3. **Check for conflicts** - Disable other LeetCode-related extensions
4. **Restart Chrome completely**
5. **Rebuild extension from scratch:**
   ```bash
   rm -rf extension/sidepanel
   npm run build:extension
   ```

## Getting Help

If you're still having issues:
1. Check the browser console for specific error messages
2. Verify your Chrome version is 114 or higher
3. Make sure you're following the installation steps exactly
4. Try the debug steps above
