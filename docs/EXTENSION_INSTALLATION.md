# LeetCode Tracker Extension - Installation Guide

## Quick Start

### 1. Build the Extension
```bash
npm run build:extension
```

### 2. Load in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top right)
3. Click **"Load unpacked"**
4. Select the `extension` folder from this project
5. The extension should now appear in your extensions list

### 3. Pin the Extension
1. Click the **puzzle piece icon** in Chrome toolbar
2. Find "LeetCode Tracker" and click the **pin icon**
3. The extension icon will now be visible in your toolbar

### 4. Test the Extension
1. Go to any LeetCode problem (e.g., https://leetcode.com/problems/two-sum/)
2. Click the **LeetCode Tracker icon** in your toolbar
3. The side panel should open and show "Add This Problem" button
4. Click the button to see the pre-filled form

## Features Overview

### 🎯 Automatic Problem Detection
- When you're on a LeetCode problem page, the extension automatically detects it
- Shows a green indicator and the problem title in the side panel header
- Pre-fills the "Add Problem" form with crawled data

### 📊 Side Panel Dashboard
- Compact interface designed for the side panel (400px width)
- View all your tracked problems in a searchable table
- Review reminders for problems due for redo
- Export/import functionality

### ⚡ Quick Actions
- **"Add This Problem"** - Pre-fills form with current LeetCode problem
- **"Manual Input Problem"** - Add any problem manually
- **Search** - Find problems by title, approach, or notes
- **Export/Import** - Backup and restore your data

## Usage Tips

1. **Keep the side panel open** while solving LeetCode problems
2. **Add problems immediately** after solving them
3. **Use the review reminders** to track which problems need redo
4. **Export your data regularly** as a backup

## Troubleshooting

### "Side panel file path must exist" Error
- **Solution:** Rebuild the extension: `npm run build:extension`
- This error occurs when the side panel HTML file is missing or incorrectly named

### Extension Not Working
- Make sure Developer mode is enabled
- Try refreshing the LeetCode page
- Check the extension is enabled in chrome://extensions/

### Side Panel Not Opening
- Click the extension icon in the toolbar
- Try right-clicking the icon and selecting "Open side panel"

### Problem Not Detected
- Refresh the LeetCode page
- Make sure you're on a problem page (URL contains `/problems/`)
- Check browser console for errors (F12)

### For More Help
- See `extension/TROUBLESHOOTING.md` for detailed troubleshooting steps
- Check browser console for specific error messages

## Next Steps

1. **Start tracking problems** - Add your first LeetCode problem
2. **Set up review reminders** - Configure redo difficulty for each problem
3. **Export your data** - Create a backup of your progress
4. **Share feedback** - Let us know how the extension works for you!

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Look at the browser console for error messages
3. Verify the extension is properly loaded and enabled
4. Try reloading the extension or restarting Chrome
