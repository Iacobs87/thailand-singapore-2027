export type StatusRo = "Planificat" | "Rezervat" | "De verificat";
export type Intensity = "travel" | "relaxed" | "balanced" | "active";
export type Range = [number, number];
export type LatLng = [number, number];
export type Timezone = "Asia/Bangkok" | "Asia/Singapore" | "Europe/Bucharest";

export interface Destination {
  id: string;
  name: string;
  country: string;
  timezone: Timezone;
  checkIn: string;
  checkOut: string;
  nights: number;
  hotelStatus: StatusRo;
  coordinates: LatLng;
  suggestedAreas: string[];
  highlights: string[];
  logistics: string[];
  notes: string[];
}

export interface MapPoint {
  id: string;
  label: string;
  coordinates: LatLng;
  kind: "airport" | "pier";
}

export interface RouteLeg {
  from: string;
  to: string;
  mode: "ground" | "flight" | "boat";
  date: string;
}

export interface Flight {
  id: string;
  date: string;
  route: string;
  airline: string;
  departureLocal: string | null;
  departureTimezone: Timezone;
  arrivalLocal: string | null;
  arrivalTimezone: Timezone;
  status: string;
  statusRo: StatusRo;
  estimatedUsdPerPerson: number | null;
  estimatedUsdForTwo?: number;
  notes?: string[];
}

export interface Day {
  date: string;
  place: string;
  theme: string;
  activities: string[];
  intensity: Intensity;
  walkingHours?: string;
  cyclingHours?: string;
}

export interface Transfer {
  date: string;
  route: string;
  mode: "ground" | "boat";
  recommended: string;
  options: string[];
  durationDoorToDoor: string;
  costEuroForTwo: Range;
  status: string;
  statusRo: StatusRo;
}

export interface Budget {
  currency: "EUR";
  forTravelers: number;
  excludes: string[];
  targetTotalEuro: number;
  targetBreakdownEuro: Record<string, number>;
  scenarioEstimatesEuro: { economy: number; comfortable: number };
  accommodationByDestinationEuro: Record<string, { nights: number; perRoomNight: Range; total: Range }>;
  foodEuroForTwoByDestination: Record<string, Range>;
  activitiesEuroForTwoByDestination: Record<string, Range>;
  regionalFlightsQuotedUsdForTwo: { airAsia: number; scoot: number; total: number };
  mainTransferBudgetEuroForTwo: { low: number; high: number };
  localTransportAndExcursionsBudgetEuroForTwo: { low: number; high: number };
  defaultExchangeRates: { note: string; EURperUSD: number; EURperTHB: number; EURperSGD: number };
  notes: string[];
}

export interface Bag {
  id: string;
  model: string;
  volumeLiters: number;
  count: number;
  dimensionsCm: string;
}

export interface AirlineLimit {
  id: string;
  airline: string;
  flightId: string;
  combinedCarryOnKgPerPerson: number;
  mainBagMaxCm: [number, number, number];
  personalItemMaxCm: [number, number, number];
}

export interface Luggage {
  travelers: number;
  planned: Bag[];
  optional: Bag[];
  airlineLimits: AirlineLimit[];
  rulesToVerify: string[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface TripData {
  schemaVersion: string;
  title: string;
  language: string;
  travelers: number;
  dates: { departureFromRomania: string; firstDestinationArrival: string; returnFlightDate: string; nights: number };
  preferences: string[];
  destinations: Destination[];
  mapPoints: MapPoint[];
  route: RouteLeg[];
  flights: Flight[];
  days: Day[];
  transfers: Transfer[];
  budget: Budget;
  luggage: Luggage;
  checklist: ChecklistItem[];
  assumptions: string[];
  officialLinks: { label: string; url: string }[];
  disclaimer: string;
}
