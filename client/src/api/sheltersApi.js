import axios from 'axios';

// ============================================
// MOCK/REAL API SWITCH
// Set to false when backend is ready
// ============================================
const USE_MOCK_API = false;

// API base URL - uses Vite proxy in development
const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ============================================
// MOCK DATA
// ============================================
const MOCK_SHELTERS = [
  {
    id: 'shelter-1',
    name: 'Leeds City Hall Emergency Shelter',
    lat: 53.7997,
    lon: -1.5445,
    address: 'The Headrow, Leeds LS1 3AD',
    capacity: 200,
    currentOccupancy: 45,
    amenities: ['water', 'food', 'medical', 'charging'],
  },
  {
    id: 'shelter-2',
    name: 'Leeds Arena Community Centre',
    lat: 53.7885,
    lon: -1.5486,
    address: 'Claypit Lane, Leeds LS2 8BY',
    capacity: 500,
    currentOccupancy: 120,
    amenities: ['water', 'food', 'beds', 'wifi'],
  },
  {
    id: 'shelter-3',
    name: 'University of Leeds Sports Hall',
    lat: 53.8067,
    lon: -1.5550,
    address: 'Woodhouse Lane, Leeds LS2 9JT',
    capacity: 300,
    currentOccupancy: 80,
    amenities: ['water', 'food', 'showers'],
  },
];

/**
 * Shelters API
 * Handles all shelter-related API calls.
 */

/**
 * Get all shelters.
 */
export async function getShelters() {
  if (USE_MOCK_API) {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('[MOCK] getShelters called');
    return MOCK_SHELTERS;
  }

  // Real API call
  try {
    const response = await axios.get(`${API_BASE}/shelters`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('[sheltersApi] getShelters error:', error);
    throw error;
  }
}

/**
 * Get nearest shelter to a location.
 */
export async function getNearestShelter(lat, lon) {
  if (USE_MOCK_API) {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('[MOCK] getNearestShelter called with:', { lat, lon });
    
    // Simple distance calculation to find nearest
    let nearest = MOCK_SHELTERS[0];
    let minDist = Infinity;
    
    for (const shelter of MOCK_SHELTERS) {
      const dist = Math.sqrt(
        Math.pow(shelter.lat - lat, 2) + Math.pow(shelter.lon - lon, 2)
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = shelter;
      }
    }
    
    return nearest;
  }

  // Real API call
  try {
    const response = await axios.get(`${API_BASE}/shelters`, {
      params: { lat, lon, limit: 1 },
      timeout: 10000,
    });
    return response.data[0] || null;
  } catch (error) {
    console.error('[sheltersApi] getNearestShelter error:', error);
    throw error;
  }
}

