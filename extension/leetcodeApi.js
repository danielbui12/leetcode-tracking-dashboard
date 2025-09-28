// LeetCode GraphQL API client
class LeetCodeAPI {
  constructor() {
    this.graphqlEndpoint = 'https://leetcode.com/graphql';
  }

  // Extract titleSlug from URL
  extractTitleSlug(url) {
    const match = url.match(/leetcode\.com\/problems\/([^\/]+)/);
    return match ? match[1] : null;
  }

  // Get CSRF token from cookies
  getCSRFToken() {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [name, value] = cookie.split('=');
      acc[name] = value;
      return acc;
    }, {});
    return cookies.csrftoken || '';
  }

  // Get session cookie
  getSessionCookie() {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [name, value] = cookie.split('=');
      acc[name] = value;
      return acc;
    }, {});
    return cookies.LEETCODE_SESSION || '';
  }

  // Fetch problem data using GraphQL
  async fetchProblemData(titleSlug) {
    try {
      console.log('LeetCode API: Fetching data for:', titleSlug);

      const query = {
        query: `
          query getQuestionDetail($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              questionId
              title
              content
              difficulty
              likes
              dislikes
              isPaidOnly
              status
              topicTags {
                name
                id
                slug
              }
              codeSnippets {
                lang
                langSlug
                code
              }
              hints
              metaData
              judgerAvailable
              judgeType
              mysqlSchemas
              enableRunCode
              enableTestMode
              envInfo
              libraryUrl
              adminUrl
            }
          }
        `,
        variables: { titleSlug }
      };

      const csrfToken = this.getCSRFToken();
      const sessionCookie = this.getSessionCookie();

      const headers = {
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/problems/${titleSlug}/`,
        'Origin': 'https://leetcode.com',
        'User-Agent': navigator.userAgent
      };

      // Add CSRF token if available
      if (csrfToken) {
        headers['x-csrftoken'] = csrfToken;
        headers['Cookie'] = `csrftoken=${csrfToken}`;
      }

      // Add session cookie if available
      if (sessionCookie) {
        headers['Cookie'] = headers['Cookie']
          ? `${headers['Cookie']}; LEETCODE_SESSION=${sessionCookie}`
          : `LEETCODE_SESSION=${sessionCookie}`;
      }

      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(query),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        console.error('LeetCode API: GraphQL errors:', data.errors);
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      if (!data.data || !data.data.question) {
        throw new Error('No question data found');
      }

      console.log('LeetCode API: Successfully fetched data:', data.data.question);
      return data.data.question;

    } catch (error) {
      console.error('LeetCode API: Error fetching problem data:', error);
      throw error;
    }
  }

  // Transform LeetCode data to our format
  transformProblemData(leetcodeData, url) {
    try {
      // Extract problem number from questionId
      const problemNumber = leetcodeData.questionId || '';

      // Clean up content (remove HTML tags)
      const content = leetcodeData.content || '';
      const cleanContent = content.replace(/<[^>]*>/g, '').trim();
      const description = cleanContent.substring(0, 200) + (cleanContent.length > 200 ? '...' : '');

      // Extract tags
      const tags = (leetcodeData.topicTags || []).map(tag => tag.name);

      return {
        problemTitle: leetcodeData.title || 'Unknown Problem',
        difficulty: leetcodeData.difficulty || 'Medium',
        problemNumber: problemNumber,
        problemUrl: url,
        description: description,
        tags: tags,
        isPaidOnly: leetcodeData.isPaidOnly || false,
        status: leetcodeData.status || null,
        likes: leetcodeData.likes || 0,
        dislikes: leetcodeData.dislikes || 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('LeetCode API: Error transforming data:', error);
      throw error;
    }
  }

  // Main method to get problem data from current page
  async getCurrentProblemData() {
    try {
      const url = window.location.href;
      const titleSlug = this.extractTitleSlug(url);

      if (!titleSlug) {
        throw new Error('Could not extract titleSlug from URL');
      }

      const leetcodeData = await this.fetchProblemData(titleSlug);
      const transformedData = this.transformProblemData(leetcodeData, url);

      return transformedData;
    } catch (error) {
      console.error('LeetCode API: Error getting current problem data:', error);
      throw error;
    }
  }
}

// Export for use in content script
window.LeetCodeAPI = LeetCodeAPI;
