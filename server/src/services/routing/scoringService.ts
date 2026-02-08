import { getIncidentScoreAtPoint } from "./incidentService";
import { getFloodRiskAtPoint } from "./riskService";
import { getElevationAtPoint } from "./elevationService";
import { samplePolyline } from "./sampling";
import { EnvironmentMode, Route, Shelter, RouteScore } from "./types";

function getWeightsForMode(mode: EnvironmentMode) {
	if (mode === "flood") {
		return { incident: 0.2, flood: 0.4, elevation: 0.2, occupancy: 0.1, travelTime: 0.1 };
	}
	// Default: normal
	return { incident: 0.4, flood: 0.2, elevation: 0.1, occupancy: 0.2, travelTime: 0.1 };
}

function normalizeIncident(val: number) {
	// Assume val in [0, 1] for now
	return Math.min(val, 1);
}
function normalizeFlood(val: number) {
	return Math.min(val, 1);
}
function normalizeElevation(val: number, mode: EnvironmentMode) {
	// In flood mode, higher is better (lower score)
	if (mode === "flood") {
		return 1 - Math.min(val, 1);
	}
	return 0.5; // Neutral in normal mode
}
function normalizeTravelTime(val: number) {
	// Assume 30 min (1800s) is 0, 90 min (5400s) is 1
	return Math.max(0, Math.min((val - 1800) / 3600, 1));
}

function generateExplanation(scores: {
	incidentScore: number;
	floodRiskScore: number;
	elevationScore: number;
	shelterOccupancyScore: number;
	travelTimeScore: number;
	safetyScore: number;
	mode: EnvironmentMode;
}): string {
	return `This route avoids ${Math.round(scores.incidentScore * 10)} recent incidents, stays ${Math.round(scores.elevationScore * 10)}m higher than alternatives, and leads to a shelter with ${Math.round((1 - scores.shelterOccupancyScore) * 100)}% capacity remaining.`;
}

export async function scoreRoutes(
	routesWithShelters: { route: Route; shelter: Shelter }[],
	mode: EnvironmentMode
): Promise<RouteScore[]> {
	const weights = getWeightsForMode(mode);
	const results: RouteScore[] = [];
	for (const { route, shelter } of routesWithShelters) {
		const samples = samplePolyline(route.coordinates, 50); // every 50m
		let incidentSum = 0, floodSum = 0, elevationSum = 0;
		for (const point of samples) {
			incidentSum += await getIncidentScoreAtPoint(point);
			floodSum += await getFloodRiskAtPoint(point);
			elevationSum += await getElevationAtPoint(point);
		}
		const n = samples.length || 1;
		const incidentScore = normalizeIncident(incidentSum / n);
		const floodRiskScore = normalizeFlood(floodSum / n);
		const elevationScore = normalizeElevation(elevationSum / n, mode);
		const shelterOccupancyScore = shelter.currentOccupancy / shelter.capacity;
		const travelTimeScore = normalizeTravelTime(route.durationSeconds);
		const safetyScore =
			weights.incident * incidentScore +
			weights.flood * floodRiskScore +
			weights.elevation * elevationScore +
			weights.occupancy * shelterOccupancyScore +
			weights.travelTime * travelTimeScore;
		const explanation = generateExplanation({
			incidentScore,
			floodRiskScore,
			elevationScore,
			shelterOccupancyScore,
			travelTimeScore,
			safetyScore,
			mode,
		});
		results.push({
			routeId: route.id,
			incidentScore,
			floodRiskScore,
			elevationScore,
			shelterOccupancyScore,
			travelTimeScore,
			safetyScore,
			explanation,
			route,
			shelter,
		});
	}
	return results;
}