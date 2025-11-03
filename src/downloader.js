import axios from 'axios';
import chalk from 'chalk';
import { createWriteStream, unlink } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import AdmZip from 'adm-zip';

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
  'Windsurf': 'apm-windsurf.zip',
  'Kilo Code': 'apm-kilocode.zip',
  'Auggie CLI': 'apm-auggie.zip',
  'Roo Code': 'apm-roo.zip'
};

/**
 * Fetches the latest release information from GitHub API
 * @param {string} [releaseTag] - Optional specific release tag
 * @returns {Promise<Object>} Release data from GitHub API
 */
export async function fetchLatestRelease(releaseTag = null) {
  try {
    const endpoint = releaseTag
      ? `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/tags/${releaseTag}`
      : `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/latest`;
    
    console.log(chalk.gray(`  Fetching release from: ${endpoint}`));
    
    const response = await axios.get(endpoint, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'APM-CLI'
      }
    });
    
    return response.data;
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
 * @param {string} [releaseTag] - Optional specific release tag (e.g., "v0.5.1+templates.2")
 * @returns {Promise<string>} The download URL for the asset bundle
 */
export async function fetchReleaseAssetUrl(assistant, releaseTag = null) {
  try {
    // Get the bundle filename for this assistant
    const bundleFilename = ASSET_MAP[assistant];
    
    if (!bundleFilename) {
      throw new Error(`Unsupported AI assistant: ${assistant}. Supported assistants: ${Object.keys(ASSET_MAP).join(', ')}`);
    }
    
    // Fetch the release for the specified tag (or latest if no tag provided)
    const release = await fetchLatestRelease(releaseTag);
    
    console.log(chalk.gray(`  Found release: ${release.name || release.tag_name}`));
    
    // Find the matching asset in the release
    const asset = release.assets.find(a => a.name === bundleFilename);
    
    if (!asset) {
      throw new Error(`Bundle not found for ${assistant}. Expected file: ${bundleFilename}. This may indicate an incomplete release.`);
    }
    
    console.log(chalk.gray(`  Found asset: ${asset.name} (${(asset.size / 1024).toFixed(1)} KB)`));
    
    return asset.browser_download_url;
  } catch (error) {
    console.error(chalk.red('Failed to fetch release asset:'));
    throw error;
  }
}

/**
 * Parses a template tag to extract base version and build number
 * @param {string} tagName - Tag name (e.g., "v0.5.1+templates.2" or "v0.5.0-test-1+templates.1")
 * @returns {Object|null} Object with baseVersion and buildNumber, or null if invalid
 */
function parseTemplateTag(tagName) {
  // Match pattern: v<version>+templates.<buildNumber>
  // Supports pre-release versions like v0.5.0-test-1+templates.1
  const match = tagName.match(/^v(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?)\+templates\.(\d+)$/);
  if (!match) {
    return null;
  }
  return {
    baseVersion: match[1], // Includes pre-release suffix if present (e.g., "0.5.0-test-1")
    buildNumber: parseInt(match[2], 10)
  };
}

/**
 * Finds the latest template tag across all versions (for informational purposes)
 * @returns {Promise<Object|null>} Object with tag_name, baseVersion, and release_notes, or null if none found
 */
export async function findLatestTemplateTag() {
  try {
    const endpoint = `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases`;
    
    const response = await axios.get(endpoint, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'APM-CLI'
      },
      params: {
        per_page: 100
      }
    });
    
    const releases = response.data;
    const allTemplateTags = [];
    
    for (const release of releases) {
      const tagName = release.tag_name;
      const parsed = parseTemplateTag(tagName);
      
      if (parsed) {
        allTemplateTags.push({
          tag_name: tagName,
          baseVersion: parsed.baseVersion,
          buildNumber: parsed.buildNumber,
          release_notes: release.body || ''
        });
      }
    }
    
    if (allTemplateTags.length === 0) {
      return null;
    }
    
    // Sort by base version (descending) then build number (descending)
    allTemplateTags.sort((a, b) => {
      const baseComparison = compareVersions(a.baseVersion, b.baseVersion);
      if (baseComparison !== 0) return -baseComparison; // Descending order
      return b.buildNumber - a.buildNumber; // Descending order
    });
    
    return allTemplateTags[0];
  } catch (error) {
    // Silently fail - this is just for informational purposes
    return null;
  }
}

