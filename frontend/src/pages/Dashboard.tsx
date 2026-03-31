import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Users, Package, LogOut, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { ApiBooking } from "@/types/api";

const statusColor = (s: string) => {
  if (s === "confirmed") return "bg-secondary text-secondary-foreground";
  if (s === "pending")   return "bg-accent text-accent-foreground";
  return "bg-destructive text-destructive-foreground";
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    api.get<ApiBooking[]>("/bookings/my", true)
      .then(setBookings)
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleCancel = async (bookingId: number) => {
    try {
      const updated = await api.put<ApiBooking>(`/bookings/${bookingId}/cancel`, {}, true);
      setBookings((prev) => prev.map((b) => b.id === bookingId ? updated : b));
      toast.success("Booking cancelled successfully.");
    } catch {
      toast.error("Failed to cancel booking.");
    }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-8 bg-background flex-1">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">My Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name ?? "Traveller"}</p>
            </div>
            <Button variant="outline" className="gap-2" onClick={handleLogout}><LogOut className="w-4 h-4" /> Logout</Button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card><CardContent className="p-4 flex items-center gap-3"><Package className="w-8 h-8 text-primary" /><div><p className="text-2xl font-bold">{bookings.length}</p><p className="text-sm text-muted-foreground">Total Bookings</p></div></CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3"><Calendar className="w-8 h-8 text-secondary" /><div><p className="text-2xl font-bold">{bookings.filter((b) => b.status === "confirmed").length}</p><p className="text-sm text-muted-foreground">Confirmed</p></div></CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3"><Users className="w-8 h-8 text-accent" /><div><p className="text-2xl font-bold">{bookings.reduce((s, b) => s + b.num_people, 0)}</p><p className="text-sm text-muted-foreground">Total Travellers</p></div></CardContent></Card>
          </div>

          <h2 className="font-display text-xl font-semibold mb-4">My Bookings</h2>
          {loading ? (
            <p className="text-muted-foreground">Loading your bookings…</p>
          ) : bookings.length === 0 ? (
            <p className="text-muted-foreground">No bookings yet. <Link to="/" className="text-primary hover:underline">Browse packages</Link></p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-foreground">{booking.package_title ?? `Package #${booking.package_id}`}</h3>
                          <Badge className={statusColor(booking.status)}>{booking.status}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>📋 #{booking.id}</span>
                          <span>📅 {booking.travel_date}</span>
                          <span>👥 {booking.num_people} members</span>
                          <span className="font-semibold text-primary">₹{booking.total_price.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/booking/${booking.id}`}><Button variant="outline" size="sm">View Details</Button></Link>
                        {booking.status !== "cancelled" && (
                          <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleCancel(booking.id)}>
                            <XCircle className="w-3 h-3" /> Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Dashboard;
