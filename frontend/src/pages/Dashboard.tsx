import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Users, Package, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiBooking } from "@/types/api";
import { useTranslation } from "react-i18next";

const statusColor = (s: string) => {
  if (s === "confirmed") return "bg-secondary text-secondary-foreground";
  if (s === "pending")   return "bg-accent text-accent-foreground";
  return "bg-destructive text-destructive-foreground";
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    api.get<ApiBooking[]>("/bookings/my", true)
      .then(setBookings)
      .catch(() => toast.error(t("dashboard.failedLoad")))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleCancel = async (bookingId: number) => {
    try {
      const updated = await api.put<ApiBooking>(`/bookings/${bookingId}/cancel`, {}, true);
      setBookings((prev) => prev.map((b) => b.id === bookingId ? updated : b));
      toast.success(t("dashboard.bookingCancelled"));
    } catch {
      toast.error(t("dashboard.failedCancel"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-8 bg-background flex-1">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">{t("dashboard.title")}</h1>
              <p className="text-muted-foreground">{t("dashboard.welcomeBack")}, {user?.name ?? t("dashboard.traveller")}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {loading ? (
              <>
                <Card><CardContent className="p-4 flex items-center gap-3"><Skeleton className="w-8 h-8 rounded-lg shrink-0" /><div className="flex-1 space-y-2"><Skeleton className="h-7 w-12" /><Skeleton className="h-4 w-28" /></div></CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3"><Skeleton className="w-8 h-8 rounded-lg shrink-0" /><div className="flex-1 space-y-2"><Skeleton className="h-7 w-12" /><Skeleton className="h-4 w-24" /></div></CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3"><Skeleton className="w-8 h-8 rounded-lg shrink-0" /><div className="flex-1 space-y-2"><Skeleton className="h-7 w-12" /><Skeleton className="h-4 w-28" /></div></CardContent></Card>
              </>
            ) : (
              <>
                <Card><CardContent className="p-4 flex items-center gap-3"><Package className="w-8 h-8 text-primary" /><div><p className="text-2xl font-bold">{bookings.length}</p><p className="text-sm text-muted-foreground">{t("dashboard.totalBookings")}</p></div></CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3"><Calendar className="w-8 h-8 text-secondary" /><div><p className="text-2xl font-bold">{bookings.filter((b) => b.status === "confirmed").length}</p><p className="text-sm text-muted-foreground">{t("dashboard.confirmed")}</p></div></CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3"><Users className="w-8 h-8 text-accent" /><div><p className="text-2xl font-bold">{bookings.reduce((s, b) => s + b.num_people, 0)}</p><p className="text-sm text-muted-foreground">{t("dashboard.totalTravellers")}</p></div></CardContent></Card>
              </>
            )}
          </div>

          <h2 className="font-display text-xl font-semibold mb-4">{t("dashboard.myBookings")}</h2>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}><CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3"><Skeleton className="h-5 w-48" /><Skeleton className="h-5 w-20 rounded-full" /></div>
                      <div className="flex gap-4"><Skeleton className="h-4 w-10" /><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-20" /></div>
                    </div>
                    <div className="flex gap-2"><Skeleton className="h-8 w-24 rounded-md" /><Skeleton className="h-8 w-20 rounded-md" /></div>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-muted-foreground">{t("dashboard.noBookings")} <Link to="/" className="text-primary hover:underline">{t("dashboard.browsePackages")}</Link></p>
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
                          <span>👥 {booking.num_people} {t("dashboard.members")}</span>
                          <span className="font-semibold text-primary">₹{booking.total_price.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/booking/${booking.id}`}><Button variant="outline" size="sm">{t("dashboard.viewDetails")}</Button></Link>
                        {booking.status !== "cancelled" && (
                          <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleCancel(booking.id)}>
                            <XCircle className="w-3 h-3" /> {t("dashboard.cancel")}
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
