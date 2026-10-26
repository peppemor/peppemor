import type { Itinerary, PointOfInterest } from '@prisma/client';

export type ItineraryWithPOIs = Itinerary & { pointsOfInterest: PointOfInterest[] };