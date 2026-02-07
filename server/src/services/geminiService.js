/**
 * Gemini Service
 * Handles AI-powered route selection using Google Gemini.
 * 
 * TODO: Person C - Implement real Gemini API integration.
 */

const axios = require('axios');

/**
 * Use Gemini to choose the safest route and generate explanation.
 * 
 * @param {Array} routeSummaries - Array of scored route summaries
 * @returns {Promise<Object>} { chosenRouteId, explanation }
 * 
 * TODO: Person C - Implement Gemini API call:
 * - Use GEMINI_API_KEY from environment
 * - Construct prompt with route summaries
 * - Parse response to extract chosen route and explanation
 */
async function chooseRouteWithGemini(routeSummaries) {
  console.log('[geminiService] chooseRouteWithGemini called - stubbed');

  // TODO: Implement real Gemini API call
  // const apiKey = process.env.GEMINI_API_KEY;
  // const prompt = buildPrompt(routeSummaries);
  // const response = await callGeminiAPI(apiKey, prompt);
  // return parseGeminiResponse(response);

  // Stubbed response - choose route with lowest danger score
  const sortedRoutes = [...routeSummaries].sort((a, b) => a.dangerScore - b.dangerScore);
  const chosenRoute = sortedRoutes[0];

  return {
    chosenRouteId: chosenRoute?.id ?? 0,
    explanation: `Placeholder explanation: Route ${chosenRoute?.id ?? 0} was selected as the safest option with a danger score of ${chosenRoute?.dangerScore?.toFixed(3) ?? 'N/A'}. This route avoids major flood zones and has fewer reported incidents nearby.`,
  };
}

/**
 * Build prompt for Gemini with route data.
 * 
 * @param {Array} routeSummaries - Route summaries
 * @returns {string} Formatted prompt string
 * 
 * TODO: Person C - Design effective prompt for route selection
 */
function buildPrompt(routeSummaries) {
  // TODO: Implement prompt construction
  // Include:
  // - Current weather/flood conditions
  // - Route summaries with scores
  // - Request for selection + explanation
  
  return `Given these route options with danger scores, select the safest route and explain why: ${JSON.stringify(routeSummaries)}`;
}

/**
 * Call Gemini API with a prompt.
 * 
 * @param {string} apiKey - Gemini API key
 * @param {string} prompt - Prompt text
 * @returns {Promise<Object>} Gemini API response
 * 
 * TODO: Person C - Implement API call
 */
async function callGeminiAPI(apiKey, prompt) {
  // TODO: Implement Gemini API call
  // Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
  
  return null;
}

/**
 * Parse Gemini response to extract route selection.
 * 
 * @param {Object} response - Gemini API response
 * @returns {Object} { chosenRouteId, explanation }
 * 
 * TODO: Person C - Parse and validate response
 */
function parseGeminiResponse(response) {
  // TODO: Extract structured data from Gemini response
  return {
    chosenRouteId: 0,
    explanation: 'Unable to parse response',
  };
}

module.exports = {
  chooseRouteWithGemini,
  buildPrompt,
  callGeminiAPI,
  parseGeminiResponse,
};
