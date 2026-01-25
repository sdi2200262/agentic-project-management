/**
 * APM Downloader Module
 *
 * Handles fetching and extracting AI assistant bundles from GitHub releases.
 * Provides functions for release discovery, manifest fetching, and bundle extraction.
 *
 * Supports authentication for private repositories via:
 * - GITHUB_TOKEN environment variable
 * - GitHub CLI (gh auth token) fallback
 *
 * @module downloader
 */

import { execSync } from 'child_process';
import axios from 'axios';
import { createWriteStream, unlink } from 'fs';
import { join } from 'path';
import AdmZip from 'adm-zip';
import logger from './logger.js';
import { isManifestVersionSupported, validateReleaseManifest } from './manifest-schema.js';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Default GitHub repository for official APM templates
 * @constant {Object}
 */
export const DEFAULT_REPO = {
  owner: 'sdi2200262',
  repo: 'agentic-project-management'
};

/**
 * Cached GitHub token to avoid repeated lookups
 * @type {string|null|undefined}
 * @private
 */
let cachedToken;

/**
 * Gets GitHub token from environment or GitHub CLI
 *
 * Priority:
 * 1. GITHUB_TOKEN environment variable
 * 2. gh auth token (if GitHub CLI is installed and authenticated)
 *
 * @returns {string|null} GitHub token or null if not available
 */
export function getGitHubToken() {
  // Return cached token if already looked up
  if (cachedToken !== undefined) {
    return cachedToken;
  }

  // Check environment variable first
  if (process.env.GITHUB_TOKEN) {
    cachedToken = process.env.GITHUB_TOKEN;
    return cachedToken;
  }

  // Try GitHub CLI fallback
  try {
    const token = execSync('gh auth token', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();

    if (token) {
      cachedToken = token;
      return cachedToken;
    }
  } catch {
    // gh CLI not installed or not authenticated - that's fine
  }

  cachedToken = null;
  return null;
}

/**
 * Builds HTTP headers for GitHub API requests
 * Includes Authorization header if token is available
 *
 * @param {Object} [additionalHeaders={}] - Additional headers to include
 * @returns {Object} Headers object for axios requests
 * @private
 */
function buildHeaders(additionalHeaders = {}) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'APM-CLI',
    ...additionalHeaders
  };

  const token = getGitHubToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Formats error message with authentication hint for private repos
 *
 * @param {Error} err - Original error
 * @param {string} repoString - Repository string (owner/repo)
 * @returns {Error} Error with helpful message
 * @private
 */
function formatAuthError(err, repoString) {
  const status = err.response?.status;
  const token = getGitHubToken();

  if (status === 404 && !token) {
    return new Error(
      `Repository ${repoString} not found.\n\n` +
      `If this is a private repository, set GITHUB_TOKEN:\n` +
      `  export GITHUB_TOKEN=ghp_your_token\n\n` +
      `Or authenticate with GitHub CLI:\n` +
      `  gh auth login`
    );
  }

  if (status === 404 && token) {
    return new Error(
      `Repository ${repoString} not found, or your token lacks access.\n` +
      `Ensure your GITHUB_TOKEN has 'repo' scope for private repositories.`
    );
  }

  if (status === 401) {
    return new Error(
      `Authentication failed for ${repoString}.\n` +
      `Your GITHUB_TOKEN may be invalid or expired.`
    );
  }

  if (status === 403) {
    const rateLimitRemaining = err.response?.headers?.['x-ratelimit-remaining'];
    if (rateLimitRemaining === '0') {
      return new Error(
        'GitHub API rate limit exceeded.\n' +
        (token
          ? 'Please wait before trying again.'
          : 'Set GITHUB_TOKEN to increase your rate limit:\n  export GITHUB_TOKEN=ghp_your_token')
      );
    }
    return new Error(`Access forbidden to ${repoString}. Check your token permissions.`);
  }

  return err;
}

/**
 * Parses a repository string into owner and repo components
 * @param {string} repoString - Repository string in "owner/repo" format
 * @returns {{ owner: string, repo: string } | null} Parsed repo object or null if invalid
 */
export function parseRepoString(repoString) {
  if (!repoString || typeof repoString !== 'string') {
    return null;
  }

  const parts = repoString.split('/');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return null;
  }

  return {
    owner: parts[0],
    repo: parts[1]
  };
}

/**
 * Fetches all releases from a GitHub repository
 * @param {{ owner: string, repo: string }} repoConfig - Repository configuration
 * @returns {Promise<Object[]>} Array of release objects from GitHub API
 * @throws {Error} If repository not found or API rate limit exceeded
 */
