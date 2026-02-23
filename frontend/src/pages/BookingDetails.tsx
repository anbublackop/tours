import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import { mockBookings } from "@/data/bookings";
import { getPackageById } from "@/data/packages";

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const booking = mockBookings.find((b) => b.id === id);
  const pkg = booking ? getPackageById(booking.packageId) : null;

  const [editing, setEditing] = useState(false);
  const [members, setMembers] = useState(booking?.members || 1);

  if (!booking || !pkg) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Booking not found.</p></div>
        <Footer />
      </div>
    );
  }

  const handleSave = () => {
    setEditing(false);
    toast.success("Booking updated successfully!");
  };

  const statusColor = booking.status === "confirmed" ? "bg-secondary text-secondary-foreground" : booking.status === "pending" ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground";

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

          <Card className="mb-6">
            <CardHeader><CardTitle className="font-display">Package Details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4">
                <img src={pkg.image} alt={pkg.title} className="w-20 h-14 rounded object-cover" />
                <div>
                  <Link to={`/package/${pkg.id}`} className="font-semibold text-foreground hover:text-primary">{pkg.title}</Link>
                  <p className="text-sm text-muted-foreground">{pkg.duration} • {pkg.country === "india" ? "India" : "Nepal"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader><CardTitle className="font-display">Booking Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Travel Date</Label>
                  {editing ? <Input type="date" defaultValue={booking.date} /> : <p className="text-foreground mt-1">{booking.date}</p>}
                </div>
                <div>
                  <Label>Number of Members</Label>
                  {editing ? <Input type="number" min={1} value={members} onChange={(e) => setMembers(Number(e.target.value))} /> : <p className="text-foreground mt-1">{booking.members}</p>}
                </div>
              </div>
              {booking.addons.length > 0 && (
                <div>
                  <Label>Add-ons</Label>
                  <div className="flex gap-2 mt-1">{booking.addons.map((a) => <Badge key={a} variant="secondary">{a}</Badge>)}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="font-display">Payment Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Booked on</span><span>{booking.createdAt}</span></div>
                <Separator />
                <div className="flex justify-between text-lg font-bold"><span>Total Amount</span><span className="text-primary">₹{booking.totalAmount.toLocaleString()}</span></div>
              </div>
              {booking.status !== "cancelled" && editing && (
                <Button className="w-full mt-4 font-semibold" onClick={() => { handleSave(); }}>
                  Update & Proceed to Payment
                </Button>
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
