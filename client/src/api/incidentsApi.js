import axios from 'axios';

// ============================================
// MOCK/REAL API SWITCH
// Set to false when backend is ready
// ============================================
const USE_MOCK_API = false;


// Helper to get API base URL in a Jest-safe way
function getApiBase() {
  if (typeof process !== 'undefined' && process.env && process.env.JEST_WORKER_ID) {
    return process.env.VITE_API_URL || '/api';
  }
  // In Vite, import.meta.env.VITE_API_URL will be replaced at build time
  return '/api';
}

const API_BASE = getApiBase();

// ============================================
// MOCK DATA
// ============================================
const MOCK_INCIDENTS = [
  {
    _id: 'mock-1',
    type: 'incident',
    category: 'flood',
    description: 'Flooding on Main Street near the park. Water is about knee-high.',
    lat: 53.8008,
    lon: -1.5491,
    userId: 'other-user-1',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(), // 10 mins ago
  },
  {
    _id: 'mock-2',
    type: 'need_help',
    category: 'medical',
    description: 'Elderly person needs help getting to shelter. Unable to walk far.',
    lat: 53.8025,
    lon: -1.545,
    userId: 'other-user-2',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 mins ago
  },
  {
    _id: 'mock-3',
    type: 'can_help',
    category: 'supplies',
    description: 'I have spare bottled water and blankets. Can deliver within 2km.',
    lat: 53.798,
    lon: -1.552,
    userId: 'other-user-1',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(), // 45 mins ago
  },
  {
    _id: 'mock-4',
    type: 'incident',
    category: 'power',
    description: 'Power lines down on Oak Avenue. Area blocked off.',
    lat: 53.805,
    lon: -1.54,
    userId: 'other-user-3',
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
  },
  {
    _id: 'mock-5',
    type: 'need_help',
    category: 'travel',
    description: 'Car stuck in flood water on Bridge Road. Need tow or lift.',
    lat: 53.796,
    lon: -1.555,
    userId: 'other-user-2',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
  },
];

// Keep track of dynamically added mock incidents
let dynamicMockIncidents = [];

/**
 * Incidents API
 * Handles all incident-related API calls.
 */

/**
 * Get incidents with optional filters.
 */
export async function getIncidents(params = {}) {
  if (USE_MOCK_API) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('[MOCK] getIncidents called with:', params);
    return [...MOCK_INCIDENTS, ...dynamicMockIncidents];
  }

  // Real API call
  try {
    const response = await axios.get(`${API_BASE}/incidents`, { 
      params,
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('[incidentsApi] getIncidents error:', error);
    throw error;
  }
}

/**
 * Create a new incident.
 */
export async function createIncident(body) {
  if (USE_MOCK_API) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('[MOCK] createIncident called with:', body);
    
    const newIncident = {
      _id: `mock-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    // Add to dynamic mock incidents so it shows up in subsequent calls
    dynamicMockIncidents.push(newIncident);
    
    return newIncident;
  }

  // Real API call
  try {
    const response = await axios.post(`${API_BASE}/incidents`, body, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('[incidentsApi] createIncident error:', error);
    throw error;
  }
}

