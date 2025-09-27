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
