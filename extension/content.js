// Content script for LeetCode problem detection and button injection

console.log('LeetCode Tracker: Confirmed running on LeetCode problem page');

// Get the current tab URL using chrome.tabs.query
let currentTabUrl = window.location.href;

init();

function init() {
  console.log('LeetCode Tracker: Initializing content script');

  // Get the current tab URL using chrome.tabs.query
  chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    console.log('LeetCode Tracker: Queried tabs:', tabs);
    if (tabs.length > 0) {
      currentTabUrl = tabs[0].url;
      console.log('LeetCode Tracker: Current tab URL from query:', currentTabUrl);

      // Extract problem data using the correct URL
      const problemData = extractProblemData();
      console.log('LeetCode Tracker: Extracted problem data:', problemData);

      // Send data to background script
      if (problemData && problemData.problemTitle !== 'Unknown Problem') {
        chrome.runtime.sendMessage({
          type: 'LEETCODE_PROBLEM_DETECTED',
          data: problemData
        }).catch(error => {
          console.error('Error sending message to background script:', error);
        });
      }

      // Inject the "Add Problem" button
      injectAddProblemButton(problemData);
    }
  }).catch(error => {
    console.error('LeetCode Tracker: Error querying tabs:', error);
    // Fallback to window.location.href
    const problemData = extractProblemData();
    injectAddProblemButton(problemData);
  });

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_CURRENT_PROBLEM') {
      const currentData = extractProblemData();
      sendResponse({
        success: true,
        data: currentData
      });
    }
  });
}

function extractProblemData() {
  try {
    const url = currentTabUrl || window.location.href;
    const pageTitle = document.title;

    // Extract problem title from page title
    let problemTitle = 'Unknown Problem';
    if (pageTitle && pageTitle.includes(' - LeetCode')) {
      problemTitle = pageTitle.replace(' - LeetCode', '').trim();
    }

    // Try to extract difficulty from page elements
    let difficulty = 'Medium';
    const difficultyElements = document.querySelectorAll('[class*="difficulty"], [class*="text-difficulty"], [data-cy="question-difficulty"]');
    for (const el of difficultyElements) {
      const text = el.textContent?.toLowerCase() || '';
      if (text.includes('easy')) {
        difficulty = 'Easy';
        break;
      } else if (text.includes('hard')) {
        difficulty = 'Hard';
        break;
      }
    }

    // Try to extract problem number
    let problemNumber = '';
    const numberElements = document.querySelectorAll('h1 span, [class*="question-number"]');
    for (const el of numberElements) {
      const text = el.textContent?.trim() || '';
      if (/^\d+$/.test(text)) {
        problemNumber = text;
        break;
      }
    }

    // Extract titleSlug from URL
    const urlMatch = url.match(/leetcode\.com\/problems\/([^\/]+)/);
    const titleSlug = urlMatch ? urlMatch[1] : null;

    return {
      problemTitle: problemTitle,
      difficulty: difficulty,
      problemNumber: problemNumber,
      problemUrl: url,
      description: `Problem: ${problemTitle}`,
      tags: [],
      timestamp: new Date().toISOString(),
      titleSlug: titleSlug
    };
  } catch (error) {
    console.error('LeetCode Tracker: Error in data extraction:', error);
    return null;
  }
}

function injectAddProblemButton(problemData) {
  console.log('LeetCode Tracker: Injecting Add Problem button');

  // Remove existing button if it exists
  const existingButton = document.getElementById('leetcode-tracker-add-button');
  if (existingButton) {
    existingButton.remove();
  }

  // Create the button
  const button = document.createElement('button');
  button.id = 'leetcode-tracker-add-button';
  button.textContent = 'Add to Tracker';
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
  `;

  // Add hover effects
  button.addEventListener('mouseenter', () => {
    button.style.background = '#0056b3';
    button.style.transform = 'translateY(-2px)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.background = '#007bff';
    button.style.transform = 'translateY(0)';
  });

  // Add click handler
  button.addEventListener('click', () => {
    console.log('LeetCode Tracker: Add button clicked');
    handleAddProblem(problemData);
  });

  // Append to body
  document.body.appendChild(button);

  // Show success message
  button.textContent = 'Added!';
  button.style.background = '#28a745';

  setTimeout(() => {
    button.textContent = 'Add to Tracker';
    button.style.background = '#007bff';
  }, 2000);

  console.log('LeetCode Tracker: Add Problem button injected successfully');
}

function handleAddProblem(problemData) {
  console.log('LeetCode Tracker: Handling add problem:', problemData);

  // Send message to background script to add the problem
  chrome.runtime.sendMessage({
    type: 'ADD_PROBLEM_TO_TRACKER',
    data: problemData
  }).then(response => {
    console.log('LeetCode Tracker: Add problem response:', response);
    if (response && response.success) {
      showSuccessMessage();
    } else {
      showErrorMessage();
    }
  }).catch(error => {
    console.error('LeetCode Tracker: Error adding problem:', error);
    showErrorMessage();
  });
}

function showSuccessMessage() {
  const message = document.createElement('div');
  message.textContent = 'Problem added to tracker!';
  message.style.cssText = `
    position: fixed;
    top: 70px;
    right: 20px;
    z-index: 10001;
    background: #28a745;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  `;

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
}

function showErrorMessage() {
  const message = document.createElement('div');
  message.textContent = 'Failed to add problem. Please try again.';
  message.style.cssText = `
    position: fixed;
    top: 70px;
    right: 20px;
    z-index: 10001;
    background: #dc3545;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  `;

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
}

// Debug functions
window.checkLeetCodeStatus = () => {
  console.log('LeetCode Tracker: Current status check');
  console.log('Window location:', window.location.href);

  const basicData = extractProblemData();
  console.log('Basic extracted data:', basicData);

  return {
    windowLocation: window.location.href,
    extractedData: basicData
  };
};

window.triggerLeetCodeDetection = () => {
  console.log('LeetCode Tracker: Manual trigger activated');
  const basicData = extractProblemData();
  console.log('Triggered extraction:', basicData);
  return basicData;
};