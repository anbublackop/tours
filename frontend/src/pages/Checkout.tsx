import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPackageById } from "@/data/packages";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package") || "";
  const members = Number(searchParams.get("members")) || 1;
  const date = searchParams.get("date") || "";
  const hotelId = searchParams.get("hotel") || "";
  const transportId = searchParams.get("transport") || "";
  const addonIds = (searchParams.get("addons") || "").split(",").filter(Boolean);

  const pkg = getPackageById(packageId);

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Invalid booking.</p></div>
        <Footer />
      </div>
    );
  }

  const hotel = pkg.hotels.find((h) => h.id === hotelId) || pkg.hotels[0];
  const transport = pkg.transport.find((t) => t.id === transportId) || pkg.transport[0];
  const selectedAddons = pkg.addons.filter((a) => addonIds.includes(a.id));
  const hotelTotal = hotel.pricePerNight * (pkg.itinerary.length - 1);
  const addonTotal = selectedAddons.reduce((s, a) => s + a.price, 0);
  const totalPerPerson = pkg.price + hotelTotal + transport.price + addonTotal;
  const grandTotal = totalPerPerson * members;

  const handlePay = () => {
    toast.success("Payment gateway will be integrated with Razorpay/Stripe. Booking confirmed!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-12 bg-background flex-1">
        <div className="container max-w-2xl">
          <Link to={`/package/${pkg.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Package
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Checkout</h1>
            <p className="text-muted-foreground mb-8">Review your booking details and proceed to payment</p>

            <Card className="mb-6">
              <CardHeader><CardTitle className="font-display">{pkg.title}</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Travel Date</span><span className="font-medium">{date}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Members</span><span className="font-medium">{members}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">{pkg.duration}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Hotel</span><span className="font-medium">{hotel.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Transport</span><span className="font-medium">{transport.type}</span></div>
                {selectedAddons.length > 0 && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Add-ons</span><span className="font-medium">{selectedAddons.map((a) => a.name).join(", ")}</span></div>
                )}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader><CardTitle className="font-display">Price Breakdown</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Base Package × {members}</span><span>₹{(pkg.price * members).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Accommodation × {pkg.itinerary.length - 1} nights × {members}</span><span>₹{(hotelTotal * members).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Transport × {members}</span><span>₹{(transport.price * members).toLocaleString()}</span></div>
                {selectedAddons.map((a) => (
                  <div key={a.id} className="flex justify-between"><span>{a.name} × {members}</span><span>₹{(a.price * members).toLocaleString()}</span></div>
                ))}
                <Separator />
                <div className="flex justify-between text-lg font-bold"><span>Grand Total</span><span className="text-primary">₹{grandTotal.toLocaleString()}</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                  <Shield className="w-5 h-5 text-secondary" />
                  <span>Your payment is secure and encrypted</span>
                </div>
                <Button size="lg" className="w-full font-semibold gap-2" onClick={handlePay}>
                  <CreditCard className="w-5 h-5" /> Pay ₹{grandTotal.toLocaleString()}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">By clicking Pay, you agree to our booking terms and cancellation policy.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Checkout;
