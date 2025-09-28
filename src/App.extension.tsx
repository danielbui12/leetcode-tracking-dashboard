import { useState, useEffect } from 'react';
import { ProblemEntry, ReminderEntry } from './types';
import { loadFromLocalStorage, saveToLocalStorage, exportToCSV, importFromCSV } from './utils/storage';
import { loadProblemsFromExtension, saveProblemsToExtension, getCurrentProblem, onProblemUpdate, extensionMessaging } from './utils/extensionStorage';
import { calculateReminders } from './utils/reminders';
import ReminderSection from './components/ReminderSection';
import ProblemTable from './components/ProblemTable';
import AddProblemModal from './components/AddProblemModal';
import Header from './components/Header';
import ExtensionHeader from './components/ExtensionHeader';

function App() {
  const [problems, setProblems] = useState<ProblemEntry[]>([]);
  const [reminders, setReminders] = useState<ReminderEntry[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'csv' | 'saved'>('saved');
  const [currentProblem, setCurrentProblem] = useState<any>(null);
  const [isExtensionContext, setIsExtensionContext] = useState(false);

  // Check if running in extension context
  useEffect(() => {
    console.log('App.extension.tsx: Checking extension context...');
    console.log('App.extension.tsx: typeof chrome =', typeof chrome);
    console.log('App.extension.tsx: chrome.storage =', chrome?.storage);

    const isExtension = typeof chrome !== 'undefined' && !!chrome.storage;
    console.log('App.extension.tsx: isExtension =', isExtension);
    setIsExtensionContext(isExtension);
  }, []);

  // Load data on component mount
  useEffect(() => {
    console.log('App.extension.tsx: loadInitialData useEffect running, isExtensionContext =', isExtensionContext);

    const loadInitialData = async () => {
      console.log('App.extension.tsx: loadInitialData function called');
      setIsLoading(true);

      if (isExtensionContext) {
        console.log('App.extension.tsx: Loading from Chrome storage...');
        // Load from Chrome storage
        const extensionProblems = await loadProblemsFromExtension();
        console.log('App.extension.tsx: Loaded extension problems:', extensionProblems);
        if (extensionProblems.length > 0) {
          setProblems(extensionProblems);
          setDataSource('saved');
        } else {
          setProblems([]);
          setDataSource('saved');
        }
      } else {
        console.log('App.extension.tsx: Loading from localStorage...');
        // Fallback to localStorage
        const savedProblems = loadFromLocalStorage();
        console.log('App.extension.tsx: Loaded localStorage problems:', savedProblems);
        if (savedProblems.length > 0) {
          setProblems(savedProblems);
          setDataSource('saved');
        }
      }

      setIsLoading(false);
    };

    loadInitialData();
  }, [isExtensionContext]);

  // Load current problem from extension
  useEffect(() => {
    console.log('App.extension.tsx: Current problem useEffect running, isExtensionContext =', isExtensionContext);

    if (isExtensionContext) {
      console.log('App.extension.tsx: Loading current problem...');
      const loadCurrentProblem = async () => {
        console.log('App.extension.tsx: Calling getCurrentProblem...');
        const problem = await getCurrentProblem();
        console.log('App.extension.tsx: Current problem result:', problem);
        setCurrentProblem(problem);
      };

      loadCurrentProblem();

      // Listen for problem updates
      onProblemUpdate((problem) => {
        console.log('App.extension.tsx: Problem update received:', problem);
        setCurrentProblem(problem);
      });
    }
  }, [isExtensionContext]);

  // Calculate reminders whenever problems change
  useEffect(() => {
    const newReminders = calculateReminders(problems);
    setReminders(newReminders);
  }, [problems]);

  // Save to storage whenever problems change
  useEffect(() => {
    if (problems.length > 0) {
      if (isExtensionContext) {
        saveProblemsToExtension(problems);
      } else {
        saveToLocalStorage(problems);
      }
    }
  }, [problems, isExtensionContext]);

  const handleAddProblem = (newProblem: Omit<ProblemEntry, 'id'>) => {
    const problem: ProblemEntry = {
      ...newProblem,
      id: Date.now().toString()
    };
    setProblems(prev => [problem, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleAddCurrentProblem = () => {
    if (currentProblem) {
      const problem: ProblemEntry = {
        id: Date.now().toString(),
        problemTitle: currentProblem.problemTitle,
        difficulty: currentProblem.difficulty,
        approach: '', // User will fill this
        timeComplexity: '', // User will fill this
        spaceComplexity: '', // User will fill this
        notes: currentProblem.description || '',
        problemUrl: currentProblem.problemUrl,
        date: new Date(),
        duration: 0, // User will fill this
        redo: 'Medium' as const
      };
      setProblems(prev => [problem, ...prev]);
    }
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
          ? { ...problem, date: new Date() }
          : problem
      );

      if (isExtensionContext) {
        saveProblemsToExtension(updatedProblems);
      } else {
        saveToLocalStorage(updatedProblems);
      }

      return updatedProblems;
    });
  };

  const handleNoNeedToRedo = (id: string) => {
    setProblems(prev => {
      const updatedProblems = prev.map(problem =>
        problem.id === id
          ? { ...problem, redo: 'Easy' as const, date: new Date() }
          : problem
      );

      if (isExtensionContext) {
        saveProblemsToExtension(updatedProblems);
      } else {
        saveToLocalStorage(updatedProblems);
      }

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

  const handleManualTrigger = async () => {
    if (isExtensionContext) {
      try {
        await extensionMessaging.sendMessage('MANUAL_TRIGGER_DETECTION');
        console.log('Manual trigger sent to background script');
      } catch (error) {
        console.error('Error sending manual trigger:', error);
      }
    }
  };

  const filteredProblems = problems.filter(problem =>
    problem.problemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.approach.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {isExtensionContext ? (
        <ExtensionHeader
          currentProblem={currentProblem}
          onAddCurrentProblem={handleAddCurrentProblem}
          onAddClick={() => setIsAddModalOpen(true)}
          onExport={handleExport}
          onImport={handleImport}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dataSource={dataSource}
          onManualTrigger={handleManualTrigger}
        />
      ) : (
        <Header
          onAddClick={() => setIsAddModalOpen(true)}
          onExport={handleExport}
          onImport={handleImport}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dataSource={dataSource}
        />
      )}

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
              onNoNeedToRedo={handleNoNeedToRedo}
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
        currentProblem={currentProblem}
      />
    </div>
  );
}

export default App;
