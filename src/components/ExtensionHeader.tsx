import { useState } from 'react';
import { Search, Plus, Download, Upload, Settings, RefreshCw } from 'lucide-react';

interface ExtensionHeaderProps {
  currentProblem: any;
  onAddCurrentProblem: () => void;
  onAddClick: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  dataSource: 'csv' | 'saved';
  onManualTrigger?: () => void;
}

export default function ExtensionHeader({
  currentProblem,
  onAddCurrentProblem,
  onAddClick,
  onExport,
  onImport,
  searchTerm,
  onSearchChange,
  dataSource,
  onManualTrigger
}: ExtensionHeaderProps) {
  const [showImport, setShowImport] = useState(false);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      setShowImport(false);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 py-3">
        {/* Extension Title and Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold text-gray-900">LeetCode Tracker</h1>
            <span className="text-xs text-gray-500">Extension</span>
          </div>

          {/* Current Problem Status */}
          <div className="flex items-center space-x-2">
            {currentProblem ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 truncate max-w-32">
                  {currentProblem.problemTitle}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-500">Navigate to LeetCode problem</span>
              </div>
            )}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex space-x-2 mb-3">
          {currentProblem ? (
            <button
              onClick={onAddCurrentProblem}
              className="flex-1 bg-leetcode-green text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add This Problem</span>
            </button>
          ) : (
            <button
              onClick={onAddClick}
              className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Manual Input Problem</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-leetcode-green focus:border-transparent"
          />
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {onManualTrigger && (
              <button
                onClick={onManualTrigger}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Refresh problem detection"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onExport}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Export to CSV"
            >
              <Download className="w-4 h-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowImport(!showImport)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Import from CSV"
              >
                <Upload className="w-4 h-4" />
              </button>

              {showImport && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileImport}
                    className="hidden"
                    id="import-file"
                  />
                  <label
                    htmlFor="import-file"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                  >
                    Choose CSV file
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {dataSource === 'csv' ? 'CSV Data' : 'Saved Data'}
            </span>
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
