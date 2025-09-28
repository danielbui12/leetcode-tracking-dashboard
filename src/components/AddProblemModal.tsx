import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ProblemEntry } from '../types';

interface AddProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (problem: Omit<ProblemEntry, 'id'>) => void;
  currentProblem?: any;
}

const AddProblemModal: React.FC<AddProblemModalProps> = ({ isOpen, onClose, onAdd, currentProblem }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: 0,
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    problemTitle: '',
    problemUrl: '',
    redo: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    approach: '',
    notes: '',
    timeComplexity: '',
    spaceComplexity: ''
  });

  // Pre-fill form when currentProblem changes
  useEffect(() => {
    if (currentProblem && isOpen) {
      setFormData(prev => ({
        ...prev,
        problemTitle: currentProblem.problemTitle || '',
        problemUrl: currentProblem.problemUrl || '',
        difficulty: currentProblem.difficulty || 'Easy',
        notes: currentProblem.description || ''
      }));
    }
  }, [currentProblem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.problemTitle.trim() || !formData.problemUrl.trim()) {
      alert('Please fill in the problem title and URL');
      return;
    }

    onAdd({
      ...formData,
      date: new Date(formData.date)
    });

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      duration: 0,
      difficulty: 'Easy',
      problemTitle: '',
      problemUrl: '',
      redo: 'Easy',
      approach: '',
      notes: '',
      timeComplexity: '',
      spaceComplexity: ''
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Problem</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-leetcode-green focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-leetcode-green focus:border-transparent"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-leetcode-green focus:border-transparent"
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Redo Difficulty *
              </label>
              <select
                value={formData.redo}
                onChange={(e) => handleChange('redo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-leetcode-green focus:border-transparent"
                required
              >
                <option value="Easy">Easy - No need to redo</option>
                <option value="Medium">Medium - Redo every 7 days</option>
                <option value="Hard">Hard - Redo every 4 days</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Problem Title *
            </label>
            <input
              type="text"
              value={formData.problemTitle}
              onChange={(e) => handleChange('problemTitle', e.target.value)}
              placeholder="e.g., 1. Two Sum"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-leetcode-green focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Problem URL *
            </label>
            <input
              type="url"
              value={formData.problemUrl}
              onChange={(e) => handleChange('problemUrl', e.target.value)}
              placeholder="https://leetcode.com/problems/two-sum/"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-leetcode-green focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Approach
            </label>
            <textarea
              value={formData.approach}
              onChange={(e) => handleChange('approach', e.target.value)}
              placeholder="Describe your solution approach..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-leetcode-green focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Good, Bad, Delta)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Good: What went well. Bad: What could be improved. Delta: What to do differently next time."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-leetcode-green focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Complexity
              </label>
              <textarea
                value={formData.timeComplexity}
                onChange={(e) => handleChange('timeComplexity', e.target.value)}
                placeholder="e.g., O(n), O(log n), O(n^2)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-leetcode-green focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Space Complexity
              </label>
              <textarea
                value={formData.spaceComplexity}
                onChange={(e) => handleChange('spaceComplexity', e.target.value)}
                placeholder="e.g., S(1), S(n), S(n^2)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-leetcode-green focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-leetcode-green rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-leetcode-green"
            >
              Add Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProblemModal;
