/**
 * Release Service Module
 *
 * Provides release fetching, filtering, and manifest retrieval.
 *
 * @module src/services/releases
 */

import { fetchJSON, fetchAsset } from './github.js';
import { OFFICIAL_REPO, CLI_MAJOR_VERSION, RELEASE_MANIFEST } from '../core/constants.js';
import { CLIError } from '../core/errors.js';
import { validateReleaseManifest } from '../schemas/release.js';

/**
 * Parses semantic version from tag string.
 * Supports pre-release suffixes (e.g., 'v1.0.0-test-1').
 *
 * @param {string} tag - Version tag (e.g., 'v1.2.3' or 'v1.2.3-beta-1').
 * @returns {Object|null} Parsed version { major, minor, patch, prerelease } or null.
 */
function parseVersion(tag) {
  const match = tag.match(/^v?(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
  if (!match) return null;

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4] || null
  };
}

/**
 * Checks if a release is stable (no pre-release suffix).
 *
 * @param {Object} release - Release object from GitHub API.
 * @returns {boolean} True if stable release.
 */
function isStableRelease(release) {
  const version = parseVersion(release.tag_name);
  return version && !version.prerelease;
}

/**
 * Fetches all releases from a repository.
 *
 * @param {Object} repo - Repository object { owner, repo }.
 * @returns {Promise<Object[]>} Array of release objects.
 */
export async function fetchReleases(repo) {
  const path = `/repos/${repo.owner}/${repo.repo}/releases`;
  return fetchJSON(path);
}

/**
 * Filters releases by major version.
 *
 * @param {Object[]} releases - Array of release objects.
 * @param {number} major - Major version to filter for.
 * @returns {Object[]} Filtered releases.
 */
export function filterByMajorVersion(releases, major) {
  return releases.filter(release => {
    const version = parseVersion(release.tag_name);
    return version && version.major === major;
  });
}

/**
 * Gets the latest stable release from an array.
 * Pre-release versions (e.g., v1.0.0-test-1) are excluded.
 *
 * @param {Object[]} releases - Array of release objects.
 * @returns {Object|null} Latest stable release or null if none.
 */
export function getLatestRelease(releases) {
  const stableReleases = releases.filter(isStableRelease);
  if (!stableReleases.length) return null;

  return stableReleases.reduce((latest, release) => {
    const latestVersion = parseVersion(latest.tag_name);
    const currentVersion = parseVersion(release.tag_name);

    if (!currentVersion) return latest;
    if (!latestVersion) return release;

    if (currentVersion.major > latestVersion.major) return release;
    if (currentVersion.major < latestVersion.major) return latest;
    if (currentVersion.minor > latestVersion.minor) return release;
    if (currentVersion.minor < latestVersion.minor) return latest;
    if (currentVersion.patch > latestVersion.patch) return release;

    return latest;
  });
}

/**
 * Fetches and validates release manifest from a release.
 *
 * @param {Object} release - Release object from GitHub API.
 * @returns {Promise<Object>} Validated manifest object.
 * @throws {CLIError} If manifest missing or invalid.
 */
export async function fetchReleaseManifest(release) {
  const manifestAsset = release.assets.find(a => a.name === RELEASE_MANIFEST);

  if (!manifestAsset) {
    throw CLIError.manifestMissing(release.tag_name);
  }

  const manifestBuffer = await fetchAsset(manifestAsset.browser_download_url);
  let manifest;

  try {
    manifest = JSON.parse(manifestBuffer.toString('utf8'));
  } catch {
    throw CLIError.manifestInvalid(release.tag_name, ['Invalid JSON']);
  }

  const validation = validateReleaseManifest(manifest);

  if (!validation.valid) {
    throw CLIError.manifestInvalid(release.tag_name, validation.errors);
  }

  return manifest;
}

/**
 * Finds a bundle asset in a release.
 *
 * @param {Object} release - Release object from GitHub API.
 * @param {string} bundleName - Bundle filename to find.
 * @returns {Object|null} Asset object or null if not found.
 */
export function findBundleAsset(release, bundleName) {
  return release.assets.find(a => a.name === bundleName) || null;
}

/**
 * Fetches releases from official repo, filtered to CLI major version.
 *
 * @returns {Promise<Object[]>} Filtered releases.
 */
export async function fetchOfficialReleases() {
  const releases = await fetchReleases(OFFICIAL_REPO);
  return filterByMajorVersion(releases, CLI_MAJOR_VERSION);
}

/**
 * Fetches all releases from a custom repo (no filtering).
 *
 * @param {string} repoString - Repository in 'owner/repo' format.
 * @returns {Promise<Object[]>} All releases.
 */
export async function fetchCustomReleases(repoString) {
  const [owner, repo] = repoString.split('/');
  return fetchReleases({ owner, repo });
}

export default {
  fetchReleases,
  filterByMajorVersion,
  getLatestRelease,
  fetchReleaseManifest,
  findBundleAsset,
  fetchOfficialReleases,
  fetchCustomReleases
};
