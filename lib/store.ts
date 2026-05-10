import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface Destination {
  id: string;
  name: string;
  country: string;
  coordinates: { lat: number; lng: number };
  image: string;
  description?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  cost: number;
  category: "food" | "culture" | "adventure" | "relaxation" | "shopping" | "nightlife";
  location: string;
  coordinates?: { lat: number; lng: number };
  time?: string;
  image?: string;
  rating?: number;
}

export interface ItineraryDay {
  id: string;
  date: string;
  destination: Destination;
  activities: Activity[];
  notes?: string;
}

export interface BudgetItem {
  id: string;
  category: "accommodation" | "transport" | "food" | "activities" | "shopping" | "other";
  name: string;
  estimated: number;
  actual?: number;
}

export interface PackingItem {
  id: string;
  name: string;
  category: "clothing" | "toiletries" | "electronics" | "documents" | "misc";
  packed: boolean;
  quantity: number;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "editor" | "viewer";
  online?: boolean;
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  destinations: Destination[];
  itinerary: ItineraryDay[];
  budget: {
    total: number;
    currency: string;
    items: BudgetItem[];
  };
  packingList: PackingItem[];
  collaborators: Collaborator[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  travelStyle?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  travelPersonality?: {
    type: string;
    traits: string[];
    preferences: {
      pace: "relaxed" | "moderate" | "adventurous";
      budget: "budget" | "mid-range" | "luxury";
      interests: string[];
    };
  };
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Store interfaces
interface TravelStore {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Trips
  trips: Trip[];
  currentTrip: Trip | null;
  setTrips: (trips: Trip[]) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;

  // AI Copilot
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  copilotMessages: Message[];
  addCopilotMessage: (message: Message) => void;
  clearCopilotMessages: () => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeView: "itinerary" | "map" | "budget" | "packing" | "journal";
  setActiveView: (view: "itinerary" | "map" | "budget" | "packing" | "journal") => void;

  // Onboarding
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;
}

export const useTravelStore = create<TravelStore>()(
  persist(
    (set) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),

      // Trips
      trips: [],
      currentTrip: null,
      setTrips: (trips) => set({ trips }),
      setCurrentTrip: (trip) => set({ currentTrip: trip }),
      addTrip: (trip) =>
        set((state) => ({
          trips: [...state.trips, trip],
        })),
      updateTrip: (id, updates) =>
        set((state) => ({
          trips: state.trips.map((t) => (t.id === id ? { ...t, ...updates } : t)),
          currentTrip:
            state.currentTrip?.id === id
              ? { ...state.currentTrip, ...updates }
              : state.currentTrip,
        })),
      deleteTrip: (id) =>
        set((state) => ({
          trips: state.trips.filter((t) => t.id !== id),
          currentTrip: state.currentTrip?.id === id ? null : state.currentTrip,
        })),

      // AI Copilot
      copilotOpen: false,
      setCopilotOpen: (open) => set({ copilotOpen: open }),
      copilotMessages: [],
      addCopilotMessage: (message) =>
        set((state) => ({
          copilotMessages: [...state.copilotMessages, message],
        })),
      clearCopilotMessages: () => set({ copilotMessages: [] }),

      // UI State
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      activeView: "itinerary",
      setActiveView: (view) => set({ activeView: view }),

      // Onboarding
      onboardingComplete: false,
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
    }),
    {
      name: "traveloop-storage",
      partialize: (state) => ({
        user: state.user,
        trips: state.trips,
        onboardingComplete: state.onboardingComplete,
      }),
    }
  )
);

// Sample data for demo
export const sampleDestinations: Destination[] = [
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    description: "A city where tradition meets cutting-edge technology",
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    description: "The city of lights and endless romance",
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    coordinates: { lat: -8.3405, lng: 115.092 },
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    description: "Tropical paradise with ancient temples and rice terraces",
  },
  {
    id: "nyc",
    name: "New York",
    country: "USA",
    coordinates: { lat: 40.7128, lng: -74.006 },
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    description: "The city that never sleeps",
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    coordinates: { lat: 36.3932, lng: 25.4615 },
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
    description: "Stunning sunsets and whitewashed architecture",
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    coordinates: { lat: 35.0116, lng: 135.7681 },
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
    description: "Ancient temples and traditional Japanese culture",
  },
];
