# LeetCode Tracking Dashboard - Project Requirements

Help me build a comprehensive LeetCode problem tracking dashboard using **Vite.js with React**.

## Core Features

### 1. Problem Table
Create a data table with the following columns:

| Column | Type | Description |
|--------|------|-------------|
| **Date** | DateTime | When the problem was solved |
| **Duration** | Number | Time spent solving (in minutes) |
| **Difficulty** | Select | Dropdown: Easy, Medium, Hard |
| **Problem** | Text + Link | Problem title with embedded link to LeetCode |
| **Redo** | Select | Dropdown: Easy, Medium, Hard (difficulty for review) |
| **Approach** | Text | Solution approach/strategy used |
| **Notes** | Text | Good, Bad, Delta format for reflection |
| **Time Complexity** | Number | Display as O(n), O(log n), etc. |
| **Space Complexity** | Number | Display as S(n), S(1), etc. |

**Default Sorting:** Date column in descending order (newest first)

### 2. CRUD Operations
- **Add:** Button to add new problem entry
- **Edit:** Inline or modal editing for existing entries
- **Delete:** Option to remove entries (optional but recommended)

### 3. Smart Reminder System
Display a reminder section above the table that shows problems due for review based on:

- **Easy Redo:**  SKIP
- **Medium Redo:** Show if `(Today - Problem Date) % 7 == 0` (weekly review)
- **Hard Redo:** Show if `(Today - Problem Date) % 4 == 0` (every 4 days)

### 4. Data Management
- **Export:** Button to export all data to CSV format
- **Import:** Button to import data from CSV file
- **Local Storage:** Persist data between sessions

## Technical Preferences

### UI/UX Requirements
- Clean, modern interface
- Responsive design (mobile-friendly)
- Use a component library like **Tailwind CSS** or **Material-UI**
- Sortable table columns
- Search/filter functionality (bonus)

### Data Structure
```javascript
// Example problem entry
{
  id: string,
  date: Date,
  duration: number,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  problemTitle: string,
  problemUrl: string,
  redo: 'Easy' | 'Medium' | 'Hard',
  approach: string,
  notes: string,
  timeComplexity: string, // e.g., "n", "log n", "n^2"
  spaceComplexity: string // e.g., "1", "n", "n^2"
}
```

### Additional Features (Nice to Have)
- Statistics dashboard (total problems solved, difficulty breakdown)
- Progress charts
- Dark/light theme toggle
- Problem categories/tags
- Streak tracking

## Implementation Notes
- Use React hooks for state management
- Implement proper form validation
- Handle edge cases for date calculations
- Ensure CSV import/export maintains data integrity
- Add loading states and error handling

Please create a fully functional dashboard with sample data and provide setup instructions.
# LeetCode Tracking Chrome Extension - Direct Dashboard Integration Plan

Help me build a Chrome extension that uses my existing Vite+React dashboard directly as a side panel without any layout modifications, just adding smart extension functionality on top of the current dashboard.

## Core Strategy: Zero Dashboard Changes

### 1. Direct Dashboard Reuse Approach

#### Leverage Existing Build System
- **Use Current `dist/` Output**: Copy built dashboard directly to extension
- **No UI Modifications**: Keep existing dashboard layout, components, and styling
- **Context-Aware Enhancement**: Add extension features through runtime detection
- **Single Source of Truth**: Maintain one dashboard codebase for both web and extension

#### Extension Architecture Philosophy
- **Minimal Invasive**: Extension functionality added through hooks and context
- **Progressive Enhancement**: Dashboard works perfectly standalone, enhanced when in extension
- **Smart Detection**: Automatically detect extension environment and enable features
- **Seamless Integration**: Users see familiar dashboard with bonus extension capabilities

### 2. Extension Structure Requirements

#### Simple Extension Folder Structure
```
extension/
├── manifest.json              # Chrome extension configuration
├── background.js             # LeetCode page detection service worker
├── content.js               # Problem data extraction from LeetCode pages
├── sidepanel/               # EXACT COPY of your dist/ folder
│   └── [all files from dist/]
└── icons/                   # Extension store icons
```

#### Build Process Integration
- **Automated Copy**: Script to copy `dist/` to `extension/sidepanel/`
- **Version Sync**: Keep extension version aligned with dashboard version
- **Single Build Command**: `npm run build && npm run build:extension`
- **Development Workflow**: Changes to dashboard automatically reflect in extension

### 3. Dashboard Enhancement Strategy

#### Runtime Context Detection
- **Environment Awareness**: Dashboard detects when running in Chrome extension side panel
- **Chrome API Availability**: Check for `chrome.runtime`, `chrome.storage`, `chrome.tabs`
- **Feature Toggling**: Enable extension-specific features only when APIs available
- **Graceful Degradation**: Full functionality maintained when not in extension

#### Smart Header Enhancement
- **Conditional Button Addition**: Add extension buttons only when in side panel context
- **Current Problem Detection**: Show "Add This Problem" when LeetCode page detected
- **Auto-Fill Integration**: Pre-populate forms with detected problem data
- **Manual Fallback**: Always provide manual input option

#### Extension-Specific Features
- **Real-Time Problem Detection**: Monitor active browser tab for LeetCode problems
- **One-Click Addition**: Add detected problem with single button click
- **Auto-Data Population**: Extract title, difficulty, URL, description automatically
- **Chrome Storage Integration**: Seamlessly sync data using Chrome storage APIs

### 4. User Experience Goals

#### Seamless Dashboard Experience
- **Identical Interface**: Dashboard looks and behaves exactly the same
- **Enhanced Functionality**: Additional convenience features when in extension
- **No Learning Curve**: Existing users immediately understand new features
- **Consistent Data**: Same data accessible from web dashboard and extension

