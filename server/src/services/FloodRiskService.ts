import fs from "fs";
import path from "path";
import { featureCollection, Feature, Polygon, MultiPolygon } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { LatLng } from "./routing/types";

const floodGeoJsonPath = path.join(__dirname, "../data/flood_zones.geojson");
const floodData = JSON.parse(fs.readFileSync(floodGeoJsonPath, "utf8"));

export class FloodRiskService {
  polygons: Feature<Polygon | MultiPolygon>[];
  constructor() {
    this.polygons = (floodData.features || []).filter(
      (f: any) => f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon"
    );
  }
  getFloodRiskAtPoint(point: LatLng): number {
    for (const poly of this.polygons) {
      if (booleanPointInPolygon([point.lon, point.lat], poly)) {
        return 1; // You can refine this to use a risk property if present
      }
    }
    return 0;
  }
}
