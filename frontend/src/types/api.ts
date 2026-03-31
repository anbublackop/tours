// ─── Package ────────────────────────────────────────────────────────────────

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string;
  overnight?: string;
}

export interface HotelOption {
  id: string;
  name: string;
  category: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
}

export interface TransportOption {
  id: string;
  type: string;
  description: string;
  price: number;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  icon?: string;
}

/** Returned for package listing pages (index, packages grid). */
export interface ApiPackage {
  id: number;
  title: string;
  country: string;
  category: string;
  state?: string;
  duration: string;
  duration_days?: number;
  price: number;
  original_price?: number;
  location?: string;
  image?: string;
  rating?: string;
  reviews_count?: number;
  highlights?: string[];

  // Only present on detail endpoint
  description?: string;
  itinerary?: ItineraryDay[];
  hotels?: HotelOption[];
  transport?: TransportOption[];
  addons?: Addon[];
  inclusions?: string[];
  exclusions?: string[];
  booking_rules?: string[];
  travel_rules?: string[];
}

// ─── Booking ─────────────────────────────────────────────────────────────────

export interface ApiBooking {
  id: number;
  user_id: number;
  package_id: number;
  package_title?: string;
  user_name?: string;
  status: "confirmed" | "cancelled" | string;
  total_price: number;
  booking_date: string;
  travel_date: string;
  num_people: number;
  special_requests?: string;
  payment_status: string;
  payment_method: string;
  hotel_id?: string;
  transport_id?: string;
  selected_addons?: string[];
  created_at: string;
  updated_at: string;
}

// ─── Enquiry ─────────────────────────────────────────────────────────────────

export interface EnquiryPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  package_name?: string;
}