/**
 * Compares two version strings (e.g., "0.5.1" vs "0.5.2")
 * @param {string} v1 - First version
 * @param {string} v2 - Second version
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  
  return 0;
}

/**
 * Finds the latest compatible template tag for the given CLI version
 * Searches all GitHub releases for tags matching v<cliVersion>+templates.*
 * and returns the one with the highest build number
 * @param {string} cliVersion - Current CLI version (e.g., "0.5.1")
 * @returns {Promise<Object|null>} Object with tag_name and release_notes, or null if none found
 */
export async function findLatestCompatibleTemplateTag(cliVersion) {
  try {
    // Fetch all releases from GitHub API
    const endpoint = `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases`;
    
    console.log(chalk.gray(`  Fetching all releases to find compatible templates for CLI v${cliVersion}...`));
    
    const response = await axios.get(endpoint, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'APM-CLI'
      },
      params: {
        per_page: 100 // Fetch up to 100 releases (adjust if needed)
      }
    });
    
    const releases = response.data;
    
    // Filter releases to find compatible tags matching v<cliVersion>+templates.*
    const compatibleTags = [];
    const expectedBaseVersion = cliVersion;
    
    for (const release of releases) {
      const tagName = release.tag_name;
      const parsed = parseTemplateTag(tagName);
      
      if (parsed && parsed.baseVersion === expectedBaseVersion) {
        compatibleTags.push({
          tag_name: tagName,
          buildNumber: parsed.buildNumber,
          release_notes: release.body || '',
          release: release
        });
      }
    }
    
    if (compatibleTags.length === 0) {
      console.log(chalk.yellow(`No compatible template tags found for CLI version ${cliVersion}`));
      return null;
    }
    
    // Sort by build number (descending) to find the latest
    compatibleTags.sort((a, b) => b.buildNumber - a.buildNumber);
    
    const latest = compatibleTags[0];
    console.log(chalk.gray(`  Found compatible template tag: ${latest.tag_name} (build ${latest.buildNumber})`));
    
    return {
      tag_name: latest.tag_name,
      release_notes: latest.release_notes
    };
    
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error('Repository or releases not found. Please verify the repository exists.');
      } else if (error.response.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }
    }
    throw new Error(`Failed to find compatible template tag: ${error.message}`);
  }
}

/**
 * Downloads and extracts a zip file from a specific GitHub release tag to the specified destination
 * @param {string} targetTag - GitHub release tag (e.g., "v0.5.1+templates.2")
 * @param {string} assistantName - The AI assistant name (e.g., "Cursor", "GitHub Copilot")
 * @param {string} destinationPath - Path where the contents should be extracted
 * @returns {Promise<void>}
 */
export async function downloadAndExtract(targetTag, assistantName, destinationPath) {
  try {
    console.log(chalk.blue('[DOWNLOAD] Downloading assets...'));
    
    // Fetch the asset URL for the specified tag and assistant
    const assetUrl = await fetchReleaseAssetUrl(assistantName, targetTag);
    
    // Download the asset
    const response = await axios({
      method: 'GET',
      url: assetUrl,
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
    
    const zipPath = tempPath;
    
    console.log(chalk.yellow('[EXTRACT] Extracting files...'));
    // Cross-platform extraction using adm-zip
    try {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(destinationPath, true);
    } catch (extractError) {
      throw new Error(`Failed to extract zip file: ${extractError.message}`);
    }
    
    // Clean up temporary file
    try {
      // Best-effort cleanup; ignore failures
      await new Promise(resolve => {
        unlink(zipPath, (err) => {
          // Ignore errors - file might already be deleted or not exist
          resolve();
        });
      });
    } catch (_) {
      // Ignore cleanup errors
    }
    
    console.log(chalk.green('[OK] Scaffolding complete!'));
    console.log(chalk.green(`[OK] APM project structure created in: ${destinationPath}`));
    
  } catch (error) {
    console.error(chalk.red('[ERROR] Error during download/extraction...'));
    console.error(chalk.red(error.message));
    throw error;
  }
}
