import { ProblemEntry, ReminderEntry } from '../types';
import { differenceInDays } from 'date-fns';

export const calculateReminders = (problems: ProblemEntry[]): ReminderEntry[] => {
  const today = new Date();
  const reminders: ReminderEntry[] = [];

  problems.forEach(problem => {
    // trim the hour, minute, second, millisecond
    problem.date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const daysSinceSolved = differenceInDays(today, problem.date);

    let isDue = false;

    // Medium redo: Show if (Today - Problem Date) % 14 == 0 (every 14 days)
    if (problem.redo === 'Medium' && daysSinceSolved > 0 && daysSinceSolved % 14 === 0) {
      isDue = true;
    }

    // Hard redo: Show if (Today - Problem Date) % 7 == 0 (every 7 days)
    if (problem.redo === 'Hard' && daysSinceSolved > 0 && daysSinceSolved % 7 === 0) {
      isDue = true;
    }

    // Easy redo: SKIP (as per requirements)

    if (isDue) {
      reminders.push({
        id: problem.id,
        problemTitle: problem.problemTitle,
        problemUrl: problem.problemUrl,
        originalDifficulty: problem.difficulty,
        redoDifficulty: problem.redo,
        daysSinceSolved,
        isDue
      });
    }
  });

  return reminders.sort((a, b) => b.daysSinceSolved - a.daysSinceSolved);
};