export async function fetchReleases({ owner, repo } = DEFAULT_REPO) {
  const endpoint = `${GITHUB_API_BASE}/repos/${owner}/${repo}/releases`;
  const repoString = `${owner}/${repo}`;

  logger.dim(`  Fetching releases from ${repoString}...`);

  try {
    const response = await axios.get(endpoint, {
      headers: buildHeaders(),
      params: { per_page: 100 }
    });

    return response.data;
  } catch (err) {
    throw formatAuthError(err, repoString);
  }
}

/**
 * Fetches a specific release by tag from a GitHub repository
 * @param {{ owner: string, repo: string, tag: string }} config - Repository and tag configuration
 * @returns {Promise<Object>} Release data from GitHub API
 * @throws {Error} If release not found or API rate limit exceeded
 */
export async function fetchRelease({ owner, repo, tag } = {}) {
  const repoOwner = owner || DEFAULT_REPO.owner;
  const repoName = repo || DEFAULT_REPO.repo;
  const repoString = `${repoOwner}/${repoName}`;

  const endpoint = tag
    ? `${GITHUB_API_BASE}/repos/${repoOwner}/${repoName}/releases/tags/${tag}`
    : `${GITHUB_API_BASE}/repos/${repoOwner}/${repoName}/releases/latest`;

  logger.dim(`  Fetching release${tag ? ` ${tag}` : ' (latest)'}...`);

  try {
    const response = await axios.get(endpoint, {
      headers: buildHeaders()
    });

    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      const token = getGitHubToken();
      const baseMsg = tag
        ? `Release ${tag} not found in ${repoString}.`
        : `No releases found in ${repoString}.`;

      if (!token) {
        throw new Error(
          `${baseMsg}\n\n` +
          `If this is a private repository, set GITHUB_TOKEN:\n` +
          `  export GITHUB_TOKEN=ghp_your_token`
        );
      }
      throw new Error(baseMsg);
    }
    throw formatAuthError(err, repoString);
  }
}

/**
 * Fetches and validates the release manifest from a GitHub release
 * @param {{ owner: string, repo: string, tag: string }} config - Repository and tag configuration
 * @returns {Promise<Object>} Validated release manifest
 * @throws {Error} If manifest not found, invalid, or version unsupported
 */
export async function fetchReleaseManifest({ owner, repo, tag } = {}) {
  const repoOwner = owner || DEFAULT_REPO.owner;
  const repoName = repo || DEFAULT_REPO.repo;

  logger.dim(`  Fetching release manifest...`);

  const release = await fetchRelease({ owner: repoOwner, repo: repoName, tag });

  // Find the release manifest asset
  const manifestAsset = release.assets.find(a => a.name === 'apm-release-manifest.json');

  if (!manifestAsset) {
    throw new Error(`Release manifest not found in ${tag || 'latest'} release. This may be a pre-manifest release.`);
  }

  // Download and parse the manifest
  // For private repos, we need to use the API URL with auth, not browser_download_url
  try {
    const token = getGitHubToken();
    let manifestData;

    if (token) {
      // Use API endpoint for authenticated requests
      const response = await axios.get(manifestAsset.url, {
        headers: buildHeaders({ 'Accept': 'application/octet-stream' })
      });
      manifestData = response.data;
    } else {
      // Use browser download URL for public repos
      const response = await axios.get(manifestAsset.browser_download_url, {
        headers: { 'User-Agent': 'APM-CLI' }
      });
      manifestData = response.data;
    }

    const manifest = typeof manifestData === 'string' ? JSON.parse(manifestData) : manifestData;

    // Validate manifest version
    if (!isManifestVersionSupported(manifest.manifestVersion)) {
      throw new Error(
        `Unsupported manifest version: ${manifest.manifestVersion}. ` +
        `Please update your CLI to support this version.`
      );
    }

    // Validate manifest structure
    const validation = validateReleaseManifest(manifest);
    if (!validation.valid) {
      throw new Error(`Invalid release manifest: ${validation.errors.join(', ')}`);
    }

    return manifest;
  } catch (err) {
    if (err.message.includes('Unsupported manifest') || err.message.includes('Invalid release manifest')) {
      throw err;
    }
    throw new Error(`Failed to fetch release manifest: ${err.message}`);
  }
}

/**
 * Downloads and extracts a bundle from a GitHub release
 * @param {{ owner: string, repo: string, tag: string, bundleName: string, destinationPath: string }} config - Download configuration
 * @returns {Promise<void>}
 * @throws {Error} If bundle not found or extraction fails
 */
