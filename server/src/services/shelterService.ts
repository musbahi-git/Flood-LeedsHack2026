import ShelterModel from "../models/Shelter";
import { Shelter } from "./routing/types";

export async function getShelters(): Promise<Shelter[]> {
  // Query MongoDB for all shelters
  const docs = await ShelterModel.find({});
  return docs.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    location: {
      lat: doc.location.coordinates[1],
      lon: doc.location.coordinates[0],
    },
    capacity: doc.capacity,
    currentOccupancy: doc.currentOccupancy,
  }));
}
