import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Package, Calendar, Settings, XCircle, BarChart3, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mockBookings, type Booking } from "@/data/bookings";
import { packages } from "@/data/packages";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const handleCancel = (id: string) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" as const } : b));
    toast.success("Booking cancelled.");
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
              <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage bookings, packages & content</p>
            </div>
            <Link to="/"><Button variant="outline">Back to Site</Button></Link>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Package, label: "Total Packages", value: packages.length, color: "text-primary" },
              { icon: Calendar, label: "Total Bookings", value: bookings.length, color: "text-secondary" },
              { icon: Users, label: "Customers", value: 2, color: "text-accent" },
              { icon: BarChart3, label: "Revenue", value: `₹${bookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.totalAmount, 0).toLocaleString()}`, color: "text-primary" },
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

            <TabsContent value="bookings" className="mt-6 space-y-4">
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
                          <span>👤 {booking.userName}</span>
                          <span>📅 {booking.date}</span>
                          <span>👥 {booking.members}</span>
                          <span className="font-semibold text-primary">₹{booking.totalAmount.toLocaleString()}</span>
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

            <TabsContent value="packages" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-lg font-semibold">All Packages ({packages.length})</h3>
                <Button className="gap-2"><PlusCircle className="w-4 h-4" /> Add Package</Button>
              </div>
              <div className="space-y-3">
                {packages.map((pkg) => (
                  <Card key={pkg.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={pkg.image} alt={pkg.title} className="w-16 h-12 rounded object-cover" />
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
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

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
