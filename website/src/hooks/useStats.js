import { useState, useEffect } from 'react';
import { getCachedData, setCachedData } from '../utils/cache';
import { fetchGitHubStats, fetchNPMStats } from '../utils/api';

const CACHE_KEY = 'apm-github-npm-stats';
const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Custom hook to fetch and cache GitHub and NPM statistics
 * @returns {Object} - Object containing githubStars, npmDownloads, isLoading, and error
 */
export function useStats() {
  const [githubStars, setGithubStars] = useState(null);
  const [npmDownloads, setNpmDownloads] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check cache first
        const cached = getCachedData(CACHE_KEY, DEFAULT_TTL);
        if (cached) {
          setGithubStars(cached.githubStars);
          setNpmDownloads(cached.npmDownloads);
          setIsLoading(false);
          return;
        }

        // Fetch fresh data
        const [githubData, npmData] = await Promise.all([
          fetchGitHubStats().catch(() => ({ stars: null })),
          fetchNPMStats().catch(() => null),
        ]);

        const stars = githubData?.stars ?? null;
        const downloads = npmData ?? null;

        setGithubStars(stars);
        setNpmDownloads(downloads);

        // Cache the results
        setCachedData(
          CACHE_KEY,
          {
            githubStars: stars,
            npmDownloads: downloads,
          },
          DEFAULT_TTL
        );
      } catch (err) {
        console.error('Error loading stats:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return {
    githubStars,
    npmDownloads,
    isLoading,
    error,
  };
}

