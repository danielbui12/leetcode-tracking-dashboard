// Chrome extension storage utilities
import { ProblemEntry } from '../types';

export const isExtensionContext = () => {
  return typeof chrome !== 'undefined' && chrome.storage;
};

// Chrome storage wrapper
export const chromeStorage = {
  async get(key: string): Promise<any> {
    if (!isExtensionContext()) {
      return null;
    }

    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result: { [key: string]: any }) => {
        resolve(result[key] || null);
      });
    });
  },

  async set(key: string, value: any): Promise<void> {
    if (!isExtensionContext()) {
      return;
    }

    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  },

  async remove(key: string): Promise<void> {
    if (!isExtensionContext()) {
      return;
    }

    return new Promise((resolve) => {
      chrome.storage.local.remove([key], () => {
        resolve();
      });
    });
  }
};

// Extension messaging utilities
export const extensionMessaging = {
  async sendMessage(type: string, data?: any): Promise<any> {
    console.log('extensionStorage: sendMessage called with type:', type, 'data:', data);

    if (!isExtensionContext()) {
      console.log('extensionStorage: Not in extension context, returning null');
      return null;
    }

    return new Promise((resolve) => {
      console.log('extensionStorage: Sending message to background script...');
      chrome.runtime.sendMessage({ type, data }, (response: any) => {
        console.log('extensionStorage: Message response:', response);
        resolve(response);
      });
    });
  },

  onMessage(callback: (message: any) => void): void {
    if (!isExtensionContext()) {
      return;
    }

    chrome.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: (response?: any) => void) => {
      callback(message);
      sendResponse({ success: true });
    });
  }
};

// Problem data storage for extension
export const loadProblemsFromExtension = async (): Promise<ProblemEntry[]> => {
  if (!isExtensionContext()) {
    return [];
  }

  try {
    const problems = await chromeStorage.get('problems');
    if (!problems) return [];

    // Convert date strings back to Date objects
    return problems.map((entry: any) => ({
      ...entry,
      date: new Date(entry.date)
    }));
  } catch (error) {
    console.error('Error loading problems from extension storage:', error);
    return [];
  }
};

export const saveProblemsToExtension = async (problems: ProblemEntry[]): Promise<void> => {
  if (!isExtensionContext()) {
    return;
  }

  try {
    // Serialize dates to strings for storage
    const serializedProblems = problems.map(entry => ({
      ...entry,
      date: entry.date.toISOString()
    }));

    await chromeStorage.set('problems', serializedProblems);
  } catch (error) {
    console.error('Error saving problems to extension storage:', error);
  }
};

// Current problem detection
export const getCurrentProblem = async (): Promise<any> => {
  console.log('extensionStorage: getCurrentProblem called');

  if (!isExtensionContext()) {
    console.log('extensionStorage: Not in extension context, returning null');
    return null;
  }

  try {
    console.log('extensionStorage: Sending GET_CURRENT_PROBLEM message...');
    const response = await extensionMessaging.sendMessage('GET_CURRENT_PROBLEM');
    console.log('extensionStorage: getCurrentProblem response:', response);
    return response?.data || null;
  } catch (error) {
    console.error('extensionStorage: Error getting current problem:', error);
    return null;
  }
};

// Listen for problem updates
export const onProblemUpdate = (callback: (problem: any) => void): void => {
  if (!isExtensionContext()) {
    return;
  }

  extensionMessaging.onMessage((message) => {
    if (message.type === 'CURRENT_PROBLEM_UPDATE') {
      callback(message.data);
    } else if (message.type === 'PROBLEMS_UPDATED') {
      // This is for the main problem list, not current problem
      console.log('extensionStorage: Problems updated message received');
    }
  });
};
