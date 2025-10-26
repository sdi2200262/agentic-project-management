import axios from 'axios';
import chalk from 'chalk';
import { createWriteStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// GitHub repository configuration
const GITHUB_REPO_OWNER = 'sdi2200262';
const GITHUB_REPO_NAME = 'agentic-project-management';
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Mapping of AI assistant display names to their bundle filenames
 */
export const ASSET_MAP = {
  'Cursor': 'apm-cursor.zip',
  'GitHub Copilot': 'apm-copilot.zip',
  'Claude Code': 'apm-claude.zip',
  'Gemini CLI': 'apm-gemini.zip',
  'Qwen Code': 'apm-qwen.zip',
  'opencode': 'apm-opencode.zip',
  'Codex CLI': 'apm-codex.zip',
  'Windsurf': 'apm-windsurf.zip',
  'Kilo Code': 'apm-kilocode.zip',
  'Auggie CLI': 'apm-auggie.zip',
  'CodeBuddy': 'apm-codebuddy.zip',
  'Roo Code': 'apm-roo.zip',
  'Amazon Q Developer CLI': 'apm-q.zip'
};

/**
 * Fetches the latest release information from GitHub API
 * @param {string} [releaseTag] - Optional specific release tag (for testing with drafts)
 * @returns {Promise<Object>} Release data from GitHub API
 */
export async function fetchLatestRelease(releaseTag = null) {
  try {
    let endpoint;
    let headers = {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'APM-CLI'
    };
    
    // Add GitHub token if available (needed for draft releases)
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    
    if (releaseTag) {
      // Fetch specific release by tag
      endpoint = `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/tags/${releaseTag}`;
    } else {
      // Try to fetch latest release (published)
      endpoint = `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/latest`;
    }
    
    console.log(chalk.gray(`Fetching release from: ${endpoint}`));
    
    try {
      const response = await axios.get(endpoint, { headers });
      return response.data;
    } catch (error) {
      // If latest release fails and we have a token, try to fetch the first draft release
      if (!releaseTag && error.response?.status === 404 && process.env.GITHUB_TOKEN) {
        console.log(chalk.yellow('No published releases found. Checking for draft releases...'));
        const allReleasesEndpoint = `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases`;
        const allReleasesResponse = await axios.get(allReleasesEndpoint, { headers });
        
        // Find the first draft release (most recent)
        const draftRelease = allReleasesResponse.data.find(r => r.draft === true);
        if (draftRelease) {
          console.log(chalk.yellow(`Found draft release: ${draftRelease.tag_name}`));
          return draftRelease;
        }
      }
      throw error;
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error('No releases found. Please ensure APM has been published.');
      } else if (error.response.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }
    }
    throw new Error(`Failed to fetch release information: ${error.message}`);
  }
}

/**
 * Fetches the asset URL for the specified AI assistant from GitHub releases
 * @param {string} assistant - The AI assistant name (e.g., "Cursor", "GitHub Copilot")
 * @param {string} [releaseTag] - Optional specific release tag (for testing)
 * @returns {Promise<string>} The download URL for the asset bundle
 */
export async function fetchReleaseAssetUrl(assistant, releaseTag = null) {
  try {
    // Get the bundle filename for this assistant
    const bundleFilename = ASSET_MAP[assistant];
    
    if (!bundleFilename) {
      throw new Error(`Unsupported AI assistant: ${assistant}. Supported assistants: ${Object.keys(ASSET_MAP).join(', ')}`);
    }
    
    // Fetch the latest release
    const release = await fetchLatestRelease(releaseTag);
    
    console.log(chalk.gray(`Found release: ${release.name || release.tag_name}`));
    
    // Find the matching asset in the release
    const asset = release.assets.find(a => a.name === bundleFilename);
    
    if (!asset) {
      throw new Error(`Bundle not found for ${assistant}. Expected file: ${bundleFilename}. This may indicate an incomplete release.`);
    }
    
    console.log(chalk.gray(`Found asset: ${asset.name} (${(asset.size / 1024).toFixed(1)} KB)`));
    
    return asset.browser_download_url;
  } catch (error) {
    console.error(chalk.red('Failed to fetch release asset:'));
    throw error;
  }
}

/**
 * Downloads and extracts a zip file to the specified destination
 * @param {string} url - URL or file path to the zip file
 * @param {string} destinationPath - Path where the contents should be extracted
 * @returns {Promise<void>}
 */
export async function downloadAndExtract(url, destinationPath) {
  try {
    console.log(chalk.blue('● ○ ○ Downloading assets...'));
    
    let zipPath;
    
    // Check if it's a local file path or URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Handle URL downloads
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
      });
      
      // Create a temporary file for the download
      const tempPath = join(destinationPath, 'temp-bundle.zip');
      const writer = createWriteStream(tempPath);
      
      response.data.pipe(writer);
      
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      
      zipPath = tempPath;
    } else {
      // Handle local file paths (for testing)
      zipPath = url;
    }
    
    console.log(chalk.yellow('● ● ○ Extracting files...'));
    
    // Use unzip command to extract (more reliable than unzipper package)
    try {
      await execAsync(`unzip -o "${zipPath}" -d "${destinationPath}"`);
    } catch (unzipError) {
      // Fallback: try with ditto on macOS
      try {
        await execAsync(`ditto -xk "${zipPath}" "${destinationPath}"`);
      } catch (dittoError) {
        throw new Error(`Failed to extract zip file: ${unzipError.message}`);
      }
    }
    
    // Clean up temporary file if it was downloaded
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        await execAsync(`rm "${zipPath}"`);
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
    }
    
    console.log(chalk.green('● ● ● Scaffolding complete!'));
    console.log(chalk.green(`APM project structure created in: ${destinationPath}`));
    
  } catch (error) {
    console.error(chalk.red('✗ ✗ ✗ Error during download/extraction...'));
    console.error(chalk.red(error.message));
    throw error;
  }
}
