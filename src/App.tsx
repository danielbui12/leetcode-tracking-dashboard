import { useState, useEffect } from 'react';
import { ProblemEntry, ReminderEntry } from './types';
import { loadFromLocalStorage, saveToLocalStorage, exportToCSV, importFromCSV } from './utils/storage';
import { calculateReminders } from './utils/reminders';
import { loadCSVData } from './utils/csvLoader';
import ReminderSection from './components/ReminderSection';
import ProblemTable from './components/ProblemTable';
import AddProblemModal from './components/AddProblemModal';
import Header from './components/Header';

function App() {
  const [problems, setProblems] = useState<ProblemEntry[]>([]);
  const [reminders, setReminders] = useState<ReminderEntry[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'csv' | 'saved'>('saved');

  // Load data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      const savedProblems = loadFromLocalStorage();
      if (savedProblems.length === 0) {
        // Load from CSV file

        try {
          const csvProblems = await loadCSVData();

          if (csvProblems.length > 0) {
            setProblems(csvProblems);
            setDataSource('csv');
            saveToLocalStorage(csvProblems);
          } else {
            // If CSV loading fails, start with empty array
            setProblems([]);
            setDataSource('csv');
          }
        } catch (error) {
          console.error('Failed to load CSV data:', error);
          setProblems([]);
          setDataSource('csv');
        }
      } else {
        setProblems(savedProblems);
        setDataSource('saved');
      }
      setIsLoading(false);
    };

    loadInitialData();
  }, []);

  // Calculate reminders whenever problems change
  useEffect(() => {
    const newReminders = calculateReminders(problems);
    setReminders(newReminders);
  }, [problems]);

  // Save to localStorage whenever problems change
  useEffect(() => {
    if (problems.length > 0) {
      saveToLocalStorage(problems);
    }
  }, [problems]);

  const handleAddProblem = (newProblem: Omit<ProblemEntry, 'id'>) => {
    const problem: ProblemEntry = {
      ...newProblem,
      id: Date.now().toString()
    };
    setProblems(prev => [problem, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleUpdateProblem = (id: string, updatedProblem: Partial<ProblemEntry>) => {
    setProblems(prev =>
      prev.map(problem =>
        problem.id === id ? { ...problem, ...updatedProblem } : problem
      )
    );
  };

  const handleDeleteProblem = (id: string) => {
    setProblems(prev => prev.filter(problem => problem.id !== id));
  };

  const handleMarkAsRedone = (id: string) => {
    setProblems(prev => {
      const updatedProblems = prev.map(problem =>
        problem.id === id
          ? { ...problem, date: new Date() } // Update date to current date
          : problem
      );

      // Update localStorage with the new data
      saveToLocalStorage(updatedProblems);

      return updatedProblems;
    });
  };

  const handleExport = () => {
    exportToCSV(problems);
  };

  const handleImport = (file: File) => {
    importFromCSV(file)
      .then(importedProblems => {
        setProblems(prev => [...importedProblems, ...prev]);
      })
      .catch(error => {
        console.error('Import failed:', error);
        alert('Failed to import CSV file. Please check the format.');
      });
  };

  const filteredProblems = problems.filter(problem =>
    problem.problemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.approach.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAddClick={() => setIsAddModalOpen(true)}
        onExport={handleExport}
        onImport={handleImport}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        dataSource={dataSource}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-leetcode-green mx-auto mb-4"></div>
              <p className="text-gray-600">Loading LeetCode data...</p>
            </div>
          </div>
        ) : (
          <>
            <ReminderSection
              reminders={reminders}
              onMarkAsRedone={handleMarkAsRedone}
            />

            <div className="bg-white shadow-sm rounded-lg">
              <ProblemTable
                problems={filteredProblems}
                onUpdate={handleUpdateProblem}
                onDelete={handleDeleteProblem}
              />
            </div>
          </>
        )}
      </main>

      <AddProblemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProblem}
      />
    </div>
  );
}

export default App;
