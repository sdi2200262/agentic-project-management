import { useState, useEffect } from 'react';
import { getCachedData, setCachedData } from '../utils/cache';
import { fetchGitHubStats, fetchNPMStats, fetchNPMAllTimeStats } from '../utils/api';

const CACHE_KEY = 'apm-github-npm-stats';
const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Custom hook to fetch and cache GitHub and NPM statistics
 * @returns {Object} - Object containing githubStars, npmDownloads, npmAllTimeDownloads, isLoading, and error
 */
export function useStats() {
  const [githubStars, setGithubStars] = useState(null);
  const [npmDownloads, setNpmDownloads] = useState(null);
  const [npmAllTimeDownloads, setNpmAllTimeDownloads] = useState(null);
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
          setNpmAllTimeDownloads(cached.npmAllTimeDownloads);
          setIsLoading(false);
          return;
        }

        // Fetch fresh data
        const [githubData, npmData, npmAllTimeData] = await Promise.all([
          fetchGitHubStats().catch(() => ({ stars: null })),
          fetchNPMStats().catch(() => null),
          fetchNPMAllTimeStats().catch(() => null),
        ]);

        const stars = githubData?.stars ?? null;
        const downloads = npmData ?? null;
        const allTimeDownloads = npmAllTimeData ?? null;

        setGithubStars(stars);
        setNpmDownloads(downloads);
        setNpmAllTimeDownloads(allTimeDownloads);

        // Cache the results
        setCachedData(
          CACHE_KEY,
          {
            githubStars: stars,
            npmDownloads: downloads,
            npmAllTimeDownloads: allTimeDownloads,
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
    npmAllTimeDownloads,
    isLoading,
    error,
  };
}

