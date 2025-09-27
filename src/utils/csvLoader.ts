import Papa from 'papaparse';
import { ProblemEntry } from '../types';

export interface CSVRow {
  Date: string;
  Duration: string;
  Difficulty: string;
  Problem: string;
  Redo: string;
  Approach: string;
  Notes: string;
  'Time Complexity': string;
  'Space Complexity': string;
}

export const loadCSVData = async (): Promise<ProblemEntry[]> => {
  try {
    // Get the base path from the current location or use default
    const basePath = window.location.pathname.includes('/leetcode-tracking-dashboard/')
      ? '/leetcode-tracking-dashboard'
      : '';
    const csvPath = `${basePath}/data/leetcode-data.csv`;

    console.log('Loading CSV data from', csvPath);

    // Fetch the CSV file from the public directory
    const response = await fetch(csvPath);

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    console.log('CSV data loaded successfully, length:', csvText.length);

    // Use Papa Parse for robust CSV parsing with multi-line support
    const parseResult = Papa.parse<CSVRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      transformHeader: (header: string) => {
        return header.trim()
      },
      delimitersToGuess: [',', '\t', '|', ';']
    });

    const rows = parseResult.data;
    console.log('Processing', rows.length, 'data rows');

    if (parseResult.errors.length > 0) {
      console.warn('CSV parsing errors:', parseResult.errors);
    }

    const problems: ProblemEntry[] = rows.map((row, index) => {
      // Create a basic LeetCode URL from the problem title
      const problemTitle = row.Problem?.trim() || '';
      const problemSlug = problemTitle
        .split('.')[1]
        ?.trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-') || 'unknown';

      const problemUrl = `https://leetcode.com/problems/${problemSlug}/`;

      // Parse date - handle M/D/YYYY format in local timezone
      let date: Date;
      const dateStr = row.Date?.trim() || '';

      if (dateStr.includes('/')) {
        // Handle M/D/YYYY or MM/DD/YYYY format - create date in local timezone
        const [month, day, year] = dateStr.split('/');
        // Use local timezone by creating date with local time
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0);
      } else {
        date = new Date(dateStr);
      }

      // Validate date and fallback to current date if invalid
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date found: "${dateStr}" for problem "${problemTitle}", using current date`);
        date = new Date();
      }

      // Clean up difficulty (remove extra spaces)
      const difficulty = row.Difficulty?.trim() as 'Easy' | 'Medium' | 'Hard' || 'Easy';


      // Handle Redo field - it might be empty or contain difficulty level
      const redoValue = row.Redo?.trim() || '';

      const redo = (redoValue && ['Easy', 'Medium', 'Hard'].includes(redoValue))
        ? redoValue as 'Easy' | 'Medium' | 'Hard'
        : 'Easy'; // Default fallback

      if (row.Problem == "450. Delete Node in a BST") {
        console.log(redo);

      }

      // Parse complexity from a combined field if needed
      let timeComplexity = row['Time Complexity']?.trim() || '';
      let spaceComplexity = row['Space Complexity']?.trim() || '';

      // Handle case where both complexities might be in one field (like "O(N),S(N)")
      if (timeComplexity.includes(',') && !spaceComplexity) {
        const parts = timeComplexity.split(',');
        timeComplexity = parts[0]?.trim() || '';
        spaceComplexity = parts[1]?.trim() || '';
      }

      // Debug for first few entries
      if (index < 3) {
        console.log(`Row ${index} - Papa Parse mapping:`, {
          date: dateStr,
          duration: row.Duration,
          difficulty: row.Difficulty,
          problem: row.Problem,
          redo: row.Redo,
          approach: row.Approach,
          notes: row.Notes,
          timeComplexity: row['Time Complexity'],
          spaceComplexity: row['Space Complexity']
        });
      }

      return {
        id: `csv-${Date.now()}-${index}`,
        date: date,
        duration: parseInt(row.Duration?.trim()) || 0,
        difficulty: difficulty,
        problemTitle: problemTitle,
        problemUrl: problemUrl,
        redo: redo,
        approach: row.Approach?.trim() || '',
        notes: row.Notes?.trim() || '',
        timeComplexity: timeComplexity,
        spaceComplexity: spaceComplexity
      };
    });

    console.log('Successfully parsed', problems.length, 'problems');
    return problems;
  } catch (error) {
    console.error('Failed to load CSV data:', error);
    return [];
  }
};