export async function downloadAndExtractBundle({ owner, repo, tag, bundleName, destinationPath }) {
  const repoOwner = owner || DEFAULT_REPO.owner;
  const repoName = repo || DEFAULT_REPO.repo;

  logger.dim(`  Downloading ${bundleName}...`);

  const release = await fetchRelease({ owner: repoOwner, repo: repoName, tag });

  // Find the bundle asset
  const bundleAsset = release.assets.find(a => a.name === bundleName);

  if (!bundleAsset) {
    throw new Error(`Bundle ${bundleName} not found in release ${tag || 'latest'}.`);
  }

  // Download the asset
  // For private repos, we need to use the API URL with auth
  const token = getGitHubToken();
  let response;

  if (token) {
    // Use API endpoint for authenticated requests
    response = await axios({
      method: 'GET',
      url: bundleAsset.url,
      headers: buildHeaders({ 'Accept': 'application/octet-stream' }),
      responseType: 'stream'
    });
  } else {
    // Use browser download URL for public repos
    response = await axios({
      method: 'GET',
      url: bundleAsset.browser_download_url,
      headers: { 'User-Agent': 'APM-CLI' },
      responseType: 'stream'
    });
  }

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
    throw new Error(`Failed to extract bundle: ${extractError.message}`);
  }

  // Clean up temporary file
  await new Promise(resolve => {
    unlink(tempPath, () => resolve());
  });
}

// ============================================================================
// Legacy compatibility functions (for existing code that uses old API)
// ============================================================================

/**
 * Fetches the latest release information from GitHub API
 * @deprecated Use fetchRelease() instead
 * @param {string} [releaseTag=null] - Optional specific release tag
 * @returns {Promise<Object>} Release data from GitHub API
 */
export async function fetchLatestRelease(releaseTag = null) {
  return fetchRelease({ ...DEFAULT_REPO, tag: releaseTag });
}

/**
 * Parses a template tag to extract base version and build number
 * @param {string} tagName - Tag name (e.g., "v0.5.1+templates.2")
 * @returns {Object|null} Object with baseVersion and buildNumber, or null if invalid
 * @private
 */
function parseTemplateTag(tagName) {
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
 * Compares two version strings
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
 * Finds the latest template tag across all versions
 * @param {{ owner: string, repo: string }} repoConfig - Repository configuration
 * @returns {Promise<Object|null>} Object with tag_name, baseVersion, and release_notes
 */
export async function findLatestTemplateTag({ owner, repo } = DEFAULT_REPO) {
  let releases;
  try {
    releases = await fetchReleases({ owner, repo });
  } catch {
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

  templateTags.sort((a, b) => {
    const baseComparison = compareVersions(a.baseVersion, b.baseVersion);
    if (baseComparison !== 0) return -baseComparison;
    return b.buildNumber - a.buildNumber;
  });

  return templateTags[0];
}

/**
 * Finds the latest compatible template tag for the given CLI version
 * @param {string} cliVersion - Current CLI version
 * @param {{ owner: string, repo: string }} repoConfig - Repository configuration
 * @returns {Promise<Object|null>} Object with tag_name and release_notes
 */
export async function findLatestCompatibleTemplateTag(cliVersion, { owner, repo } = DEFAULT_REPO) {
  logger.dim(`  Searching compatible templates...`);

  let releases;
  try {
    releases = await fetchReleases({ owner, repo });
  } catch (err) {
    if (err.message.includes('not found')) {
      throw new Error(`Repository ${owner}/${repo} not found.`);
    }
    throw err;
  }

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

  compatibleTags.sort((a, b) => b.buildNumber - a.buildNumber);

  const latest = compatibleTags[0];

  return {
    tag_name: latest.tag_name,
    release_notes: latest.release_notes
  };
}

/**
 * Downloads and extracts a bundle (legacy API)
 * @deprecated Use downloadAndExtractBundle() instead
 * @param {string} targetTag - GitHub release tag
 * @param {string} assistantName - AI assistant name
 * @param {string} destinationPath - Extraction destination
 */
export async function downloadAndExtract(targetTag, assistantName, destinationPath) {
  // Legacy ASSET_MAP for backward compatibility
  const LEGACY_ASSET_MAP = {
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

  const bundleName = LEGACY_ASSET_MAP[assistantName];

  if (!bundleName) {
    throw new Error(`Unsupported AI assistant: ${assistantName}`);
  }

  return downloadAndExtractBundle({
    ...DEFAULT_REPO,
    tag: targetTag,
    bundleName,
    destinationPath
  });
}
