// Database types for TRAVELOOP

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  travel_personality: TravelPersonality
  preferences: UserPreferences
  onboarding_complete: boolean
  created_at: string
  updated_at: string
}

export interface TravelPersonality {
  type?: 'adventurer' | 'relaxer' | 'explorer' | 'foodie' | 'culture-seeker' | 'budget-traveler'
  pace?: 'slow' | 'moderate' | 'fast'
  interests?: string[]
  accommodation_style?: 'luxury' | 'boutique' | 'budget' | 'hostel' | 'airbnb'
  travel_style?: 'solo' | 'couple' | 'family' | 'group'
}

export interface UserPreferences {
  currency?: string
  timezone?: string
  notifications?: boolean
  public_profile?: boolean
  theme?: 'light' | 'dark' | 'system'
}

export interface Trip {
  id: string
  user_id: string
  name: string
  description: string | null
  cover_image: string | null
  start_date: string | null
  end_date: string | null
  budget_total: number
  budget_currency: string
  is_public: boolean
  public_slug: string | null
  travel_style: string | null
  status: 'planning' | 'booked' | 'ongoing' | 'completed'
  created_at: string
  updated_at: string
  // Joined data
  destinations?: Destination[]
  itinerary_days?: ItineraryDay[]
  budget_items?: BudgetItem[]
  packing_items?: PackingItem[]
  collaborators?: Collaborator[]
}

export interface Destination {
  id: string
  trip_id: string
  name: string
  country: string | null
  lat: number | null
  lng: number | null
  image: string | null
  description: string | null
  start_date: string | null
  end_date: string | null
  order_index: number
  created_at: string
}

export interface ItineraryDay {
  id: string
  trip_id: string
  destination_id: string | null
  date: string
  notes: string | null
  order_index: number
  created_at: string
  // Joined data
  activities?: Activity[]
  destination?: Destination
}

export interface Activity {
  id: string
  itinerary_day_id: string
  name: string
  description: string | null
  location: string | null
  lat: number | null
  lng: number | null
  start_time: string | null
  duration_minutes: number
  cost: number
  category: ActivityCategory
  image: string | null
  rating: number | null
  order_index: number
  created_at: string
}

export type ActivityCategory = 
  | 'sightseeing'
  | 'food'
  | 'transport'
  | 'accommodation'
  | 'shopping'
  | 'entertainment'
  | 'nature'
  | 'culture'
  | 'nightlife'
  | 'relaxation'
  | 'adventure'
  | 'general'

export interface BudgetItem {
  id: string
  trip_id: string
  category: BudgetCategory
  name: string
  estimated: number
  actual: number | null
  notes: string | null
  created_at: string
}

export type BudgetCategory = 
  | 'flights'
  | 'accommodation'
  | 'transport'
  | 'food'
  | 'activities'
  | 'shopping'
  | 'insurance'
  | 'visa'
  | 'misc'

export interface PackingItem {
  id: string
  trip_id: string
  name: string
  category: PackingCategory
  quantity: number
  packed: boolean
  created_at: string
}

export type PackingCategory = 
  | 'clothing'
  | 'toiletries'
  | 'electronics'
  | 'documents'
  | 'health'
  | 'accessories'
  | 'misc'

export interface Collaborator {
  id: string
  trip_id: string
  user_id: string | null
  email: string | null
  role: 'owner' | 'editor' | 'viewer'
  status: 'pending' | 'accepted' | 'declined'
  invited_at: string
  accepted_at: string | null
  // Joined data
  profile?: Profile
}

export interface JournalEntry {
  id: string
  trip_id: string
  user_id: string
  title: string | null
  content: string | null
  mood: string | null
  photos: string[]
  location: string | null
  created_at: string
  updated_at: string
}

export interface AIRecommendation {
  id: string
  trip_id: string | null
  user_id: string
  type: 'itinerary' | 'activity' | 'restaurant' | 'hotel' | 'packing' | 'budget' | 'hidden-gem'
  content: Record<string, unknown>
  applied: boolean
  created_at: string
}

// AI Generation Types
export interface AIItineraryRequest {
  destinations: string[]
  start_date: string
  end_date: string
  travel_style?: string
  budget?: number
  interests?: string[]
  pace?: 'slow' | 'moderate' | 'fast'
}

export interface AIActivitySuggestion {
  name: string
  description: string
  location: string
  lat?: number
  lng?: number
  duration_minutes: number
  estimated_cost: number
  category: ActivityCategory
  best_time?: string
  tips?: string
  rating?: number
}

export interface AICopilotMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Map Types
export interface MapMarker {
  id: string
  lat: number
  lng: number
  label: string
  type: 'destination' | 'activity' | 'hotel' | 'restaurant'
  color?: string
}

export interface MapRoute {
  id: string
  coordinates: [number, number][]
  color?: string
}

// Form Types
export interface CreateTripForm {
  name: string
  description?: string
  start_date?: string
  end_date?: string
  destinations: string[]
  budget_total?: number
  budget_currency?: string
  travel_style?: string
}

export interface OnboardingData {
  full_name: string
  travel_personality: TravelPersonality
  preferences: UserPreferences
}
