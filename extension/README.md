# LeetCode Tracker Chrome Extension

A Chrome extension that automatically detects LeetCode problems and allows you to track your progress in a side panel dashboard.

## Features

### 🎯 Automatic Problem Detection
- Automatically detects when you're on a LeetCode problem page
- Crawls problem data including title, difficulty, URL, and description
- Real-time updates as you navigate between problems

### 📊 Side Panel Dashboard
- Clean, compact interface optimized for side panel (400px width)
- View all your tracked problems in a responsive table
- Search and filter problems easily
- Review reminders for problems due for redo

### ⚡ Quick Problem Addition
- **"Add This Problem"** button appears when on LeetCode
- Pre-fills form with crawled problem data
- Only requires you to add approach, complexity, and notes
- **"Manual Input Problem"** for problems not currently viewing

### 💾 Data Persistence
- Uses Chrome storage API for data persistence
- Syncs across browser sessions
- Export/import functionality for backup

## Installation

### Development Installation

1. **Build the extension:**
   ```bash
   npm run build:extension
   ```

2. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `extension` folder from this project

3. **Pin the extension:**
   - Click the extension icon in the toolbar
   - The side panel will open automatically

### Production Installation

1. Build the extension: `npm run build:extension`
2. Package the `extension` folder as a ZIP file
3. Upload to Chrome Web Store (when ready for distribution)

## Usage

### Basic Workflow

1. **Navigate to a LeetCode problem** (e.g., https://leetcode.com/problems/two-sum/)
2. **Open the extension** by clicking the icon in the toolbar
3. **Click "Add This Problem"** - the form will be pre-filled with problem data
4. **Fill in your approach, complexity, and notes**
5. **Click "Add Problem"** to save

### Manual Problem Addition

1. **Click "Manual Input Problem"** in the side panel
2. **Fill in all required fields** manually
3. **Save the problem**

### Managing Problems

- **Search:** Use the search bar to find specific problems
- **Edit:** Click on any field in the table to edit inline
- **Delete:** Click the delete button for any problem
- **Export:** Click the download icon to export all data as CSV
- **Import:** Click the upload icon to import CSV data

## Extension Structure

```
extension/
├── manifest.json              # Extension configuration
├── background/
│   └── background.js          # Service worker for tab monitoring
├── content/
│   └── content.js             # Content script for LeetCode crawling
├── sidepanel/
│   ├── index.extension.html   # Side panel HTML
│   ├── assets/                # Built React app assets
│   └── ...
└── README.md                  # This file
```

## Technical Details

### Content Script (`content/content.js`)
- Runs on LeetCode problem pages
- Uses MutationObserver to detect dynamic content changes
- Extracts problem data using DOM selectors
- Sends data to background script via Chrome messaging

### Background Script (`background/background.js`)
- Service worker that monitors tab changes
- Manages communication between content script and side panel
- Handles side panel opening/closing
- Manages current problem state

### Side Panel (`sidepanel/`)
- Built React dashboard optimized for 400px width
- Uses Chrome storage API for data persistence
- Real-time updates from background script
- Responsive design for narrow panel

### Data Flow

1. **User navigates to LeetCode problem**
2. **Content script detects and crawls data**
3. **Background script receives data and updates state**
4. **Side panel receives update and shows "Add This Problem" button**
5. **User clicks button, form pre-fills with crawled data**
6. **User adds approach/notes and saves to Chrome storage**

## Development

### Building the Extension

```bash
# Build only the extension
npm run build:extension

# Build both dashboard and extension
npm run build:all
```

### File Structure

- `src/App.extension.tsx` - Extension-specific App component
- `src/components/ExtensionHeader.tsx` - Side panel header with problem detection
- `src/utils/extensionStorage.ts` - Chrome storage and messaging utilities
- `src/types/chrome.d.ts` - Chrome API type definitions

### Testing

1. Load the extension in Chrome
2. Navigate to a LeetCode problem
3. Verify the side panel opens and detects the problem
4. Test adding problems with both auto-detection and manual input
5. Verify data persists across browser restarts

## Permissions

The extension requires these permissions:

- `sidePanel` - To open the dashboard in a side panel
- `activeTab` - To read current tab information
- `storage` - To persist problem data
- `tabs` - To monitor tab changes and navigation
- `https://leetcode.com/*` - To access LeetCode pages for crawling

## Browser Compatibility

- Chrome 114+ (for side panel API)
- Edge 114+ (Chromium-based)

## Troubleshooting

### Extension Not Detecting Problems
1. Refresh the LeetCode page
2. Check that the content script is loaded (F12 → Console)
3. Verify the URL matches the pattern in manifest.json

### Side Panel Not Opening
1. Check that the extension is enabled
2. Try clicking the extension icon again
3. Check for errors in the background script (chrome://extensions/ → Details → Inspect views)

### Data Not Persisting
1. Check Chrome storage in DevTools (Application → Storage → Local Storage)
2. Verify the extension has storage permissions
3. Try refreshing the side panel

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
