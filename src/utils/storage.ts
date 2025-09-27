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
  const csvData = data.map(entry => ({
    Date: entry.date.toISOString().split('T')[0],
    'Duration (minutes)': entry.duration,
    Difficulty: entry.difficulty,
    'Problem Title': entry.problemTitle,
    'Problem URL': entry.problemUrl,
    'Redo Difficulty': entry.redo,
    Approach: entry.approach,
    Notes: entry.notes,
    'Time Complexity': entry.timeComplexity,
    'Space Complexity': entry.spaceComplexity
  }));

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
      complete: (results) => {
        try {
          const data: ProblemEntry[] = results.data.map((row: any, index: number) => ({
            id: `imported-${Date.now()}-${index}`,
            date: new Date(row.Date || new Date()),
            duration: parseInt(row['Duration (minutes)'] || row.Duration) || 0,
            difficulty: (row.Difficulty || 'Easy') as 'Easy' | 'Medium' | 'Hard',
            problemTitle: row['Problem Title'] || row.Problem || '',
            problemUrl: row['Problem URL'] || '',
            redo: (row['Redo Difficulty'] || row.Difficulty || 'Easy') as 'Easy' | 'Medium' | 'Hard',
            approach: row.Approach || '',
            notes: row.Notes || '',
            timeComplexity: row['Time Complexity'] || '',
            spaceComplexity: row['Space Complexity'] || ''
          }));
          
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