#### Extension-Specific Workflows
- **Automatic Detection Flow**:
  1. User browses to LeetCode problem page
  2. Extension detects problem automatically
  3. Dashboard shows "Add This Problem" button
  4. One click adds problem with pre-filled data
  5. User only needs to add personal notes/timing

- **Manual Input Flow**:
  1. User clicks existing "Add Problem" button (renamed to "Manual Input")
  2. Standard form appears as usual
  3. All existing functionality preserved

#### Smart Integration Benefits
- **Reduced Data Entry**: Auto-extract problem details from LeetCode pages
- **Faster Workflow**: Side panel always accessible while browsing
- **Context Awareness**: Dashboard knows what problem user is currently viewing
- **Persistent Interface**: Side panel stays open across tab navigation

### 5. Technical Implementation Approach

#### Minimal Dashboard Code Changes
- **Add Extension Detection Hook**: Single hook to detect Chrome extension context
- **Enhance Existing Header**: Add conditional buttons to current header component
- **Chrome Storage Wrapper**: Utility to use Chrome storage when available, fallback to localStorage
- **Message Handling**: Listen for problem data from content script

#### Extension Scripts Responsibilities
- **Background Script**: Monitor tab changes, detect LeetCode problem pages
- **Content Script**: Extract problem data from LeetCode DOM
- **Message Passing**: Send problem data to dashboard in side panel
- **Storage Management**: Handle data persistence through Chrome APIs

#### Build System Integration
- **Extension Build Target**: New npm script to build extension package
- **Asset Optimization**: Ensure dashboard assets work in extension context
- **Manifest Generation**: Automated manifest.json creation with proper permissions
- **Development Mode**: Support for extension development and testing

### 6. Extension Capabilities

#### LeetCode Problem Detection
- **URL Pattern Matching**: Detect LeetCode problem pages automatically
- **DOM Data Extraction**: Parse problem title, difficulty, description, constraints
- **Dynamic Page Handling**: Work with LeetCode's SPA navigation
- **Error Handling**: Graceful fallback when page structure changes

#### Chrome Integration Features
- **Side Panel API**: Native Chrome side panel integration
- **Tab Monitoring**: Real-time detection of active tab changes
- **Storage Sync**: Cross-device data synchronization
- **Minimal Permissions**: Only request necessary Chrome permissions

#### Data Flow Architecture
- **Bidirectional Sync**: Changes in extension reflect in web dashboard
- **Conflict Resolution**: Handle simultaneous edits gracefully
- **Offline Support**: Queue operations when Chrome APIs unavailable
- **Export Compatibility**: Maintain existing export/import functionality

### 7. Development and Deployment Strategy

#### Development Workflow
- **Local Extension Testing**: Load unpacked extension for development
- **Hot Reload Support**: Dashboard changes immediately visible in extension
- **Debug Integration**: Chrome DevTools for extension debugging
- **Automated Testing**: Ensure extension features don't break dashboard

#### Deployment Process
- **Web Dashboard**: Continue existing deployment process unchanged
- **Extension Package**: Automated build process for Chrome Web Store submission
- **Version Management**: Coordinate releases between web and extension
- **User Migration**: Seamless transition for existing dashboard users

#### Quality Assurance
- **Cross-Environment Testing**: Ensure dashboard works in both web and extension
- **Performance Monitoring**: Extension doesn't impact dashboard performance
- **User Acceptance Testing**: Validate enhanced workflow efficiency
- **Compatibility Testing**: Support across Chrome versions and updates

### 8. Success Criteria

#### User Experience Metrics
- **Adoption Rate**: Percentage of existing users who install extension
- **Usage Frequency**: How often extension features are used vs manual input
- **Time Savings**: Reduction in time to add new problems to tracking
- **User Satisfaction**: Feedback on enhanced workflow convenience

#### Technical Performance Goals
- **Load Time**: Extension side panel loads as fast as web dashboard
- **Memory Usage**: Minimal additional memory footprint
- **Reliability**: 99%+ success rate for problem detection and data extraction
- **Compatibility**: Works across all supported LeetCode page layouts

#### Business Impact Objectives
- **Increased Engagement**: More frequent dashboard usage through convenience
- **User Retention**: Reduced churn through enhanced user experience
- **Feature Utilization**: Higher percentage of problems tracked consistently
- **Organic Growth**: Users recommend extension to other developers

### 9. Risk Mitigation

#### Technical Risks
- **LeetCode Layout Changes**: Content script may break with site updates
- **Chrome API Changes**: Extension may need updates for new Chrome versions
- **Performance Impact**: Ensure extension doesn't slow down dashboard
- **Data Consistency**: Prevent sync issues between web and extension

#### User Experience Risks
- **Feature Confusion**: Clearly distinguish extension-enhanced features
- **Migration Complexity**: Ensure smooth transition for existing users
- **Browser Compatibility**: Plan for potential Firefox/Safari versions
- **Privacy Concerns**: Transparent about data handling and permissions

### 10. Future Enhancement Opportunities

#### Advanced Features
- **Multiple Platform Support**: Extend to HackerRank, CodeForces, etc.
- **Smart Reminders**: Notification system for review scheduling
- **Progress Analytics**: Enhanced insights when used as extension
- **Team Features**: Shared tracking for coding interview preparation groups

#### Integration Possibilities
- **IDE Extensions**: VS Code extension for seamless coding workflow
- **Calendar Integration**: Automatic scheduling of practice sessions
- **Social Features**: Share progress with study groups or mentors
- **AI Assistance**: Smart problem recommendations based on tracking data

Please help me implement this Chrome extension that seamlessly enhances my existing dashboard with LeetCode problem detection and one-click addition capabilities, while maintaining the current dashboard architecture and user experience completely unchanged.