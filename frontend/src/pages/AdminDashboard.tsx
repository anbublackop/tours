import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Package, Calendar, Settings, XCircle, BarChart3, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { ApiBooking, ApiPackage } from "@/types/api";

const statusColor = (s: string) => {
  if (s === "confirmed") return "bg-secondary text-secondary-foreground";
  if (s === "pending")   return "bg-accent text-accent-foreground";
  return "bg-destructive text-destructive-foreground";
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [packages, setPackages] = useState<ApiPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.is_admin) { navigate("/login"); return; }
    Promise.all([
      api.get<ApiBooking[]>("/bookings", true),
      api.get<ApiPackage[]>("/packages"),
    ])
      .then(([b, p]) => { setBookings(b); setPackages(p); })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleCancel = async (bookingId: number) => {
    try {
      const updated = await api.put<ApiBooking>(`/bookings/${bookingId}/cancel`, {}, true);
      setBookings((prev) => prev.map((b) => b.id === bookingId ? updated : b));
      toast.success("Booking cancelled.");
    } catch {
      toast.error("Failed to cancel booking.");
    }
  };

  const handleDeletePackage = async (packageId: number) => {
    try {
      await api.delete(`/packages/${packageId}`, true);
      setPackages((prev) => prev.filter((p) => p.id !== packageId));
      toast.success("Package deleted.");
    } catch {
      toast.error("Failed to delete package.");
    }
  };

  const revenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((s, b) => s + b.total_price, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-8 bg-background flex-1">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage bookings, packages &amp; content</p>
            </div>
            <Link to="/"><Button variant="outline">Back to Site</Button></Link>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Package,  label: "Total Packages", value: packages.length,                         color: "text-primary" },
              { icon: Calendar, label: "Total Bookings", value: bookings.length,                          color: "text-secondary" },
              { icon: Users,    label: "Customers",      value: new Set(bookings.map((b) => b.user_id)).size, color: "text-accent" },
              { icon: BarChart3,label: "Revenue",        value: `₹${revenue.toLocaleString()}`,           color: "text-primary" },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <s.icon className={`w-8 h-8 ${s.color}`} />
                  <div><p className="text-2xl font-bold">{s.value}</p><p className="text-sm text-muted-foreground">{s.label}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="bookings">
            <TabsList>
              <TabsTrigger value="bookings">All Bookings</TabsTrigger>
              <TabsTrigger value="packages">Manage Packages</TabsTrigger>
              <TabsTrigger value="content">Site Content</TabsTrigger>
            </TabsList>

            {/* Bookings tab */}
            <TabsContent value="bookings" className="mt-6 space-y-4">
              {loading ? <p className="text-muted-foreground">Loading…</p> : bookings.length === 0 ? (
                <p className="text-muted-foreground">No bookings yet.</p>
              ) : bookings.map((booking) => (
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
                          <span>👤 {booking.user_name ?? `User #${booking.user_id}`}</span>
                          <span>📅 {booking.travel_date}</span>
                          <span>👥 {booking.num_people}</span>
                          <span className="font-semibold text-primary">₹{booking.total_price.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/booking/${booking.id}`}><Button variant="outline" size="sm">Details</Button></Link>
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
            </TabsContent>

            {/* Packages tab */}
            <TabsContent value="packages" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-lg font-semibold">All Packages ({packages.length})</h3>
                <Button className="gap-2"><PlusCircle className="w-4 h-4" /> Add Package</Button>
              </div>
              {loading ? <p className="text-muted-foreground">Loading…</p> : (
                <div className="space-y-3">
                  {packages.map((pkg) => (
                    <Card key={pkg.id}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={pkg.image ?? "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200"}
                            alt={pkg.title}
                            className="w-16 h-12 rounded object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-foreground">{pkg.title}</h4>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="capitalize">{pkg.country}</Badge>
                              <span>{pkg.duration}</span>
                              <span>₹{pkg.price.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeletePackage(pkg.id)}>Delete</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Site content tab — static, out of scope */}
            <TabsContent value="content" className="mt-6">
              <Card>
                <CardHeader><CardTitle className="font-display">Website Content Management</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Hero Section", "About Us Page", "Footer Information", "Contact Details", "Social Media Links", "Terms & Conditions"].map((item) => (
                      <div key={item} className="flex items-center justify-between border-b border-border pb-3">
                        <div className="flex items-center gap-3">
                          <Settings className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{item}</span>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
