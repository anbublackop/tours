import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { ApiPackage, ApiBooking } from "@/types/api";
import { useTranslation } from "react-i18next";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const packageId   = searchParams.get("package") || "";
  const members     = Number(searchParams.get("members")) || 1;
  const date        = searchParams.get("date") || "";
  const hotelId     = searchParams.get("hotel") || "";
  const transportId = searchParams.get("transport") || "";

  const [pkg, setPkg] = useState<ApiPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!packageId) { setLoading(false); return; }
    api.get<ApiPackage>(`/packages/${packageId}`)
      .then(setPkg)
      .catch(() => setPkg(null))
      .finally(() => setLoading(false));
  }, [packageId, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col"><Navbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">{t("checkout.loading")}</p></div>
        <Footer />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col"><Navbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">{t("checkout.invalidBooking")}</p></div>
        <Footer />
      </div>
    );
  }

  const hotel     = (pkg.hotels ?? []).find((h) => h.id === hotelId) ?? pkg.hotels?.[0];
  const transport = (pkg.transport ?? []).find((t) => t.id === transportId) ?? pkg.transport?.[0];
  const nights    = Math.max((pkg.itinerary?.length ?? 1) - 1, (pkg.duration_days ?? 1) - 1);
  const hotelTotal = (hotel?.pricePerNight ?? 0) * nights;
  const totalPerPerson = pkg.price + hotelTotal + (transport?.price ?? 0);
  const grandTotal = totalPerPerson * members;

  const handlePay = async () => {
    setPaying(true);
    try {
      await api.post<ApiBooking>("/bookings", {
        package_id: pkg.id,
        travel_date: date,
        num_people: members,
        payment_method: "credit_card",
        hotel_id: hotelId || undefined,
        transport_id: transportId || undefined,
      }, true);
      toast.success(t("checkout.bookingConfirmed"));
      navigate("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("checkout.paymentFailed"));
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-12 bg-background flex-1">
        <div className="container max-w-2xl">
          <Link to={`/package/${pkg.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> {t("checkout.backToPackage")}
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">{t("checkout.title")}</h1>
            <p className="text-muted-foreground mb-8">{t("checkout.subtitle")}</p>

            <Card className="mb-6">
              <CardHeader><CardTitle className="font-display">{pkg.title}</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">{t("checkout.travelDate")}</span><span className="font-medium">{date}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("checkout.members")}</span><span className="font-medium">{members}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("checkout.duration")}</span><span className="font-medium">{pkg.duration}</span></div>
                {hotel && <div className="flex justify-between"><span className="text-muted-foreground">{t("checkout.hotel")}</span><span className="font-medium">{hotel.name}</span></div>}
                {transport && <div className="flex justify-between"><span className="text-muted-foreground">{t("checkout.transport")}</span><span className="font-medium">{transport.type}</span></div>}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader><CardTitle className="font-display">{t("checkout.priceBreakdown")}</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span>{t("checkout.basePackage")} × {members}</span><span>₹{(pkg.price * members).toLocaleString()}</span></div>
                {hotel && <div className="flex justify-between"><span>{t("checkout.accommodation")} × {nights} {t("checkout.nights")} × {members}</span><span>₹{(hotelTotal * members).toLocaleString()}</span></div>}
                {transport && <div className="flex justify-between"><span>{t("checkout.transport")} × {members}</span><span>₹{(transport.price * members).toLocaleString()}</span></div>}
                <Separator />
                <div className="flex justify-between text-lg font-bold"><span>{t("checkout.grandTotal")}</span><span className="text-primary">₹{grandTotal.toLocaleString()}</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                  <Shield className="w-5 h-5 text-secondary" />
                  <span>{t("checkout.securePayment")}</span>
                </div>
                <Button size="lg" className="w-full font-semibold gap-2" onClick={handlePay} disabled={paying || !date}>
                  <CreditCard className="w-5 h-5" />
                  {paying ? t("checkout.processing") : `${t("checkout.pay")} ₹${grandTotal.toLocaleString()}`}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">{t("checkout.termsNote")}</p>
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
