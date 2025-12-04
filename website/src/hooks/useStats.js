import { useState, useEffect } from 'react';
import { getCachedData, setCachedData } from '../utils/cache';
import { fetchGitHubStats, fetchNPMStats } from '../utils/api';
import { CACHE_CONFIG } from '../constants/cache';

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
        const cached = getCachedData(CACHE_CONFIG.STATS_KEY, CACHE_CONFIG.DEFAULT_TTL);
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
          CACHE_CONFIG.STATS_KEY,
          {
            githubStars: stars,
            npmDownloads: downloads,
          },
          CACHE_CONFIG.DEFAULT_TTL
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

