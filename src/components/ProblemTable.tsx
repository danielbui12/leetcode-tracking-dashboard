import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { ProblemEntry, SortConfig } from '../types';
import { format } from 'date-fns';

interface ProblemTableProps {
  problems: ProblemEntry[];
  onUpdate: (id: string, updatedProblem: Partial<ProblemEntry>) => void;
  onDelete: (id: string) => void;
}

const ProblemTable: React.FC<ProblemTableProps> = ({ problems, onUpdate, onDelete }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'date',
    direction: 'desc'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProblemEntry>>({});

  const columns = [
    { key: 'date' as keyof ProblemEntry, label: 'Date', sortable: true, width: 'w-32' },
    { key: 'duration' as keyof ProblemEntry, label: 'Duration (min)', sortable: true, width: 'w-24' },
    { key: 'difficulty' as keyof ProblemEntry, label: 'Difficulty', sortable: true, width: 'w-24' },
    { key: 'problemTitle' as keyof ProblemEntry, label: 'Problem', sortable: true, width: 'w-48' },
    { key: 'redo' as keyof ProblemEntry, label: 'Redo', sortable: true, width: 'w-20' },
    { key: 'approach' as keyof ProblemEntry, label: 'Approach', sortable: false, width: 'w-64' },
    { key: 'notes' as keyof ProblemEntry, label: 'Notes', sortable: false, width: 'w-64' },
    { key: 'timeComplexity' as keyof ProblemEntry, label: 'Time', sortable: true, width: 'w-20' },
    { key: 'spaceComplexity' as keyof ProblemEntry, label: 'Space', sortable: true, width: 'w-20' },
    { key: 'actions' as keyof ProblemEntry, label: 'Actions', sortable: false, width: 'w-24' }
  ];

  const handleSort = (key: keyof ProblemEntry) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedProblems = [...problems].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleEdit = (problem: ProblemEntry) => {
    setEditingId(problem.id);
    setEditForm(problem);
  };

  const handleSave = () => {
    if (editingId && editForm) {
      onUpdate(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width}`}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="hover:text-gray-700"
                    >
                      {sortConfig.key === column.key ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronUp className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedProblems.map((problem) => (
            <tr key={problem.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {editingId === problem.id ? (
                  <input
                    type="date"
                    value={editForm.date && !isNaN(editForm.date.getTime()) ? format(editForm.date, 'yyyy-MM-dd') : ''}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      setEditForm(prev => ({ ...prev, date: isNaN(newDate.getTime()) ? new Date() : newDate }));
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                ) : (
                  problem.date && !isNaN(problem.date.getTime())
                    ? format(problem.date, 'MMM dd, yyyy')
                    : 'Invalid Date'
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {editingId === problem.id ? (
                  <input
                    type="number"
                    value={editForm.duration || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                ) : (
                  problem.duration
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === problem.id ? (
                  <select
                    value={editForm.difficulty || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                )}
              </td>

              <td className="px-6 py-4 text-sm text-gray-900">
                {editingId === problem.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editForm.problemTitle || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, problemTitle: e.target.value }))}
                      placeholder="Problem title"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="url"
                      value={editForm.problemUrl || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, problemUrl: e.target.value }))}
                      placeholder="Problem URL"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{problem.problemTitle}</span>
                    <a
                      href={problem.problemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === problem.id ? (
                  <select
                    value={editForm.redo || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, redo: e.target.value as any }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.redo)}`}>
                    {problem.redo}
                  </span>
                )}
              </td>

              <td className="px-6 py-4 text-sm text-gray-900">
                {editingId === problem.id ? (
                  <textarea
                    value={editForm.approach || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, approach: e.target.value }))}
                    placeholder="Solution approach"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    rows={2}
                  />
                ) : (
                  <div className="max-w-xs truncate" title={problem.approach}>
                    {problem.approach}
                  </div>
                )}
              </td>

              <td className="px-6 py-4 text-sm text-gray-900">
                {editingId === problem.id ? (
                  <textarea
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Notes (Good, Bad, Delta)"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    rows={2}
                  />
                ) : (
                  <div className="max-w-xs truncate" title={problem.notes} dangerouslySetInnerHTML={{
                    __html: problem.notes.replace(/\n/g, "<br/>")
                  }} />
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {editingId === problem.id ? (
                  <input
                    type="text"
                    value={editForm.timeComplexity || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, timeComplexity: e.target.value }))}
                    placeholder="e.g., n, log n"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{
                    __html: problem.timeComplexity.replace(/\n/g, "<br/>")
                  }} />
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {editingId === problem.id ? (
                  <input
                    type="text"
                    value={editForm.spaceComplexity || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, spaceComplexity: e.target.value }))}
                    placeholder="e.g., 1, n, n^2"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                ) : (
                  problem.spaceComplexity
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {editingId === problem.id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="text-green-600 hover:text-green-900"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(problem)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(problem.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {problems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No problems found. Add your first problem to get started!</p>
        </div>
      )}
    </div>
  );
};

export default ProblemTable;
