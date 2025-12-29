/**
 * API fetching utilities for external services
 */

const GITHUB_REPO = 'sdi2200262/agentic-project-management';
const NPM_PACKAGE = 'agentic-pm';

/**
 * Fetch GitHub repository statistics
 * @returns {Promise<Object>} - Object with stargazers_count and other repo stats
 */
export async function fetchGitHubStats() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}`
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      openIssues: data.open_issues_count || 0,
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    throw error;
  }
}

/**
 * Fetch NPM package download statistics (last week)
 * @returns {Promise<number>} - Number of downloads in the last week
 */
export async function fetchNPMStats() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `https://api.npmjs.org/downloads/point/2024-01-01:${today}/${NPM_PACKAGE}`
    );
    
    if (!response.ok) {
      throw new Error(`NPM API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.downloads || 0;
  } catch (error) {
    console.error('Error fetching NPM stats:', error);
    throw error;
  }
}

/**
 * Fetch GitHub repository contributors
 * @returns {Promise<Array>} - Array of contributor objects
 */
export async function fetchContributors() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contributors`
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Sort by contributions (descending) and return formatted data
    return data
      .sort((a, b) => b.contributions - a.contributions)
      .map((contributor) => ({
        id: contributor.id,
        login: contributor.login,
        avatarUrl: contributor.avatar_url,
        contributions: contributor.contributions,
        profileUrl: contributor.html_url,
      }));
  } catch (error) {
    console.error('Error fetching contributors:', error);
    throw error;
  }
}

