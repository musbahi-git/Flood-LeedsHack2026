import fs from "fs";
import path from "path";
import GeoTIFF from "geotiff";
import { LatLng } from "./routing/types";

const tiffPath = path.join(__dirname, "../data/srtm_38_03.tif");
let tiff: GeoTIFF.GeoTIFF | null = null;
let image: GeoTIFF.Image | null = null;

async function loadTiff() {
  if (!tiff) {
    tiff = await GeoTIFF.fromFile(tiffPath);
    image = await tiff.getImage();
  }
}

export class ElevationService {
  async getElevationAtPoint(point: LatLng): Promise<number> {
    await loadTiff();
    if (!image) return 0;
    const bbox = image.getBoundingBox();
    const width = image.getWidth();
    const height = image.getHeight();
    const x = Math.round(((point.lon - bbox[0]) / (bbox[2] - bbox[0])) * (width - 1));
    const y = Math.round(((bbox[3] - point.lat) / (bbox[3] - bbox[1])) * (height - 1));
    const window = [x, y, x + 1, y + 1];
    const data = await image.readRasters({ window });
    return data[0][0];
  }
}
