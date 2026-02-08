const Incident = require('../models/Incident');
const { getFloodRisk } = require('./floodRiskService');
const { haversineDistance } = require('../utils/geo');

/**
 * Calculates a weight for a single edge based on environmental risk.
 * edgeData expected to contain: { baseTime, distance, coordinates }
 */
async function calculateEdgeCost(edgeData, env) {
  let penaltyMultiplier = 1.0;

  // 1. HARD BLOCK: Check for Severe Warnings or Verified Closures
  const floodRisk = getFloodRisk(edgeData.coordinates); 
  if (floodRisk.severity === 'severe') return Infinity;

  // 2. SOFT RISK: Add penalties for Flood Alerts (Severity 3)
  if (floodRisk.severity === 'alert') penaltyMultiplier += 3.0;

  // 3. INFRASTRUCTURE & HISTORIC PENALTIES
  if (edgeData.isUnderpass) penaltyMultiplier += 2.0;
  if (edgeData.isHistoricZone) penaltyMultiplier += 1.5;

  // 4. COMMUNITY INCIDENTS: Penalty based on proximity to reports
  const recentIncidents = await Incident.find({
    createdAt: { $gte: new Date(Date.now() - 2 * 60 * 60 * 1000) }
  });

  for (const incident of recentIncidents) {
    const [lon, lat] = incident.location.coordinates;
    const d = haversineDistance(edgeData.lat, edgeData.lon, lat, lon);
    if (d < 100) penaltyMultiplier += 5.0; // High risk near incident
    else if (d < 250) penaltyMultiplier += 1.5;
  }

  return edgeData.baseTime * penaltyMultiplier;
}

module.exports = { calculateEdgeCost };