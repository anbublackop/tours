export interface Booking {
  id: string;
  packageId: string;
  packageTitle: string;
  userId: string;
  userName: string;
  date: string;
  members: number;
  status: "confirmed" | "pending" | "cancelled";
  totalAmount: number;
  addons: string[];
  hotelId: string;
  transportId: string;
  createdAt: string;
}

export const mockBookings: Booking[] = [
  {
    id: "BK001",
    packageId: "rajasthan-heritage",
    packageTitle: "Royal Rajasthan Heritage Tour",
    userId: "user1",
    userName: "Rahul Sharma",
    date: "2026-03-15",
    members: 4,
    status: "confirmed",
    totalAmount: 168000,
    addons: ["Professional Guide", "Travel Insurance"],
    hotelId: "h2",
    transportId: "t2",
    createdAt: "2026-02-10",
  },
  {
    id: "BK002",
    packageId: "everest-base-camp",
    packageTitle: "Everest Base Camp Trek",
    userId: "user1",
    userName: "Rahul Sharma",
    date: "2026-04-01",
    members: 2,
    status: "pending",
    totalAmount: 190000,
    addons: ["Extra Porter"],
    hotelId: "h2",
    transportId: "t1",
    createdAt: "2026-02-15",
  },
  {
    id: "BK003",
    packageId: "kerala-backwaters",
    packageTitle: "Kerala Backwaters Paradise",
    userId: "user2",
    userName: "Priya Patel",
    date: "2026-03-20",
    members: 2,
    status: "confirmed",
    totalAmount: 62000,
    addons: ["Ayurveda Session"],
    hotelId: "h2",
    transportId: "t1",
    createdAt: "2026-02-12",
  },
];
