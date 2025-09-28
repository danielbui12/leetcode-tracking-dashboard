# LeetCode Tracking Chrome Extension - Side Panel Dashboard

Help me build a comprehensive LeetCode problem tracking Chrome extension that opens as a **side panel** with the integrated Vite.js + React dashboard as the main interface.

## Project Architecture

### 1. Extension Structure (Side Panel Focused)
- **Side Panel Dashboard**: Main interface using existing Vite+React dashboard
- **Content Script**: Vanilla JS to crawl LeetCode problem data
- **Background Script**: Service worker for data management and side panel communication
- **No Popup**: Extension opens directly as side panel

### 2. Side Panel Integration Strategy

#### Primary Approach: Built Dashboard in Side Panel
- Build existing Vite+React dashboard to static files
- Include `dist/` folder as `sidepanel/` in extension
- Open dashboard via Chrome Side Panel API
- Enhanced with extension-specific features

#### Side Panel Specifications
- **Width**: 400-500px (Chrome's side panel standard)
- **Height**: Full browser height
- **Persistent**: Stays open across tab navigation
- **Responsive**: Adapts to different panel widths

## Core Features

### 3. Side Panel Dashboard (Enhanced Vite+React App)

#### Header Section (Always Visible)
- **Extension Title**: "LeetCode Tracker"
- **Current Status Indicator**:
  - "LeetCode problem detected" + problem title
  - "Navigate to LeetCode problem"
  - "Loading problem data..."

#### Primary Action Buttons (Header)
- **"Add This Problem" Button** (Main CTA)
  - Only visible when on LeetCode problem page
  - Auto-fills form with crawled data
  - Opens quick-add modal/section
  - Prominent styling (primary button)

- **"Manual Input Problem" Button** (Secondary)
  - Always visible
  - Opens full problem entry form
  - For adding problems not currently viewing
  - Secondary styling

- **Settings/Export** (Icon buttons)
  - Export data to CSV
  - Extension settings
  - Theme toggle

#### Dashboard Content Areas
1. **Quick Add Section** (Collapsible)
   - Shows when "Add This Problem" clicked
   - Pre-filled form with crawled data
   - Manual input fields: Duration, Complexity, Notes

2. **Problems Table** (Main content)
   - Enhanced version of existing dashboard
   - Optimized for narrow side panel width
   - Collapsible columns for mobile-like experience

3. **Review Reminders** (Top section)
   - Persistent reminder cards
   - Problems due for review today
   - Quick action buttons

### 4. Enhanced Dashboard Features

#### Side Panel Optimized UI
- **Narrow Layout**: Stack elements vertically
- **Collapsible Sections**: Accordion-style organization
- **Sticky Header**: Actions always accessible
- **Responsive Tables**: Horizontal scroll or card view
- **Compact Forms**: Optimized for narrow width

#### Real-time Problem Detection
- **Tab Change Detection**: Update status when switching tabs
- **Auto-refresh**: Detect when navigating to new LeetCode problem
- **Live Status Updates**: Show current problem info in header
- **Smart Notifications**: Subtle indicators for new problems

### 5. Data Flow & Communication

#### Extension to Dashboard Communication
```javascript
// Background script listens for tab changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (isLeetCodeProblem(tab.url)) {
    // Send message to side panel
    chrome.runtime.sendMessage({
      type: 'LEETCODE_DETECTED',
      problemData: crawledData
    });
  }
});
```

#### Dashboard State Management
- **Extension Context**: Detect when running as side panel vs standalone
- **Tab Awareness**: Know which tab user is currently viewing
- **Auto-sync**: Real-time updates from content script
- **Offline Support**: Queue actions when content script unavailable

### 6. Enhanced Problem Addition Workflow

#### "Add This Problem" Flow
1. **Auto-detection**: Content script crawls current LeetCode page
2. **Data Pre-fill**: Problem title, URL, difficulty auto-populated
3. **Quick Form**: Only manual fields shown (Duration, Complexity, Notes)
4. **One-click Add**: Minimal user input required
5. **Success Feedback**: Confirmation + table update

#### "Manual Input Problem" Flow
1. **Full Form**: All fields available for manual entry
2. **Smart Suggestions**: Autocomplete for problem titles
3. **URL Validation**: Check if LeetCode URL is valid
4. **Bulk Import**: Option to add multiple problems

#### Form Enhancements
- **Smart Defaults**: Remember user's common complexity choices
- **Quick Templates**: Pre-defined approaches (Two Pointers, DFS, etc.)
- **Validation**: Real-time form validation
- **Keyboard Shortcuts**: Tab navigation, Enter to submit

### 7. Side Panel Specific Features

#### Panel Management
- **Auto-open**: Open side panel when extension icon clicked
- **Persistent State**: Remember panel open/closed preference
- **Window Integration**: Works with multiple browser windows
- **Focus Management**: Proper keyboard navigation

#### Enhanced Navigation
- **Breadcrumbs**: Show current section/filter
- **Quick Filters**: Easy access to problem categories
- **Search Integration**: Search problems while viewing
- **Scroll Memory**: Remember scroll position

#### Multi-tab Awareness
- **Tab Switching**: Update content based on active tab
- **Problem Context**: Show which tab contains detected problem
- **Cross-tab Actions**: Add problems from any LeetCode tab

### 8. Extension Configuration

#### Manifest.json (Side Panel)
```json
{
  "manifest_version": 3,
  "name": "LeetCode Tracker",
  "version": "1.0",
  "description": "Track LeetCode progress in side panel",
  
  "permissions": [
    "sidePanel",
    "activeTab",
    "storage",
    "tabs"
  ],
  
  "host_permissions": [
    "https://leetcode.com/*"
  ],
  
  "action": {
    "default_title": "Open LeetCode Tracker"
  },
  
  "side_panel": {
    "default_path": "sidepanel/index.html"
  },
  
  "content_scripts": [{
    "matches": ["https://leetcode.com/problems/*"],
    "js": ["content/content.js"]
  }],
  
  "background": {
    "service_worker": "background/background.js"
  }
}
```

#### Required Permissions
- **sidePanel**: Chrome Side Panel API access
- **activeTab**: Read current tab information
- **storage**: Chrome storage for data persistence
- **tabs**: Monitor tab changes and navigation

### 9. Dashboard Integration Requirements

#### Vite+React Dashboard Modifications
- **Extension Detection**: Detect when running in side panel context
- **Narrow Layout**: Responsive design for 400-500px width
- **Extension APIs**: Access Chrome storage and messaging APIs
- **Enhanced Header**: Add extension-specific action buttons

#### Data Synchronization
- **Real-time Updates**: Live sync with content script
- **Chrome Storage**: Seamless data persistence
- **Cross-session**: Maintain state across browser restarts
- **Conflict Resolution**: Handle simultaneous edits

### 10. User Experience Enhancements

#### Side Panel UX
- **Smooth Animations**: Slide-in/out transitions
- **Loading States**: Skeleton screens while loading
- **Error Boundaries**: Graceful error handling
- **Accessibility**: Full keyboard navigation support

#### Visual Design
- **Consistent Branding**: Match LeetCode color scheme
- **Clear Hierarchy**: Prominent CTAs, secondary actions
- **Status Colors**: Green (detected), Gray (not detected), Blue (loading)
- **Compact Design**: Maximize information density

#### Performance Optimization
- **Lazy Loading**: Load table data on demand
- **Virtual Scrolling**: Handle large problem lists
- **Debounced Updates**: Efficient real-time sync
- **Memory Management**: Clean up listeners and subscriptions

### 11. Advanced Features

#### Smart Problem Detection
- **URL Pattern Matching**: Detect various LeetCode URL formats
- **Dynamic Content**: Handle SPA navigation
- **Problem Variants**: Detect premium, contest problems
- **Multi-language**: Support different LeetCode domains

#### Enhanced Analytics
- **Usage Tracking**: Side panel open time, interactions
- **Problem Patterns**: Most added difficulties, topics
- **Review Success**: Track redo completion rates
- **Performance Metrics**: Solving time trends

#### Integration Features
- **Browser Bookmarks**: Sync with LeetCode bookmarks
- **Calendar Integration**: Schedule review sessions
- **Export Options**: Multiple formats (CSV, JSON, PDF)
- **Sharing**: Share progress with study groups

### 12. Development & Testing

#### Build Process
- **Dual Build**: Extension build + Dashboard build
- **Asset Optimization**: Minimize bundle size for extension
- **Source Maps**: Debug support in development
- **Hot Reload**: Development experience improvements

#### Testing Strategy
- **Side Panel Testing**: Various browser window sizes
- **Content Script Testing**: Different LeetCode page layouts
- **Storage Testing**: Data persistence and sync
- **Cross-browser**: Chrome, Edge compatibility

#### Deployment
- **Chrome Web Store**: Extension submission process
- **Version Coordination**: Sync extension and dashboard versions
- **User Migration**: Handle updates gracefully
- **Analytics**: Track adoption and usage patterns

## Success Metrics
- **Panel Usage**: Time spent in side panel
- **Problem Addition**: Success rate of auto-detection
- **User Retention**: Daily/weekly active users
- **Review Completion**: Redo system effectiveness

Please create a fully functional Chrome extension with side panel integration, enhanced dashboard with extension-specific features, and seamless LeetCode problem detection and addition workflow.