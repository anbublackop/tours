import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, Package, LogOut, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mockBookings, type Booking } from "@/data/bookings";

const Dashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings.filter((b) => b.userId === "user1"));

  const handleCancel = (id: string) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" as const } : b));
    toast.success("Booking cancelled successfully.");
  };

  const statusColor = (s: string) => {
    if (s === "confirmed") return "bg-secondary text-secondary-foreground";
    if (s === "pending") return "bg-accent text-accent-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-8 bg-background flex-1">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">My Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Rahul Sharma</p>
            </div>
            <Link to="/"><Button variant="outline" className="gap-2"><LogOut className="w-4 h-4" /> Logout</Button></Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Package className="w-8 h-8 text-primary" />
                <div><p className="text-2xl font-bold">{bookings.length}</p><p className="text-sm text-muted-foreground">Total Bookings</p></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-secondary" />
                <div><p className="text-2xl font-bold">{bookings.filter((b) => b.status === "confirmed").length}</p><p className="text-sm text-muted-foreground">Confirmed</p></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="w-8 h-8 text-accent" />
                <div><p className="text-2xl font-bold">{bookings.reduce((s, b) => s + b.members, 0)}</p><p className="text-sm text-muted-foreground">Total Travellers</p></div>
              </CardContent>
            </Card>
          </div>

          <h2 className="font-display text-xl font-semibold mb-4">My Bookings</h2>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-foreground">{booking.packageTitle}</h3>
                        <Badge className={statusColor(booking.status)}>{booking.status}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>📋 {booking.id}</span>
                        <span>📅 {booking.date}</span>
                        <span>👥 {booking.members} members</span>
                        <span className="font-semibold text-primary">₹{booking.totalAmount.toLocaleString()}</span>
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
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Dashboard;
