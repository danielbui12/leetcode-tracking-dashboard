# Service Worker Troubleshooting Guide

## Issue: Service Worker Shows as "Inactive"

If you see "service worker (Inactive)" in the Chrome extension management page, this means the background script isn't running properly.

### Quick Fixes:

1. **Reload the Extension**:
   - Go to `chrome://extensions/`
   - Find "LeetCode Tracker" extension
   - Click the refresh/reload button 🔄
   - The service worker should now show as "Active"

2. **Check Console for Errors**:
   - Click "Inspect views" → "service worker"
   - Look for any error messages in the console
   - Common errors: CORS issues, permission errors, or syntax errors

3. **Test the Extension**:
   - Navigate to any LeetCode problem page (e.g., `https://leetcode.com/problems/two-sum/`)
   - Open the side panel
   - Check if the problem is detected

### Debugging Steps:

1. **Check Service Worker Console**:
   ```
   - Go to chrome://extensions/
   - Click "Inspect views" → "service worker"
   - Look for logs starting with "Background:"
   - Should see "Background: Service worker initialized"
   ```

2. **Test Tab Detection**:
   - Navigate to a LeetCode problem page
   - Check console for: "Background: Tab updated event"
   - Should see: "Background: LeetCode problem page detected"

3. **Test API Calls**:
   - Check console for: "Background: Fetching problem data directly"
   - Should see: "Background: Successfully fetched problem data"

### Common Issues:

1. **CORS Errors**:
   - The extension should have proper permissions in `manifest.json`
   - Check that `host_permissions` includes `https://leetcode.com/*`

2. **Permission Errors**:
   - Ensure all required permissions are in `manifest.json`
   - Check that `tabs`, `activeTab`, `storage` permissions are present

3. **Service Worker Inactivity**:
   - Chrome automatically puts service workers to sleep after 30 seconds of inactivity
   - The extension now includes a keep-alive mechanism
   - If it still goes inactive, try reloading the extension

### Manual Testing:

1. **Open Developer Tools**:
   - Right-click on the extension icon → "Inspect popup"
   - Or go to `chrome://extensions/` → "Inspect views" → "sidepanel/index.html"

2. **Test Manual Detection**:
   - In the side panel, click the refresh button
   - Check console for detection logs

3. **Check Network Requests**:
   - Go to Network tab in DevTools
   - Navigate to a LeetCode page
   - Should see GraphQL requests to `leetcode.com/graphql`

### If Still Not Working:

1. **Check Manifest Permissions**:
   ```json
   {
     "permissions": [
       "sidePanel",
       "activeTab", 
       "storage",
       "tabs",
       "scripting"
     ],
     "host_permissions": [
       "https://leetcode.com/*"
     ]
   }
   ```

2. **Verify Content Script**:
   - Check that `content/content.js` exists
   - Verify it's listed in `content_scripts` in `manifest.json`

3. **Test in Incognito Mode**:
   - Sometimes extensions work differently in incognito
   - Check if the issue persists

4. **Check Chrome Version**:
   - Side Panel API requires Chrome 114+
   - Update Chrome if needed

### Expected Console Output:

When working correctly, you should see:
```
Background: Service worker initialized
Background: Tab updated event: 123 complete https://leetcode.com/problems/two-sum/
Background: LeetCode problem page detected, requesting data
Background: Current tab URL: https://leetcode.com/problems/two-sum/
Background: Extracted slug: two-sum
Background: Fetching problem data directly for slug: two-sum
Background: Successfully fetched problem data directly: {...}
```

If you don't see these logs, the service worker isn't running properly.
