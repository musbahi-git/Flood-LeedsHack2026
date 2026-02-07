import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'haven_user_id';

/**
 * Get or create a unique anonymous user ID.
 * Stored in localStorage for persistence across sessions.
 * 
 * @returns {string} UUID for this device/browser
 */
export function getOrCreateUserId() {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(STORAGE_KEY, id);
    console.log('[userId] Created new anonymous user ID:', id);
  }
  return id;
}

/**
 * Get the current user ID without creating one.
 * @returns {string|null} UUID or null if not set
 */
export function getUserId() {
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * Clear the user ID (for testing/reset purposes).
 */
export function clearUserId() {
  localStorage.removeItem(STORAGE_KEY);
}
