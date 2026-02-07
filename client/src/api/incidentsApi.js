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
const MOCK_INCIDENTS = [
  {
    _id: 'mock-1',
    type: 'incident',
    category: 'flood',
    description: 'Flooding on Main Street near the park. Water is about knee-high.',
    lat: 53.8008,
    lon: -1.5491,
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(), // 10 mins ago
  },
  {
    _id: 'mock-2',
    type: 'need_help',
    category: 'medical',
    description: 'Elderly person needs help getting to shelter. Unable to walk far.',
    lat: 53.8025,
    lon: -1.5450,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 mins ago
  },
  {
    _id: 'mock-3',
    type: 'can_help',
    category: 'supplies',
    description: 'I have spare bottled water and blankets. Can deliver within 2km.',
    lat: 53.7980,
    lon: -1.5520,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(), // 45 mins ago
  },
  {
    _id: 'mock-4',
    type: 'incident',
    category: 'power',
    description: 'Power lines down on Oak Avenue. Area blocked off.',
    lat: 53.8050,
    lon: -1.5400,
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
  },
  {
    _id: 'mock-5',
    type: 'need_help',
    category: 'travel',
    description: 'Car stuck in flood water on Bridge Road. Need tow or lift.',
    lat: 53.7960,
    lon: -1.5550,
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

