// Background service worker for LeetCode Tracker extension

class ExtensionBackground {
  constructor() {
    this.currentProblem = null;
    this.sidePanelOpen = false;
    this.init();
  }

  init() {
    console.log('Background: Service worker initialized');

    // Listen for tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      console.log('Background: Tab updated event:', tabId, changeInfo.status, tab.url);
      if (changeInfo.status === 'complete' && tab.url) {
        this.handleTabUpdate(tabId, tab);
      }
    });

    // Listen for tab activation
    chrome.tabs.onActivated.addListener((activeInfo) => {
      console.log('Background: Tab activated:', activeInfo.tabId);
      this.handleTabActivated(activeInfo.tabId);
    });

    // Note: chrome.sidePanel doesn't have onOpened/onClosed events
    // We'll detect side panel state through message passing instead

    // Listen for messages from content scripts
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('Background: Message received:', request.type);
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });

    // Listen for action clicks (extension icon)
    chrome.action.onClicked.addListener((tab) => {
      console.log('Background: Action clicked, opening side panel');
      this.openSidePanel(tab);
    });

    // Keep service worker alive
    setInterval(() => {
      console.log('Background: Service worker alive -', new Date().toISOString());
    }, 10000);

    // Check for LeetCode tabs on startup
    this.checkForLeetCodeTabs();
  }

  async checkForLeetCodeTabs() {
    try {
      console.log('Background: Checking for existing LeetCode tabs...');
      const tabs = await chrome.tabs.query({ url: 'https://leetcode.com/problems/*' });
      console.log('Background: Found LeetCode tabs:', tabs);

      for (const tab of tabs) {
        console.log('Background: Injecting content script into existing LeetCode tab:', tab.id);
        await this.injectContentScript(tab.id);
        await this.requestProblemData(tab.id);
      }
    } catch (error) {
      console.error('Background: Error checking for LeetCode tabs:', error);
    }
  }

  async handleTabUpdate(tabId, tab) {
    console.log('Background: Tab updated:', tab.url);
    if (this.isLeetCodeProblemPage(tab.url)) {
      console.log('Background: LeetCode problem page detected');
      // Inject content script to add the button
      this.injectContentScript(tabId);
      // Get problem data
      this.requestProblemData(tabId);
    } else {
      console.log('Background: Not a LeetCode problem page');
      this.currentProblem = null;
      this.sendCurrentProblemToSidePanel();
    }
  }

  async handleTabActivated(tabId) {
    try {
      console.log('Background: Tab activated, querying all tabs...');

      // Query all tabs to find the active one
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const activeTab = tabs[0];
          console.log('Background: Active tab found:', activeTab.url);

          if (this.isLeetCodeProblemPage(activeTab.url)) {
            console.log('Background: Active tab is LeetCode problem page');
            this.injectContentScript(activeTab.id);
            this.requestProblemData(activeTab.id);
          } else {
            console.log('Background: Active tab is not LeetCode problem page');
            this.currentProblem = null;
            this.sendCurrentProblemToSidePanel();
          }
        }
      });
    } catch (error) {
      console.error('Background: Error in handleTabActivated:', error);
    }
  }

  isLeetCodeProblemPage(url) {
    return url && /https:\/\/leetcode\.com\/problems\/[^\/]+/.test(url);
  }

  async injectContentScript(tabId) {
    try {
      console.log('Background: Injecting content script into tab:', tabId);
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content/content.js']
      });
      console.log('Background: Content script injected successfully');
    } catch (error) {
      console.log('Background: Content script already injected or error:', error);
    }
  }

  async requestProblemData(tabId) {
    try {
      console.log('Background: Requesting problem data from tab:', tabId);

      // Get the current tab URL using Chrome tabs API
      const tab = await chrome.tabs.get(tabId);
      console.log('Background: Current tab URL:', tab.url);

      if (!this.isLeetCodeProblemPage(tab.url)) {
        console.log('Background: Not a LeetCode problem page');
        this.currentProblem = null;
        this.sendCurrentProblemToSidePanel();
        return;
      }

      // Send the URL to the content script first
      try {
        await chrome.tabs.sendMessage(tabId, {
          type: 'UPDATE_URL',
          url: tab.url
        });
        console.log('Background: Sent URL to content script:', tab.url);
      } catch (error) {
        console.log('Background: Could not send URL to content script:', error);
      }

      // Wait a bit for the content script to process the URL
      setTimeout(async () => {
        try {
          const response = await chrome.tabs.sendMessage(tabId, {
            type: 'GET_CURRENT_PROBLEM'
          });

          console.log('Background: Received response from content script:', response);
          if (response && response.success && response.data) {
            this.currentProblem = response.data;
            console.log('Background: Updated current problem from content script:', this.currentProblem);
            this.sendCurrentProblemToSidePanel();
          } else {
            console.log('Background: No problem data from content script, trying direct API call');
            // Extract titleSlug from URL for direct API call
            const url = new URL(tab.url);
            const pathParts = url.pathname.split("/").filter(Boolean);
            const slug = pathParts[1] || null;
            if (slug) {
              await this.fetchProblemDataDirectly(slug, tab.url);
            }
          }
        } catch (error) {
          console.log('Background: Content script not available, trying direct API call:', error);
          // Extract titleSlug from URL for direct API call
          const url = new URL(tab.url);
          const pathParts = url.pathname.split("/").filter(Boolean);
          const slug = pathParts[1] || null;
          if (slug) {
            await this.fetchProblemDataDirectly(slug, tab.url);
          }
        }
      }, 500);

    } catch (error) {
      console.error('Background: Error in requestProblemData:', error);
      this.currentProblem = null;
      this.sendCurrentProblemToSidePanel();
    }
  }

  async fetchProblemDataDirectly(slug, url) {
    try {
      console.log('Background: Fetching problem data directly for slug:', slug);

      const query = {
        query: `
          query getQuestionDetail($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              questionId
              title
              content
              difficulty
              topicTags {
                name
                id
                slug
              }
            }
          }
        `,
        variables: { titleSlug: slug }
      };

      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': url,
          'Origin': 'https://leetcode.com'
        },
        body: JSON.stringify(query)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        console.error('Background: GraphQL errors:', data.errors);
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      if (!data.data || !data.data.question) {
        throw new Error('No question data found');
      }

      const leetcodeData = data.data.question;

      // Transform the data
      const problemNumber = leetcodeData.questionId || '';
      const content = leetcodeData.content || '';
      const cleanContent = content.replace(/<[^>]*>/g, '').trim();
      const description = cleanContent.substring(0, 200) + (cleanContent.length > 200 ? '...' : '');
      const tags = (leetcodeData.topicTags || []).map(tag => tag.name);

      this.currentProblem = {
        problemTitle: leetcodeData.title || 'Unknown Problem',
        difficulty: leetcodeData.difficulty || 'Medium',
        problemNumber: problemNumber,
        problemUrl: url,
        description: description,
        tags: tags,
        timestamp: new Date().toISOString()
      };

      console.log('Background: Successfully fetched problem data directly:', this.currentProblem);
      this.sendCurrentProblemToSidePanel();

    } catch (error) {
      console.error('Background: Error fetching problem data directly:', error);
      this.currentProblem = null;
      this.sendCurrentProblemToSidePanel();
    }
  }

  handleMessage(request, sender, sendResponse) {
    console.log('Background: Handling message:', request.type, 'from:', sender.tab?.url);

    switch (request.type) {
      case 'LEETCODE_PROBLEM_DETECTED':
        this.currentProblem = request.data;
        console.log('Background: Problem detected by content script:', this.currentProblem);
        this.sendCurrentProblemToSidePanel();
        sendResponse({ success: true });
        break;

      case 'LEETCODE_PROBLEM_CLEARED':
        this.currentProblem = null;
        console.log('Background: Problem cleared by content script');
        this.sendCurrentProblemToSidePanel();
        sendResponse({ success: true });
        break;

      case 'ADD_PROBLEM_TO_TRACKER':
        console.log('Background: Adding problem to tracker:', request.data);
        this.addProblemToStorage(request.data);
        sendResponse({ success: true });
        break;

      case 'GET_CURRENT_PROBLEM_FROM_BACKGROUND':
        console.log('Background: Sending current problem to side panel:', this.currentProblem);
        sendResponse({
          success: true,
          data: this.currentProblem
        });
        break;

      case 'GET_CURRENT_PROBLEM':
        console.log('Background: Sending current problem to content script:', this.currentProblem);
        sendResponse({
          success: true,
          data: this.currentProblem
        });
        break;

      case 'SIDE_PANEL_READY':
        console.log('Background: Side panel ready, sending current problem');
        this.sidePanelOpen = true;
        this.sendCurrentProblemToSidePanel();
        sendResponse({ success: true });
        break;

      case 'MANUAL_TRIGGER_DETECTION':
        this.triggerDetectionForCurrentTab();
        sendResponse({ success: true });
        break;

      case 'PING':
        console.log('Background: Pong!');
        sendResponse({ success: true, message: 'pong' });
        break;

      default:
        console.log('Background: Unknown message type:', request.type);
        sendResponse({ success: false, error: 'Unknown message type' });
    }
  }

  async addProblemToStorage(problemData) {
    try {
      console.log('Background: Adding problem to storage:', problemData);

      // Get existing problems
      const result = await chrome.storage.local.get(['problems']);
      const existingProblems = result.problems || [];

      // Check if problem already exists
      const existingIndex = existingProblems.findIndex(p => p.problemUrl === problemData.problemUrl);

      if (existingIndex >= 0) {
        console.log('Background: Problem already exists, updating...');
        existingProblems[existingIndex] = {
          ...existingProblems[existingIndex],
          ...problemData,
          timestamp: new Date().toISOString()
        };
      } else {
        console.log('Background: Adding new problem...');
        const newProblem = {
          id: Date.now().toString(),
          ...problemData,
          approach: '',
          timeComplexity: '',
          spaceComplexity: '',
          notes: '',
          date: new Date().toISOString(),
          redo: 'Medium',
          duration: 0
        };
        existingProblems.push(newProblem);
      }

      // Save updated problems
      await chrome.storage.local.set({ problems: existingProblems });
      console.log('Background: Problem saved successfully');

      // Notify side panel of update
      this.sendProblemsUpdateToSidePanel(existingProblems);

    } catch (error) {
      console.error('Background: Error adding problem to storage:', error);
    }
  }

  async sendProblemsUpdateToSidePanel(problems) {
    try {
      await chrome.runtime.sendMessage({
        type: 'PROBLEMS_UPDATED',
        data: problems
      });
      console.log('Background: Sent problems update to side panel');
    } catch (error) {
      console.error('Background: Error sending problems update to side panel:', error);
    }
  }

  async sendCurrentProblemToSidePanel() {
    try {
      await chrome.runtime.sendMessage({
        type: 'CURRENT_PROBLEM_UPDATE',
        data: this.currentProblem
      });
      console.log('Background: Sent current problem to side panel:', this.currentProblem);
    } catch (error) {
      console.error('Error sending problem data to side panel:', error);
    }
  }

  async openSidePanel(tab) {
    try {
      if (chrome.sidePanel && chrome.sidePanel.open) {
        await chrome.sidePanel.open({ tabId: tab.id });
      } else {
        console.log('Background: Side panel API not available, cannot open side panel');
      }
    } catch (error) {
      console.error('Error opening side panel:', error);
    }
  }

  async triggerDetectionForCurrentTab() {
    try {
      console.log('Background: Manual trigger - querying all tabs...');

      // Query all tabs to find the active one
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const activeTab = tabs[0];
          console.log('Background: Manual trigger for tab:', activeTab.id, activeTab.url);

          if (this.isLeetCodeProblemPage(activeTab.url)) {
            console.log('Background: LeetCode problem page detected, injecting content script');
            this.injectContentScript(activeTab.id);
            this.requestProblemData(activeTab.id);
          } else {
            console.log('Background: Current tab is not a LeetCode problem page');
            this.currentProblem = null;
            this.sendCurrentProblemToSidePanel();
          }
        }
      });
    } catch (error) {
      console.error('Background: Error in manual trigger:', error);
    }
  }
}

// Initialize the background service
const background = new ExtensionBackground();