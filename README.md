# LeetCode Tracking Dashboard

A comprehensive dashboard for tracking LeetCode problem solving progress with smart reminders and data management features.

## Features

### ✅ Core Features
- **Problem Table**: Sortable data table with all required columns (Date, Duration, Difficulty, Problem, Redo, Approach, Notes, Time/Space Complexity)
- **CRUD Operations**: Add, edit, and delete problem entries with inline editing
- **Smart Reminder System**: Automatic reminders for problems due for review based on difficulty:
  - Medium Redo: Every 7 days
  - Hard Redo: Every 4 days
  - Easy Redo: Every 14 days (bonus feature)
- **Data Management**: 
  - Local storage persistence
  - CSV export/import functionality
- **Search & Filter**: Real-time search across problem titles, approaches, and notes
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### 🎨 UI/UX Features
- Clean, modern interface with LeetCode-inspired color scheme
- Sortable table columns with visual indicators
- Inline editing with form validation
- Modal for adding new problems
- Responsive design for all screen sizes
- Loading states and error handling

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Package Manager**: pnpm

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd leetcode-tracking
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm build
# or
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Adding Problems
1. Click the "Add Problem" button in the header
2. Fill in the required fields (marked with *)
3. Add optional details like approach, notes, and complexity
4. Click "Add Problem" to save

### Editing Problems
1. Click the edit icon (pencil) in the Actions column
2. Modify the fields inline
3. Click "Save" to confirm or "Cancel" to discard changes

### Managing Data
- **Export**: Click "Export CSV" to download all data
- **Import**: Click "Import CSV" to upload previously exported data
- **Search**: Use the search bar to filter problems by title, approach, or notes

### Smart Reminders
The dashboard automatically shows problems due for review in the yellow reminder section at the top. Click "Review" to open the problem on LeetCode.

## Data Structure

Each problem entry contains:
- **Date**: When the problem was solved
- **Duration**: Time spent in minutes
- **Difficulty**: Easy, Medium, or Hard
- **Problem**: Title and LeetCode URL
- **Redo**: Difficulty level for review
- **Approach**: Solution strategy used
- **Notes**: Good/Bad/Delta reflection format
- **Time Complexity**: Big O notation (e.g., O(n), O(log n))
- **Space Complexity**: Space complexity notation (e.g., O(1), O(n))

## Sample Data

The application comes with sample data to help you get started. You can clear it by deleting all entries or start fresh with your own problems.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

If you encounter any issues or have feature requests, please open an issue on GitHub.
