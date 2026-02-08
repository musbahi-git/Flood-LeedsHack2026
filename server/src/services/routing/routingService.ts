import { getCandidateRoutes } from "./externalRoutingApi";
import { getShelters } from "../shelterService";
import { scoreRoutes } from "./scoringService";
import { EnvironmentMode, LatLng, Route, Shelter } from "./types";

export async function chooseBestRouteAndShelter(
  origin: LatLng,
  mode: EnvironmentMode
): Promise<{
  chosenRoute: Route;
  alternatives: Route[];
  explanation: string;
}> {
  // 1. Load shelters and filter by occupancy
  const shelters = await getShelters();
  const availableShelters = shelters.filter(
    (s) => s.currentOccupancy < s.capacity
  );

  // 2. For each shelter, get candidate routes
  let allRoutes: { route: Route; shelter: Shelter }[] = [];
  for (const shelter of availableShelters) {
    const routes = await getCandidateRoutes(origin, shelter.location, 3); // 3 candidates
    for (const route of routes) {
      allRoutes.push({ route, shelter });
    }
  }

  // 3. Score all routes
  const scored = await scoreRoutes(allRoutes, mode);

  // 4. Pick best by safetyScore
  scored.sort((a, b) => a.safetyScore - b.safetyScore);
  const chosen = scored[0];

  // 5. Prepare alternatives and explanation
  const alternatives = scored.slice(1, 3).map((s) => s.route);
  return {
    chosenRoute: chosen.route,
    alternatives,
    explanation: chosen.explanation,
  };
}
