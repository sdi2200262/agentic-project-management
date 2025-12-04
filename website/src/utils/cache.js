/**
 * Client-side caching utility using localStorage
 * Handles caching with TTL (time-to-live) support
 */

/**
 * Check if cached data is still valid
 * @param {Object} cachedData - The cached data object with timestamp and ttl
 * @param {number} ttl - Time-to-live in milliseconds
 * @returns {boolean} - True if cache is valid, false otherwise
 */
export function isCacheValid(cachedData, ttl) {
  if (!cachedData || !cachedData.timestamp) {
    return false;
  }
  
  const now = Date.now();
  const age = now - cachedData.timestamp;
  const cacheTTL = cachedData.ttl || ttl;
  
  return age < cacheTTL;
}

/**
 * Retrieve cached data if it exists and is valid
 * @param {string} key - Cache key
 * @param {number} ttl - Time-to-live in milliseconds
 * @returns {Object|null} - Cached data or null if not found/invalid
 */
export function getCachedData(key, ttl) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    
    const cached = window.localStorage.getItem(key);
    if (!cached) {
      return null;
    }
    
    const cachedData = JSON.parse(cached);
    
    if (isCacheValid(cachedData, ttl)) {
      return cachedData.data;
    }
    
    // Cache expired, remove it
    window.localStorage.removeItem(key);
    return null;
  } catch (error) {
    // Handle errors gracefully (localStorage may be disabled, corrupted data, etc.)
    console.warn('Error reading from cache:', error);
    return null;
  }
}

/**
 * Store data in cache with TTL
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 * @param {number} ttl - Time-to-live in milliseconds
 */
export function setCachedData(key, data, ttl) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    
    const cacheObject = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    
    window.localStorage.setItem(key, JSON.stringify(cacheObject));
  } catch (error) {
    // Handle errors gracefully (localStorage may be disabled, quota exceeded, etc.)
    console.warn('Error writing to cache:', error);
  }
}

