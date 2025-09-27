import React from 'react';
import { Plus, Download, Upload, Search } from 'lucide-react';

interface HeaderProps {
  onAddClick: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  dataSource: 'csv' | 'saved';
}

const Header: React.FC<HeaderProps> = ({
  onAddClick,
  onExport,
  onImport,
  searchTerm,
  onSearchChange,
  dataSource
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              LeetCode Tracking Dashboard
            </h1>
            <div className="ml-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                dataSource === 'csv' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {dataSource === 'csv' ? 'CSV Data' : 'Saved Data'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-leetcode-green focus:border-transparent"
              />
            </div>

            {/* Add Problem Button */}
            <button
              onClick={onAddClick}
              className="inline-flex items-center px-4 py-2 bg-leetcode-green text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-leetcode-green focus:ring-offset-2 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Problem
            </button>

            {/* Export Button */}
            <button
              onClick={onExport}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>

            {/* Import Button */}
            <label className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
