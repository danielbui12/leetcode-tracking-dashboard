export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ProblemEntry {
  id: string;
  date: Date;
  duration: number; // in minutes
  difficulty: Difficulty;
  problemTitle: string;
  problemUrl: string;
  redo: Difficulty;
  approach: string;
  notes: string;
  timeComplexity: string; // e.g., "n", "log n", "n^2"
  spaceComplexity: string; // e.g., "1", "n", "n^2"
}

export interface ReminderEntry {
  id: string;
  problemTitle: string;
  problemUrl: string;
  originalDifficulty: Difficulty;
  redoDifficulty: Difficulty;
  daysSinceSolved: number;
  isDue: boolean;
}

export interface TableColumn {
  key: keyof ProblemEntry;
  label: string;
  sortable: boolean;
  width?: string;
}

export interface SortConfig {
  key: keyof ProblemEntry;
  direction: 'asc' | 'desc';
}
