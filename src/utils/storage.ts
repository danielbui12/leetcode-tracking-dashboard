import Papa from 'papaparse';
import { ProblemEntry } from '../types';

const STORAGE_KEY = 'leetcode-tracking-data';

export const saveToLocalStorage = (data: ProblemEntry[]): void => {
  try {
    const serializedData = JSON.stringify(data.map(entry => ({
      ...entry,
      date: entry.date.toISOString()
    })));
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
};

export const loadFromLocalStorage = (): ProblemEntry[] => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (!serializedData) return [];

    const data = JSON.parse(serializedData);
    return data.map((entry: any) => ({
      ...entry,
      date: new Date(entry.date)
    }));
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return [];
  }
};

export const exportToCSV = (data: ProblemEntry[]): void => {
  // Convert data to CSV format using Papa Parse
  const csvData = data.map(entry => {
    // Format date as M/D/YYYY to match the CSV format
    const date = new Date(entry.date);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

    return {
      Date: formattedDate,
      Duration: entry.duration,
      Difficulty: entry.difficulty,
      Problem: entry.problemTitle,
      Redo: entry.redo,
      Approach: entry.approach,
      Notes: entry.notes,
      'Time Complexity': entry.timeComplexity,
      'Space Complexity': entry.spaceComplexity
    };
  });

  const csvContent = Papa.unparse(csvData);

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `leetcode-tracking-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importFromCSV = (file: File): Promise<ProblemEntry[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      transformHeader: (header: string) => {
        return header.trim()
      },
      delimitersToGuess: [',', '\t', '|', ';'],
      complete: (results) => {
        try {
          const rows = results.data;
          console.log('Importing', rows.length, 'data rows');

          if (results.errors.length > 0) {
            console.warn('CSV parsing errors:', results.errors);
          }

          const data: ProblemEntry[] = rows.map((row: any, index: number) => {
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

            // Parse complexity from a combined field if needed
            let timeComplexity = row['Time Complexity']?.trim() || '';
            let spaceComplexity = row['Space Complexity']?.trim() || '';

            // Handle case where both complexities might be in one field (like "O(N),S(N)")
            if (timeComplexity.includes(',') && !spaceComplexity) {
              const parts = timeComplexity.split(',');
              timeComplexity = parts[0]?.trim() || '';
              spaceComplexity = parts[1]?.trim() || '';
            }

            return {
              id: `imported-${Date.now()}-${index}`,
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

          console.log('Successfully imported', data.length, 'problems');
          resolve(data);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      }
    });
  });
};
