export interface TourPackage {
  id: string;
  title: string;
  country: "india" | "nepal";
  category: string;
  state?: string;
  duration: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  highlights: string[];
  description: string;
  itinerary: DaySchedule[];
  hotels: HotelOption[];
  transport: TransportOption[];
  inclusions: string[];
  exclusions: string[];
  bookingRules: string[];
  travelRules: string[];
  addons: Addon[];
}

export interface DaySchedule {
  day: number;
  title: string;
  description: string;
  meals: string;
  overnight: string;
}

export interface HotelOption {
  id: string;
  name: string;
  category: "budget" | "standard" | "premium" | "luxury";
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
}

export const packageCategories = [
  { id: "wildlife", name: "Wildlife Safari", icon: "🐅" },
  { id: "religious", name: "Religious & Spiritual", icon: "🛕" },
  { id: "adventure", name: "Adventure", icon: "🏔️" },
  { id: "heritage", name: "Heritage & Culture", icon: "🏛️" },
  { id: "beach", name: "Beach & Coastal", icon: "🏖️" },
  { id: "hill-station", name: "Hill Stations", icon: "⛰️" },
];

export const packages: TourPackage[] = [
  {
    id: "rajasthan-heritage",
    title: "Royal Rajasthan Heritage Tour",
    country: "india",
    category: "heritage",
    state: "Rajasthan",
    duration: "7 Days / 6 Nights",
    price: 35000,
    originalPrice: 42000,
    rating: 4.8,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600",
    highlights: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer"],
    description: "Experience the royal grandeur of Rajasthan with this comprehensive heritage tour covering the most iconic forts, palaces, and cultural landmarks across the desert state.",
    itinerary: [
      { day: 1, title: "Arrival in Jaipur", description: "Arrive at Jaipur airport. Transfer to hotel. Evening visit to Nahargarh Fort for sunset views.", meals: "Dinner", overnight: "Jaipur" },
      { day: 2, title: "Jaipur Sightseeing", description: "Visit Amber Fort, City Palace, Hawa Mahal, and Jantar Mantar. Evening bazaar shopping.", meals: "Breakfast, Lunch, Dinner", overnight: "Jaipur" },
      { day: 3, title: "Jaipur to Jodhpur", description: "Drive to Jodhpur. Visit Mehrangarh Fort and Jaswant Thada. Evening walk in the blue city.", meals: "Breakfast, Dinner", overnight: "Jodhpur" },
      { day: 4, title: "Jodhpur to Jaisalmer", description: "Drive to Jaisalmer via Osian temples. Desert camp experience with camel safari.", meals: "Breakfast, Lunch, Dinner", overnight: "Jaisalmer" },
      { day: 5, title: "Jaisalmer Exploration", description: "Visit Jaisalmer Fort, Patwon Ki Haveli, Gadsisar Lake. Desert sunset.", meals: "Breakfast, Dinner", overnight: "Jaisalmer" },
      { day: 6, title: "Jaisalmer to Udaipur", description: "Drive to Udaipur. Visit Ranakpur Jain Temple en route. Evening boat ride on Lake Pichola.", meals: "Breakfast, Dinner", overnight: "Udaipur" },
      { day: 7, title: "Udaipur & Departure", description: "Morning visit to City Palace and Saheliyon Ki Bari. Transfer to airport.", meals: "Breakfast", overnight: "" },
    ],
    hotels: [
      { id: "h1", name: "Heritage Haveli", category: "standard", pricePerNight: 3500, rating: 4.2, amenities: ["WiFi", "AC", "Restaurant"] },
      { id: "h2", name: "Royal Palace Hotel", category: "premium", pricePerNight: 6000, rating: 4.6, amenities: ["WiFi", "AC", "Pool", "Spa", "Restaurant"] },
      { id: "h3", name: "Taj Heritage Resort", category: "luxury", pricePerNight: 12000, rating: 4.9, amenities: ["WiFi", "AC", "Pool", "Spa", "Restaurant", "Butler Service"] },
    ],
    transport: [
      { id: "t1", type: "AC Sedan", description: "Comfortable AC sedan for up to 3 passengers", price: 8000 },
      { id: "t2", type: "AC SUV", description: "Spacious AC SUV for up to 6 passengers", price: 12000 },
      { id: "t3", type: "Luxury Coach", description: "Premium luxury bus with reclining seats", price: 5000 },
    ],
    inclusions: ["Accommodation", "Meals as mentioned", "Transport", "Sightseeing", "Guide", "Entry tickets"],
    exclusions: ["Flights", "Personal expenses", "Tips", "Camera fees"],
    bookingRules: ["50% advance required", "Full payment 15 days before departure", "GST extra at 5%"],
    travelRules: ["Valid ID proof required", "Check-in after 2 PM", "Check-out before 11 AM"],
    addons: [
      { id: "a1", name: "Professional Guide", description: "English-speaking certified guide", price: 2500 },
      { id: "a2", name: "Flight Booking", description: "Domestic flight arrangement", price: 8000 },
      { id: "a3", name: "Travel Insurance", description: "Comprehensive travel insurance", price: 1500 },
    ],
  },
  {
    id: "kerala-backwaters",
    title: "Kerala Backwaters Paradise",
    country: "india",
    category: "beach",
    state: "Kerala",
    duration: "5 Days / 4 Nights",
    price: 28000,
    originalPrice: 34000,
    rating: 4.9,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600",
    highlights: ["Alleppey", "Munnar", "Kochi", "Kumarakom"],
    description: "Cruise through the enchanting backwaters of Kerala, explore lush tea gardens, and experience the vibrant culture of God's Own Country.",
    itinerary: [
      { day: 1, title: "Arrival in Kochi", description: "Arrive at Cochin airport. Visit Fort Kochi, Chinese fishing nets, and Mattancherry Palace.", meals: "Dinner", overnight: "Kochi" },
      { day: 2, title: "Kochi to Munnar", description: "Drive to Munnar through scenic tea plantations. Visit Eravikulam National Park.", meals: "Breakfast, Dinner", overnight: "Munnar" },
      { day: 3, title: "Munnar Sightseeing", description: "Visit Tea Museum, Top Station, Kundala Lake. Spice plantation tour.", meals: "Breakfast, Lunch, Dinner", overnight: "Munnar" },
      { day: 4, title: "Munnar to Alleppey", description: "Drive to Alleppey. Board houseboat for overnight backwater cruise.", meals: "Breakfast, Lunch, Dinner", overnight: "Houseboat" },
      { day: 5, title: "Alleppey & Departure", description: "Morning disembark. Transfer to Cochin airport.", meals: "Breakfast", overnight: "" },
    ],
    hotels: [
      { id: "h1", name: "Green Valley Resort", category: "standard", pricePerNight: 3000, rating: 4.1, amenities: ["WiFi", "AC", "Restaurant"] },
      { id: "h2", name: "Spice Garden Resort", category: "premium", pricePerNight: 5500, rating: 4.5, amenities: ["WiFi", "AC", "Pool", "Ayurveda Spa"] },
    ],
    transport: [
      { id: "t1", type: "AC Sedan", description: "AC sedan for up to 3 passengers", price: 6000 },
      { id: "t2", type: "AC Tempo Traveller", description: "For groups of 8-12", price: 10000 },
    ],
    inclusions: ["Accommodation", "Houseboat stay", "Meals", "Transport", "Sightseeing"],
    exclusions: ["Flights", "Personal expenses", "Tips"],
    bookingRules: ["50% advance required", "Full payment 10 days before departure"],
    travelRules: ["Valid ID proof required", "No smoking on houseboat"],
    addons: [
      { id: "a1", name: "Ayurveda Session", description: "Traditional Kerala Ayurveda massage", price: 3000 },
      { id: "a2", name: "Kathakali Show", description: "Traditional dance performance", price: 500 },
    ],
  },
  {
    id: "jim-corbett-wildlife",
    title: "Jim Corbett Wildlife Safari",
    country: "india",
    category: "wildlife",
    state: "Uttarakhand",
    duration: "4 Days / 3 Nights",
    price: 22000,
    originalPrice: 26000,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=600",
    highlights: ["Jungle Safari", "Tiger Spotting", "Bird Watching", "Nature Walks"],
    description: "Embark on an exciting wildlife safari at Jim Corbett National Park, India's oldest national park and home to the majestic Bengal tiger.",
    itinerary: [
      { day: 1, title: "Arrival at Corbett", description: "Arrive at Ramnagar. Transfer to resort. Evening nature walk.", meals: "Dinner", overnight: "Corbett" },
      { day: 2, title: "Jungle Safari", description: "Morning and evening jeep safari in Bijrani zone. Bird watching.", meals: "Breakfast, Lunch, Dinner", overnight: "Corbett" },
      { day: 3, title: "Dhikala Zone Safari", description: "Full day safari in Dhikala zone. Elephant safari option.", meals: "Breakfast, Lunch, Dinner", overnight: "Corbett" },
      { day: 4, title: "Departure", description: "Morning bird watching. Transfer to Ramnagar station.", meals: "Breakfast", overnight: "" },
    ],
    hotels: [
      { id: "h1", name: "Jungle Camp", category: "budget", pricePerNight: 2000, rating: 3.8, amenities: ["Meals", "Bonfire"] },
      { id: "h2", name: "Tiger Den Resort", category: "premium", pricePerNight: 5000, rating: 4.5, amenities: ["WiFi", "AC", "Pool", "Restaurant"] },
    ],
    transport: [
      { id: "t1", type: "Safari Jeep", description: "Open-top jeep for safari", price: 4000 },
    ],
    inclusions: ["Accommodation", "Meals", "Safari permits", "Jeep safari", "Naturalist guide"],
    exclusions: ["Travel to Ramnagar", "Personal expenses", "Camera fees"],
    bookingRules: ["Full payment required for safari permits", "Booking 30 days in advance recommended"],
    travelRules: ["No bright colors during safari", "Maintain silence in core zones"],
    addons: [
      { id: "a1", name: "Elephant Safari", description: "Ride on trained elephant", price: 3000 },
      { id: "a2", name: "Photography Guide", description: "Expert wildlife photography guide", price: 5000 },
    ],
  },
  {
    id: "varanasi-spiritual",
    title: "Varanasi Spiritual Journey",
    country: "india",
    category: "religious",
    state: "Uttar Pradesh",
    duration: "3 Days / 2 Nights",
    price: 15000,
    rating: 4.6,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600",
    highlights: ["Ganga Aarti", "Temple Tours", "Boat Ride", "Sarnath"],
    description: "Immerse yourself in the spiritual capital of India. Witness the mesmerizing Ganga Aarti, explore ancient temples, and find inner peace.",
    itinerary: [
      { day: 1, title: "Arrival & Ganga Aarti", description: "Arrive in Varanasi. Evening Ganga Aarti at Dashashwamedh Ghat.", meals: "Dinner", overnight: "Varanasi" },
      { day: 2, title: "Temple Tour & Sarnath", description: "Visit Kashi Vishwanath, Sankat Mochan. Afternoon excursion to Sarnath.", meals: "Breakfast, Dinner", overnight: "Varanasi" },
      { day: 3, title: "Sunrise Boat Ride & Departure", description: "Early morning boat ride on Ganges. Visit more ghats. Departure.", meals: "Breakfast", overnight: "" },
    ],
    hotels: [
      { id: "h1", name: "Ghat View Guest House", category: "budget", pricePerNight: 1500, rating: 4.0, amenities: ["WiFi", "River View"] },
      { id: "h2", name: "BrijRama Palace", category: "luxury", pricePerNight: 8000, rating: 4.8, amenities: ["WiFi", "AC", "Heritage", "Restaurant", "Spa"] },
    ],
    transport: [
      { id: "t1", type: "AC Car", description: "AC car with driver for local transport", price: 3000 },
    ],
    inclusions: ["Accommodation", "Meals", "Boat ride", "Guide", "Sarnath excursion"],
    exclusions: ["Train/Flight tickets", "Personal expenses", "Temple donations"],
    bookingRules: ["30% advance required"],
    travelRules: ["Dress modestly at temples", "Remove shoes at temple entrances"],
    addons: [
      { id: "a1", name: "Yoga Session", description: "Morning yoga by the Ganges", price: 1000 },
    ],
  },
  {
    id: "everest-base-camp",
    title: "Everest Base Camp Trek",
    country: "nepal",
    category: "adventure",
    duration: "14 Days / 13 Nights",
    price: 85000,
    originalPrice: 95000,
    rating: 4.9,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
    highlights: ["Everest Base Camp", "Namche Bazaar", "Tengboche Monastery", "Kala Patthar"],
    description: "The ultimate trekking adventure to the base of the world's highest peak. Walk through Sherpa villages, cross suspension bridges, and witness breathtaking Himalayan panoramas.",
    itinerary: [
      { day: 1, title: "Arrival in Kathmandu", description: "Arrive at Tribhuvan Airport. Transfer to hotel. Trip briefing.", meals: "Dinner", overnight: "Kathmandu" },
      { day: 2, title: "Fly to Lukla, Trek to Phakding", description: "Scenic flight to Lukla. Begin trek to Phakding (2,610m).", meals: "Breakfast, Lunch, Dinner", overnight: "Phakding" },
      { day: 3, title: "Trek to Namche Bazaar", description: "Cross suspension bridges. Ascend to Namche Bazaar (3,440m).", meals: "Breakfast, Lunch, Dinner", overnight: "Namche Bazaar" },
      { day: 4, title: "Acclimatization Day", description: "Hike to Everest View Hotel for panoramic views. Visit Sherpa museum.", meals: "Breakfast, Lunch, Dinner", overnight: "Namche Bazaar" },
      { day: 5, title: "Trek to Tengboche", description: "Trek through rhododendron forests to Tengboche Monastery (3,860m).", meals: "Breakfast, Lunch, Dinner", overnight: "Tengboche" },
      { day: 6, title: "Trek to Dingboche", description: "Continue ascending to Dingboche (4,410m). Views of Ama Dablam.", meals: "Breakfast, Lunch, Dinner", overnight: "Dingboche" },
      { day: 7, title: "Acclimatization in Dingboche", description: "Rest day with optional hike to Nagarjun Hill.", meals: "Breakfast, Lunch, Dinner", overnight: "Dingboche" },
      { day: 8, title: "Trek to Lobuche", description: "Trek to Lobuche (4,940m) past Thukla memorial.", meals: "Breakfast, Lunch, Dinner", overnight: "Lobuche" },
      { day: 9, title: "Trek to Gorak Shep & EBC", description: "Trek to Gorak Shep. Continue to Everest Base Camp (5,364m)!", meals: "Breakfast, Lunch, Dinner", overnight: "Gorak Shep" },
      { day: 10, title: "Kala Patthar & Descent", description: "Early morning hike to Kala Patthar (5,545m) for sunrise. Descend to Pheriche.", meals: "Breakfast, Lunch, Dinner", overnight: "Pheriche" },
      { day: 11, title: "Trek to Namche", description: "Descend back to Namche Bazaar.", meals: "Breakfast, Lunch, Dinner", overnight: "Namche Bazaar" },
      { day: 12, title: "Trek to Lukla", description: "Final day of trekking back to Lukla.", meals: "Breakfast, Lunch, Dinner", overnight: "Lukla" },
      { day: 13, title: "Fly to Kathmandu", description: "Morning flight back to Kathmandu. Free time for shopping.", meals: "Breakfast, Dinner", overnight: "Kathmandu" },
      { day: 14, title: "Departure", description: "Transfer to airport for departure.", meals: "Breakfast", overnight: "" },
    ],
    hotels: [
      { id: "h1", name: "Tea House Lodges", category: "standard", pricePerNight: 1500, rating: 3.5, amenities: ["Meals", "Hot Shower"] },
      { id: "h2", name: "Premium Lodges", category: "premium", pricePerNight: 4000, rating: 4.2, amenities: ["Hot Shower", "Heating", "Better Beds"] },
    ],
    transport: [
      { id: "t1", type: "Domestic Flights", description: "Kathmandu-Lukla round trip flights", price: 25000 },
    ],
    inclusions: ["Accommodation", "Meals on trek", "Guide & Porter", "Permits", "Flights"],
    exclusions: ["International flights", "Travel insurance", "Personal gear", "Tips"],
    bookingRules: ["Full payment 30 days before", "Travel insurance mandatory"],
    travelRules: ["Minimum fitness level required", "Altitude sickness awareness", "Follow guide instructions"],
    addons: [
      { id: "a1", name: "Extra Porter", description: "Additional porter for luggage", price: 8000 },
      { id: "a2", name: "Satellite Phone", description: "Emergency satellite phone rental", price: 5000 },
    ],
  },
  {
    id: "kathmandu-valley",
    title: "Kathmandu Valley Cultural Tour",
    country: "nepal",
    category: "heritage",
    duration: "5 Days / 4 Nights",
    price: 32000,
    originalPrice: 38000,
    rating: 4.7,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1558799401-1dcba79834c2?w=600",
    highlights: ["Pashupatinath", "Boudhanath", "Bhaktapur", "Patan Durbar Square"],
    description: "Explore the rich cultural heritage of Nepal's Kathmandu Valley, home to seven UNESCO World Heritage Sites, ancient temples, and vibrant Newari culture.",
    itinerary: [
      { day: 1, title: "Arrival in Kathmandu", description: "Airport pickup. Visit Thamel district. Welcome dinner.", meals: "Dinner", overnight: "Kathmandu" },
      { day: 2, title: "Kathmandu Heritage Sites", description: "Visit Pashupatinath, Boudhanath Stupa, and Swayambhunath (Monkey Temple).", meals: "Breakfast, Lunch, Dinner", overnight: "Kathmandu" },
      { day: 3, title: "Bhaktapur Day Trip", description: "Full day in Bhaktapur Durbar Square. Pottery workshops. Local cuisine.", meals: "Breakfast, Lunch", overnight: "Kathmandu" },
      { day: 4, title: "Patan & Nagarkot", description: "Morning at Patan Durbar Square. Drive to Nagarkot for Himalayan sunset.", meals: "Breakfast, Dinner", overnight: "Nagarkot" },
      { day: 5, title: "Sunrise & Departure", description: "Sunrise over Himalayas. Return to Kathmandu for departure.", meals: "Breakfast", overnight: "" },
    ],
    hotels: [
      { id: "h1", name: "Thamel Guest House", category: "budget", pricePerNight: 1800, rating: 3.9, amenities: ["WiFi", "Restaurant"] },
      { id: "h2", name: "Dwarika's Hotel", category: "luxury", pricePerNight: 10000, rating: 4.9, amenities: ["WiFi", "AC", "Pool", "Spa", "Heritage"] },
    ],
    transport: [
      { id: "t1", type: "Private Car", description: "AC car with driver", price: 5000 },
    ],
    inclusions: ["Accommodation", "Meals", "Transport", "Guide", "Entry fees"],
    exclusions: ["International flights", "Visa fees", "Personal expenses"],
    bookingRules: ["40% advance required", "Free cancellation 20 days before"],
    travelRules: ["Nepal visa required", "Dress modestly at temples"],
    addons: [
      { id: "a1", name: "Mountain Flight", description: "1-hour Everest scenic flight", price: 12000 },
      { id: "a2", name: "Cooking Class", description: "Nepali cuisine cooking class", price: 2000 },
    ],
  },
  {
    id: "pokhara-adventure",
    title: "Pokhara Adventure Retreat",
    country: "nepal",
    category: "adventure",
    duration: "6 Days / 5 Nights",
    price: 42000,
    rating: 4.8,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=600",
    highlights: ["Paragliding", "Phewa Lake", "Sarangkot Sunrise", "World Peace Pagoda"],
    description: "Experience the adventure capital of Nepal with paragliding over Pokhara, boating on Phewa Lake, and breathtaking Annapurna mountain views.",
    itinerary: [
      { day: 1, title: "Kathmandu to Pokhara", description: "Scenic drive or flight to Pokhara. Lakeside area exploration.", meals: "Dinner", overnight: "Pokhara" },
      { day: 2, title: "Sarangkot & Paragliding", description: "Sunrise at Sarangkot. Tandem paragliding over Phewa Lake.", meals: "Breakfast, Dinner", overnight: "Pokhara" },
      { day: 3, title: "Adventure Activities", description: "Zip-lining, bungee jumping, or white water rafting (choice of one).", meals: "Breakfast, Lunch", overnight: "Pokhara" },
      { day: 4, title: "Phewa Lake & Caves", description: "Boating, World Peace Pagoda visit, Devi's Fall, Gupteshwor Cave.", meals: "Breakfast, Dinner", overnight: "Pokhara" },
      { day: 5, title: "Australian Base Camp Trek", description: "Day trek to Australian Camp for panoramic Annapurna views.", meals: "Breakfast, Lunch, Dinner", overnight: "Pokhara" },
      { day: 6, title: "Return to Kathmandu", description: "Morning free time. Fly or drive back to Kathmandu.", meals: "Breakfast", overnight: "" },
    ],
    hotels: [
      { id: "h1", name: "Lakeside Inn", category: "standard", pricePerNight: 2500, rating: 4.0, amenities: ["WiFi", "Lake View", "Restaurant"] },
      { id: "h2", name: "Fish Tail Lodge", category: "luxury", pricePerNight: 8000, rating: 4.7, amenities: ["WiFi", "AC", "Pool", "Lake View", "Spa"] },
    ],
    transport: [
      { id: "t1", type: "Tourist Bus", description: "AC tourist bus Kathmandu-Pokhara", price: 2000 },
      { id: "t2", type: "Domestic Flight", description: "25-min scenic flight", price: 8000 },
    ],
    inclusions: ["Accommodation", "Meals", "Paragliding", "Boat ride", "Guide"],
    exclusions: ["International flights", "Visa", "Personal expenses", "Additional activities"],
    bookingRules: ["50% advance required"],
    travelRules: ["Adventure activities subject to weather", "Insurance recommended"],
    addons: [
      { id: "a1", name: "Ultra-light Flight", description: "Scenic ultra-light aircraft flight", price: 8000 },
      { id: "a2", name: "Hot Air Balloon", description: "Morning hot air balloon ride", price: 10000 },
    ],
  },
  {
    id: "chitwan-wildlife",
    title: "Chitwan National Park Safari",
    country: "nepal",
    category: "wildlife",
    duration: "4 Days / 3 Nights",
    price: 25000,
    rating: 4.6,
    reviews: 88,
    image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=600",
    highlights: ["Jungle Safari", "Rhino Spotting", "Tharu Culture", "Canoe Ride"],
    description: "Explore the UNESCO World Heritage site of Chitwan National Park, home to one-horned rhinos, Bengal tigers, and rich biodiversity.",
    itinerary: [
      { day: 1, title: "Arrival at Chitwan", description: "Drive to Chitwan. Check into jungle lodge. Tharu cultural program.", meals: "Lunch, Dinner", overnight: "Chitwan" },
      { day: 2, title: "Jungle Safari", description: "Morning jeep safari. Afternoon canoe ride on Rapti River.", meals: "Breakfast, Lunch, Dinner", overnight: "Chitwan" },
      { day: 3, title: "Elephant Breeding Center", description: "Visit elephant breeding center. Nature walk. Bird watching.", meals: "Breakfast, Lunch, Dinner", overnight: "Chitwan" },
      { day: 4, title: "Departure", description: "Morning nature walk. Transfer to Kathmandu or Pokhara.", meals: "Breakfast", overnight: "" },
    ],
    hotels: [
      { id: "h1", name: "Jungle Safari Lodge", category: "standard", pricePerNight: 2200, rating: 4.0, amenities: ["Meals", "Garden", "Bonfire"] },
      { id: "h2", name: "Meghauli Serai", category: "luxury", pricePerNight: 15000, rating: 4.9, amenities: ["All Inclusive", "Pool", "Spa", "Private Safari"] },
    ],
    transport: [
      { id: "t1", type: "Tourist Bus", description: "AC bus from Kathmandu", price: 2000 },
      { id: "t2", type: "Private Jeep", description: "Private jeep transfer", price: 6000 },
    ],
    inclusions: ["Accommodation", "Meals", "Safari", "Guide", "Park permits", "Cultural program"],
    exclusions: ["Travel to Chitwan", "Personal expenses", "Tips"],
    bookingRules: ["Full payment 15 days before", "Park permits non-refundable"],
    travelRules: ["Wear neutral colors", "No flash photography", "Follow guide instructions"],
    addons: [
      { id: "a1", name: "Extra Safari", description: "Additional jeep safari", price: 4000 },
    ],
  },
];

export const getPackagesByCountry = (country: "india" | "nepal") =>
  packages.filter((p) => p.country === country);

export const getPackagesByCategory = (country: "india" | "nepal", category: string) =>
  packages.filter((p) => p.country === country && p.category === category);

export const getPackageById = (id: string) =>
  packages.find((p) => p.id === id);
