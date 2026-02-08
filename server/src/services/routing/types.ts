export type LatLng = { lat: number; lon: number };

export type Route = {
  id: string;
  coordinates: LatLng[];
  distanceMeters: number;
  durationSeconds: number;
};

export type Shelter = {
  id: string;
  name: string;
  location: LatLng;
  capacity: number;
  currentOccupancy: number;
};

export type RouteScore = {
  routeId: string;
  incidentScore: number;
  floodRiskScore: number;
  elevationScore: number;
  shelterOccupancyScore: number;
  travelTimeScore: number;
  safetyScore: number;
  explanation: string;
  route: Route;
  shelter: Shelter;
};

export type EnvironmentMode = "normal" | "flood" | "storm";
