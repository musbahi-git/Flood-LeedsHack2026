import axios from 'axios';

// ============================================
// MOCK/REAL API SWITCH
// Set to false when backend is ready
// ============================================
const USE_MOCK_API = false;


// Helper to get API base URL in a Jest-safe way
function getApiBase() {
  // Use VITE_API_URL if set, else fallback to '/api'
  return (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
}

const API_BASE = getApiBase();

// ============================================
// MOCK DATA
// ============================================
const createMockRoute = (origin) => {
  // Generate a mock route from origin to a mock shelter (Leeds City Centre area)
  const shelterLat = 53.7997;
  const shelterLon = -1.5445;
  
  // Create intermediate waypoints
  const latStep = (shelterLat - origin.lat) / 4;
  const lonStep = (shelterLon - origin.lon) / 4;
  
  return {
    routes: [
      {
        id: 'mock-0',
        coordinates: [
          { lat: origin.lat, lon: origin.lon },
          { lat: origin.lat + latStep, lon: origin.lon + lonStep + 0.002 }, // slight detour
          { lat: origin.lat + latStep * 2, lon: origin.lon + lonStep * 2 - 0.001 },
          { lat: origin.lat + latStep * 3, lon: origin.lon + lonStep * 3 + 0.001 },
          { lat: shelterLat, lon: shelterLon },
        ],
        dangerScore: 0.15,
        distance: 1.2, // km
        duration: 15, // minutes
      },
    ],
    chosenRouteId: 'mock-0',
    explanation: "🛡️ This route avoids 2 reported flood incidents on Main Street and takes you via higher ground through the park. Estimated walk time: 15 minutes. The shelter at Leeds City Hall has confirmed availability.",
    shelter: {
      id: 'shelter-1',
      name: 'Leeds City Hall Emergency Shelter',
      lat: shelterLat,
      lon: shelterLon,
      capacity: 200,
      currentOccupancy: 45,
    },
  };
};

/**
 * Routes API
 * Handles safe route calculation requests.
 */

/**
 * Get AI-assisted safe route to shelter.
 */
export async function getSafeRoute(body) {
  if (USE_MOCK_API) {
    // Simulate network delay (route calculation takes time)
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('[MOCK] getSafeRoute called with:', body);
    
    const origin = body.origin || { lat: 53.8008, lon: -1.5491 };
    return createMockRoute(origin);
  }

  // Real API call
  try {
    const response = await axios.post(`${API_BASE}/routes/safe`, body, {
      timeout: 30000, // Longer timeout for route calculation
    });
    return response.data;
  } catch (error) {
    console.error('[routesApi] getSafeRoute error:', error);
    throw error;
  }
}

