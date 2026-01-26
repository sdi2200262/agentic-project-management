/**
 * GitHub API Service Module
 *
 * Provides GitHub API access with optional authentication.
 *
 * @module src/services/github
 */

import { execSync } from 'child_process';
import axios from 'axios';
import { GITHUB_API_BASE } from '../core/constants.js';
import { CLIError } from '../core/errors.js';

/**
 * Gets GitHub authentication token.
 * Checks GITHUB_TOKEN env var first, then tries gh CLI.
 *
 * @returns {string|null} Auth token or null if not available.
 */
export function getToken() {
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN;
  }

  try {
    const token = execSync('gh auth token', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    return token || null;
  } catch {
    return null;
  }
}

/**
 * Creates axios instance with optional auth headers.
 *
 * @returns {Object} Axios instance.
 */
function createClient() {
  const token = getToken();
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'apm-cli'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return axios.create({
    baseURL: GITHUB_API_BASE,
    headers,
    timeout: 30000
  });
}

/**
 * Fetches JSON from GitHub API.
 *
 * @param {string} path - API path (e.g., '/repos/owner/repo/releases').
 * @returns {Promise<Object>} Response data.
 * @throws {CLIError} On network failure.
 */
export async function fetchJSON(path) {
  const client = createClient();

  try {
    const response = await client.get(path);
    return response.data;
  } catch (err) {
    const reason = err.response?.status
      ? `HTTP ${err.response.status}`
      : err.message;
    throw CLIError.networkError(`${GITHUB_API_BASE}${path}`, reason);
  }
}

/**
 * Fetches a release asset (follows redirects).
 *
 * @param {string} url - Asset download URL.
 * @returns {Promise<Buffer>} Asset contents as buffer.
 * @throws {CLIError} On download failure.
 */
export async function fetchAsset(url) {
  const token = getToken();
  const headers = {
    Accept: 'application/octet-stream',
    'User-Agent': 'apm-cli'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios.get(url, {
      headers,
      responseType: 'arraybuffer',
      timeout: 120000,
      maxRedirects: 5
    });
    return Buffer.from(response.data);
  } catch (err) {
    const reason = err.response?.status
      ? `HTTP ${err.response.status}`
      : err.message;
    throw CLIError.downloadFailed(url, reason);
  }
}

export default {
  getToken,
  fetchJSON,
  fetchAsset
};
