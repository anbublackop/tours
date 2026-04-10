import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiBooking, ApiPackage } from "@/types/api";

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<ApiBooking | null>(null);
  const [pkg, setPkg] = useState<ApiPackage | null>(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [members, setMembers] = useState(1);
  const [travelDate, setTravelDate] = useState("");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    api.get<ApiBooking>(`/bookings/${id}`, true)
      .then((b) => {
        setBooking(b);
        setMembers(b.num_people);
        setTravelDate(b.travel_date);
        return api.get<ApiPackage>(`/packages/${b.package_id}`);
      })
      .then(setPkg)
      .catch(() => toast.error("Failed to load booking details"))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const handleSave = () => {
    setEditing(false);
    toast.success("Booking updated successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <section className="py-8 bg-background flex-1">
          <div className="container max-w-3xl space-y-6">
            <Skeleton className="h-4 w-32 rounded" />
            <div className="flex items-center justify-between">
              <div className="space-y-2"><Skeleton className="h-8 w-40 rounded-lg" /><Skeleton className="h-5 w-20 rounded-full" /></div>
              <Skeleton className="h-9 w-20 rounded-md" />
            </div>
            <Card><CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-36 rounded" />
              <div className="flex items-center gap-4"><Skeleton className="w-20 h-14 rounded" /><div className="space-y-2"><Skeleton className="h-5 w-48" /><Skeleton className="h-4 w-32" /></div></div>
            </CardContent></Card>
            <Card><CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-44 rounded" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-9 w-full rounded-md" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-9 w-full rounded-md" /></div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="p-6 space-y-3">
              <Skeleton className="h-6 w-36 rounded" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-6 w-40" />
            </CardContent></Card>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col"><Navbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Booking not found.</p></div>
        <Footer />
      </div>
    );
  }

  const statusColor =
    booking.status === "confirmed" ? "bg-secondary text-secondary-foreground"
    : booking.status === "pending"  ? "bg-accent text-accent-foreground"
    : "bg-destructive text-destructive-foreground";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-8 bg-background flex-1">
        <div className="container max-w-3xl">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Booking #{booking.id}</h1>
              <Badge className={statusColor}>{booking.status}</Badge>
            </div>
            {booking.status !== "cancelled" && (
              <Button variant="outline" className="gap-2" onClick={() => editing ? handleSave() : setEditing(true)}>
                {editing ? <><Save className="w-4 h-4" /> Save</> : <><Edit2 className="w-4 h-4" /> Edit</>}
              </Button>
            )}
          </div>

          {/* Package details */}
          <Card className="mb-6">
            <CardHeader><CardTitle className="font-display">Package Details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4">
                {pkg?.image && (
                  <img src={pkg.image} alt={pkg.title} className="w-20 h-14 rounded object-cover" />
                )}
                <div>
                  {pkg ? (
                    <Link to={`/package/${pkg.id}`} className="font-semibold text-foreground hover:text-primary">
                      {pkg.title}
                    </Link>
                  ) : (
                    <span className="font-semibold text-foreground">{booking.package_title ?? `Package #${booking.package_id}`}</span>
                  )}
                  {pkg && <p className="text-sm text-muted-foreground">{pkg.duration} • {pkg.country}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking info */}
          <Card className="mb-6">
            <CardHeader><CardTitle className="font-display">Booking Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Travel Date</Label>
                  {editing
                    ? <Input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
                    : <p className="text-foreground mt-1">{booking.travel_date}</p>
                  }
                </div>
                <div>
                  <Label>Number of Members</Label>
                  {editing
                    ? <Input type="number" min={1} value={members} onChange={(e) => setMembers(Number(e.target.value))} />
                    : <p className="text-foreground mt-1">{booking.num_people}</p>
                  }
                </div>
              </div>
              {booking.selected_addons && booking.selected_addons.length > 0 && (
                <div>
                  <Label>Add-ons</Label>
                  <div className="flex gap-2 mt-1">
                    {booking.selected_addons.map((a) => <Badge key={a} variant="secondary">{a}</Badge>)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment summary */}
          <Card>
            <CardHeader><CardTitle className="font-display">Payment Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Booked on</span><span>{booking.booking_date}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Payment status</span><span className="capitalize">{booking.payment_status}</span></div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">₹{booking.total_price.toLocaleString()}</span>
                </div>
              </div>
              {booking.status !== "cancelled" && editing && (
                <Button className="w-full mt-4 font-semibold" onClick={handleSave}>Update & Proceed to Payment</Button>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BookingDetails;
