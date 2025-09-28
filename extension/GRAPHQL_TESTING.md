# GraphQL-Based LeetCode Extension - Testing Guide

## 🚀 **What's New**

The extension now uses **LeetCode's GraphQL API** instead of HTML crawling, making it much more reliable and accurate. This approach is based on the [kiing-dom/leetcode-tracker](https://github.com/kiing-dom/leetcode-tracker) implementation.

## 🔧 **How It Works**

1. **GraphQL API**: Fetches problem data directly from LeetCode's GraphQL endpoint
2. **Automatic Detection**: Detects when you're on a LeetCode problem page
3. **Rich Data**: Gets comprehensive problem information including:
   - Problem title and number
   - Difficulty level
   - Problem description
   - Topic tags
   - Like/dislike counts
   - Premium status

## 📋 **Testing Steps**

### **1. Reload the Extension**
```bash
# Build the extension
npm run build:extension
```

1. Go to `chrome://extensions/`
2. Find "LeetCode Tracker" and click **refresh** (🔄)
3. This loads the updated GraphQL-based content script

### **2. Test on LeetCode Problem Page**
1. **Go to any LeetCode problem** (e.g., https://leetcode.com/problems/two-sum/)
2. **Open browser console** (F12 → Console)
3. **Run the test command:**
   ```javascript
   checkLeetCodeStatus()
   ```
4. **Look for output** showing:
   - URL verification
   - GraphQL API calls
   - Extracted problem data

### **3. Test the Side Panel**
1. **Click the LeetCode Tracker icon** in the toolbar
2. **Look for the refresh button** (🔄) in the side panel header
3. **Click the refresh button** to manually trigger detection
4. **Check if "Add This Problem" button appears**

### **4. Test Manual Trigger**
1. **In the LeetCode page console**, run:
   ```javascript
   triggerLeetCodeDetection()
   ```
2. **Check the side panel** for updates

## 🔍 **What to Look For**

### **Console Output (LeetCode Page)**
```
LeetCode Tracker: Content script running on: https://leetcode.com/problems/two-sum/
LeetCode Tracker: Initializing GraphQL-based crawler on LeetCode page
LeetCode Tracker: Fetching problem data via GraphQL API...
LeetCode API: Fetching data for: two-sum
LeetCode API: Successfully fetched data: {questionId: "1", title: "Two Sum", ...}
LeetCode Tracker: Successfully fetched problem data: {...}
```

### **Side Panel Behavior**
- **Green dot + problem title** when problem is detected
- **"Add This Problem" button** appears
- **Pre-filled form** with problem data when clicked

### **Background Script Logs**
1. Go to `chrome://extensions/`
2. Click **"Details"** on LeetCode Tracker
3. Click **"Inspect views: background page"**
4. Look for messages starting with "Background:"

## 🐛 **Troubleshooting**

### **If GraphQL API Fails**
The extension has a **fallback mechanism**:
- Falls back to basic page title extraction
- Still provides basic problem information
- Logs the error for debugging

### **Common Issues**

1. **CORS Errors**: 
   - The GraphQL API should work from content scripts
   - If you see CORS errors, check browser console

2. **Authentication Required**:
   - Some data might require LeetCode login
   - The extension includes CSRF token handling

3. **Rate Limiting**:
   - LeetCode might rate limit requests
   - The extension includes proper headers

### **Debug Commands**

**On LeetCode page console:**
```javascript
// Check current status
checkLeetCodeStatus()

// Manual trigger
triggerLeetCodeDetection()

// Check API instance
window.leetcodeCrawler.api

// Test API directly
const api = new LeetCodeAPI()
api.getCurrentProblemData()
```

## 📊 **Expected Data Structure**

The GraphQL API returns rich data:
```javascript
{
  problemTitle: "Two Sum",
  difficulty: "Easy",
  problemNumber: "1",
  problemUrl: "https://leetcode.com/problems/two-sum/",
  description: "Given an array of integers nums and an integer target...",
  tags: ["Array", "Hash Table"],
  isPaidOnly: false,
  status: null,
  likes: 12345,
  dislikes: 1234,
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

## 🎯 **Success Criteria**

✅ **Extension loads without errors**  
✅ **Content script runs on LeetCode pages**  
✅ **GraphQL API calls succeed**  
✅ **Problem data is extracted correctly**  
✅ **Side panel shows detected problem**  
✅ **"Add This Problem" button works**  
✅ **Form pre-fills with correct data**  

## 🚀 **Next Steps**

1. **Test on different LeetCode problems**
2. **Verify data accuracy**
3. **Test the "Add Problem" functionality**
4. **Check data persistence**
5. **Test on different browsers**

The GraphQL approach should be much more reliable than HTML crawling and provide richer data for your LeetCode tracking!
