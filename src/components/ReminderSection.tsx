import React from 'react';
import { AlertCircle, Check, ExternalLink, X } from 'lucide-react';
import { ReminderEntry } from '../types';

interface ReminderSectionProps {
  reminders: ReminderEntry[];
  onMarkAsRedone: (problemId: string) => void;
  onNoNeedToRedo: (problemId: string) => void;
}

const ReminderSection: React.FC<ReminderSectionProps> = ({ reminders, onMarkAsRedone, onNoNeedToRedo }) => {
  if (reminders.length === 0) {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-leetcode-green bg-green-100';
      case 'Medium':
        return 'text-leetcode-orange bg-orange-100';
      case 'Hard':
        return 'text-leetcode-red bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="mb-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              Problems Due for Review ({reminders.length})
            </h3>
            <div className="text-xs text-yellow-800 mb-4 bg-gradient-to-r from-yellow-100 to-amber-100 p-3 rounded-lg border border-yellow-200 shadow-sm">
              <div className="font-semibold mb-2 text-yellow-900 flex items-center">
                <span className="mr-2">📅</span>
                Review Schedule
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-3 bg-white p-2 rounded-md border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></span>
                    <span className="font-medium text-gray-800">Redo = Hard</span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-700">
                    <span className="text-lg">→</span>
                    <span className="font-bold">7 days</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white p-2 rounded-md border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-orange-500 rounded-full shadow-sm"></span>
                    <span className="font-medium text-gray-800">Redo = Medium</span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-700">
                    <span className="text-lg">→</span>
                    <span className="font-bold">14 days</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-yellow-700 text-xs leading-relaxed">
                <span className="font-medium">💡 Explanation:</span> Problems marked as "Hard" to redo need more frequent review (every 7 days) to master the concepts, while "Medium" difficulty problems can be reviewed less frequently (every 14 days) as they're easier to retain.
              </div>
            </div>
            <div className="space-y-2">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between bg-white p-3 rounded border"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                        reminder.redoDifficulty
                      )}`}
                    >
                      {reminder.redoDifficulty}
                    </span>
                    <span className="text-sm text-gray-900 font-medium">
                      {reminder.problemTitle}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({reminder.daysSinceSolved} days ago)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={reminder.problemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Review
                    </a>
                    <button
                      onClick={() => onMarkAsRedone(reminder.id)}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Mark as Redone
                    </button>
                    <button
                      onClick={() => onNoNeedToRedo(reminder.id)}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <X className="h-3 w-3 mr-1" />
                      No need to redo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderSection;
