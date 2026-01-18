/**
 * APM Downloader Module
 * 
 * Handles fetching and extracting AI assistant bundles from GitHub releases.
 * Provides functions for release discovery, asset downloading, and extraction.
 * 
 * @module downloader
 */

import axios from 'axios';
import { createWriteStream, unlink } from 'fs';
import { join } from 'path';
import AdmZip from 'adm-zip';
import logger from './logger.js';

/**
 * GitHub repository configuration constants
 */
const GITHUB_REPO_OWNER = 'sdi2200262';
const GITHUB_REPO_NAME = 'agentic-project-management';
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Mapping of AI assistant display names to their bundle filenames
 * @constant {Object.<string, string>}
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
 * @param {string} [releaseTag=null] - Optional specific release tag
 * @returns {Promise<Object>} Release data from GitHub API
 * @throws {Error} If release not found or API rate limit exceeded
 */
export async function fetchLatestRelease(releaseTag = null) {
  const endpoint = releaseTag
    ? `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/tags/${releaseTag}`
    : `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/latest`;
  
  logger.dim(`  Fetching release...`);
  
  try {
    const response = await axios.get(endpoint, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'APM-CLI'
      }
    });
    
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new Error('No releases found. Please ensure APM has been published.');
    }
    if (err.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    throw new Error(`Failed to fetch release information: ${err.message}`);
  }
}

/**
 * Fetches the asset URL for the specified AI assistant from GitHub releases
 * @param {string} assistant - The AI assistant name (e.g., "Cursor", "GitHub Copilot")
 * @param {string} [releaseTag=null] - Optional specific release tag (e.g., "v0.5.1+templates.2")
 * @returns {Promise<string>} The download URL for the asset bundle
 * @throws {Error} If assistant unsupported, bundle not found, or API error
 */
export async function fetchReleaseAssetUrl(assistant, releaseTag = null) {
  const bundleFilename = ASSET_MAP[assistant];
  
  if (!bundleFilename) {
    const supportedAssistants = Object.keys(ASSET_MAP).join(', ');
    throw new Error(`Unsupported AI assistant: ${assistant}. Supported: ${supportedAssistants}`);
  }
  
  let release;
  try {
    release = await fetchLatestRelease(releaseTag);
  } catch (err) {
    logger.error('Failed to fetch release asset');
    throw err;
  }
  
  const asset = release.assets.find(a => a.name === bundleFilename);

  if (!asset) {
    throw new Error(`Bundle not found for ${assistant}. Expected: ${bundleFilename}. This may indicate an incomplete release.`);
  }
  
  return asset.browser_download_url;
}

/**
 * Parses a template tag to extract base version and build number
 * @param {string} tagName - Tag name (e.g., "v0.5.1+templates.2")
 * @returns {Object|null} Object with baseVersion and buildNumber, or null if invalid
 * @private
 */
function parseTemplateTag(tagName) {
  // Pattern: v<version>+templates.<buildNumber>
  // Supports pre-release versions like v0.5.0-test-1+templates.1
  const match = tagName.match(/^v(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?)\+templates\.(\d+)$/);
  
  if (!match) {
    return null;
  }
  
  return {
    baseVersion: match[1],
    buildNumber: parseInt(match[2], 10)
  };
}

/**
 * Compares two version strings (e.g., "0.5.1" vs "0.5.2")
 * @param {string} v1 - First version
 * @param {string} v2 - Second version
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 * @private
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
 * Finds the latest template tag across all versions (for informational purposes)
 * @returns {Promise<Object|null>} Object with tag_name, baseVersion, and release_notes, or null if none found
 */
export async function findLatestTemplateTag() {
  const endpoint = `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases`;
  
  let releases;
  try {
    const response = await axios.get(endpoint, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'APM-CLI'
      },
      params: { per_page: 100 }
    });
    releases = response.data;
  } catch {
    // Silently fail - this is informational only
    return null;
  }
  
  const templateTags = [];
  
  for (const release of releases) {
    const parsed = parseTemplateTag(release.tag_name);
    
    if (parsed) {
      templateTags.push({
        tag_name: release.tag_name,
        baseVersion: parsed.baseVersion,
        buildNumber: parsed.buildNumber,
        release_notes: release.body || ''
      });
    }
  }
  
  if (templateTags.length === 0) {
    return null;
  }
  
  // Sort by base version (descending) then build number (descending)
  templateTags.sort((a, b) => {
    const baseComparison = compareVersions(a.baseVersion, b.baseVersion);
    if (baseComparison !== 0) return -baseComparison;
    return b.buildNumber - a.buildNumber;
  });
  
  return templateTags[0];
}

/**
 * Finds the latest compatible template tag for the given CLI version
 * @param {string} cliVersion - Current CLI version (e.g., "0.5.1")
 * @returns {Promise<Object|null>} Object with tag_name and release_notes, or null if none found
 * @throws {Error} If repository not found or API rate limit exceeded
 */
export async function findLatestCompatibleTemplateTag(cliVersion) {
  const endpoint = `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases`;
  
  logger.dim(`  Searching compatible templates...`);
  
  let releases;
  try {
    const response = await axios.get(endpoint, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'APM-CLI'
      },
      params: { per_page: 100 }
    });
    releases = response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new Error('Repository or releases not found. Please verify the repository exists.');
    }
    if (err.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    throw new Error(`Failed to find compatible template tag: ${err.message}`);
  }
  
  // Filter releases to find compatible tags
  const compatibleTags = [];
  
  for (const release of releases) {
    const parsed = parseTemplateTag(release.tag_name);
    
    if (parsed && parsed.baseVersion === cliVersion) {
      compatibleTags.push({
        tag_name: release.tag_name,
        buildNumber: parsed.buildNumber,
        release_notes: release.body || '',
        release
      });
    }
  }
  
  if (compatibleTags.length === 0) {
    return null;
  }

  // Sort by build number (descending)
  compatibleTags.sort((a, b) => b.buildNumber - a.buildNumber);

  const latest = compatibleTags[0];
  
  return {
    tag_name: latest.tag_name,
    release_notes: latest.release_notes
  };
}

/**
 * Downloads and extracts a zip file from a specific GitHub release tag
 * @param {string} targetTag - GitHub release tag (e.g., "v0.5.1+templates.2")
 * @param {string} assistantName - The AI assistant name (e.g., "Cursor")
 * @param {string} destinationPath - Path where contents should be extracted
 * @returns {Promise<void>}
 * @throws {Error} If download or extraction fails
 */
export async function downloadAndExtract(targetTag, assistantName, destinationPath) {
  logger.dim(`  Downloading ${assistantName} bundle...`);

  const assetUrl = await fetchReleaseAssetUrl(assistantName, targetTag);

  // Download the asset
  const response = await axios({
    method: 'GET',
    url: assetUrl,
    responseType: 'stream'
  });

  const tempPath = join(destinationPath, 'temp-bundle.zip');
  const writer = createWriteStream(tempPath);

  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  logger.dim(`  Extracting files...`);

  try {
    const zip = new AdmZip(tempPath);
    zip.extractAllTo(destinationPath, true);
  } catch (extractError) {
    throw new Error(`Failed to extract zip file: ${extractError.message}`);
  }

  // Clean up temporary file (best-effort)
  await new Promise(resolve => {
    unlink(tempPath, () => resolve());
  });
}
