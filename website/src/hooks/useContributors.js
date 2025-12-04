import { useState, useEffect } from 'react';
import { getCachedData, setCachedData } from '../utils/cache';
import { fetchContributors } from '../utils/api';

const CACHE_KEY = 'apm-contributors';
const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Custom hook to fetch and cache GitHub contributors
 * @returns {Object} - Object containing contributors array, isLoading, and error
 */
export function useContributors() {
  const [contributors, setContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContributors = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check cache first
        const cached = getCachedData(CACHE_KEY, DEFAULT_TTL);
        if (cached) {
          setContributors(cached);
          setIsLoading(false);
          return;
        }

        // Fetch fresh data
        const data = await fetchContributors();
        setContributors(data);

        // Cache the results
        setCachedData(CACHE_KEY, data, DEFAULT_TTL);
      } catch (err) {
        console.error('Error loading contributors:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadContributors();
  }, []);

  return {
    contributors,
    isLoading,
    error,
  };
}

