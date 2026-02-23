import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Star, MapPin, Check, X, ChevronDown, ChevronUp, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EnquiryModal from "@/components/EnquiryModal";
import { getPackageById } from "@/data/packages";

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pkg = getPackageById(id || "");

  const [selectedHotel, setSelectedHotel] = useState(pkg?.hotels[0]?.id || "");
  const [selectedTransport, setSelectedTransport] = useState(pkg?.transport[0]?.id || "");
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [showBooking, setShowBooking] = useState(false);
  const [members, setMembers] = useState(2);
  const [travelDate, setTravelDate] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-muted-foreground text-lg">Package not found.</p></div>
        <Footer />
      </div>
    );
  }

  const hotel = pkg.hotels.find((h) => h.id === selectedHotel);
  const transport = pkg.transport.find((t) => t.id === selectedTransport);
  const addonTotal = pkg.addons.filter((a) => selectedAddons.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const hotelTotal = (hotel?.pricePerNight || 0) * (pkg.itinerary.length - 1);
  const totalPerPerson = pkg.price + hotelTotal + (transport?.price || 0) + addonTotal;
  const grandTotal = totalPerPerson * members;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);
  };

  const handleBookNow = () => {
    setShowBooking(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleConfirmBooking = () => {
    navigate(`/checkout?package=${pkg.id}&members=${members}&date=${travelDate}&hotel=${selectedHotel}&transport=${selectedTransport}&addons=${selectedAddons.join(",")}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative h-72 md:h-96">
        <img src={pkg.image} alt={pkg.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container pb-8 z-10">
          <Badge className="bg-primary text-primary-foreground mb-3">{pkg.category}</Badge>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-background mb-2">{pkg.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-background/80 text-sm">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{pkg.duration}</span>
            {pkg.state && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{pkg.state}</span>}
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-accent text-accent" />{pkg.rating} ({pkg.reviews} reviews)</span>
          </div>
        </div>
      </section>

      <section className="py-8 bg-background flex-1">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card>
                <CardHeader><CardTitle className="font-display">About This Trip</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{pkg.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {pkg.highlights.map((h) => (
                      <Badge key={h} variant="secondary">{h}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Itinerary */}
              <Card>
                <CardHeader><CardTitle className="font-display">Day-wise Itinerary</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {pkg.itinerary.map((day) => (
                    <div key={day.day} className="border border-border rounded-lg overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                        onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{day.day}</span>
                          <span className="font-semibold text-foreground">{day.title}</span>
                        </div>
                        {expandedDay === day.day ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {expandedDay === day.day && (
                        <div className="px-4 pb-4 border-t border-border pt-3">
                          <p className="text-muted-foreground text-sm mb-2">{day.description}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>🍽️ {day.meals}</span>
                            {day.overnight && <span>🏨 Overnight: {day.overnight}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Tabs defaultValue="hotels">
                <TabsList className="w-full">
                  <TabsTrigger value="hotels" className="flex-1">Accommodation</TabsTrigger>
                  <TabsTrigger value="transport" className="flex-1">Transport</TabsTrigger>
                  <TabsTrigger value="addons" className="flex-1">Add-ons</TabsTrigger>
                </TabsList>

                <TabsContent value="hotels" className="mt-4 space-y-3">
                  {pkg.hotels.map((h) => (
                    <div
                      key={h.id}
                      onClick={() => setSelectedHotel(h.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedHotel === h.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-foreground">{h.name}</h4>
                          <Badge variant="outline" className="mt-1 capitalize">{h.category}</Badge>
                          <div className="flex items-center gap-1 mt-1"><Star className="w-3 h-3 fill-accent text-accent" /><span className="text-sm">{h.rating}</span></div>
                        </div>
                        <span className="text-lg font-bold text-primary">₹{h.pricePerNight.toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/night</span></span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {h.amenities.map((a) => <span key={a} className="text-xs bg-muted px-2 py-0.5 rounded">{a}</span>)}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="transport" className="mt-4 space-y-3">
                  {pkg.transport.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTransport(t.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedTransport === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{t.type}</h4>
                          <p className="text-sm text-muted-foreground">{t.description}</p>
                        </div>
                        <span className="text-lg font-bold text-primary">₹{t.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="addons" className="mt-4 space-y-3">
                  {pkg.addons.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => toggleAddon(a.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAddons.includes(a.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${selectedAddons.includes(a.id) ? "bg-primary border-primary" : "border-border"}`}>
                            {selectedAddons.includes(a.id) && <Check className="w-3 h-3 text-primary-foreground" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{a.name}</h4>
                            <p className="text-sm text-muted-foreground">{a.description}</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-primary">₹{a.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>

              {/* Rules */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="font-display text-base">Inclusions</CardTitle></CardHeader>
                  <CardContent className="space-y-1.5">
                    {pkg.inclusions.map((i) => (
                      <div key={i} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-secondary" />{i}</div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="font-display text-base">Exclusions</CardTitle></CardHeader>
                  <CardContent className="space-y-1.5">
                    {pkg.exclusions.map((i) => (
                      <div key={i} className="flex items-center gap-2 text-sm"><X className="w-4 h-4 text-destructive" />{i}</div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="font-display text-base">Booking Rules</CardTitle></CardHeader>
                  <CardContent><ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">{pkg.bookingRules.map((r) => <li key={r}>{r}</li>)}</ul></CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="font-display text-base">Travel Rules</CardTitle></CardHeader>
                  <CardContent><ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">{pkg.travelRules.map((r) => <li key={r}>{r}</li>)}</ul></CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-[150px]">
                <CardHeader>
                  <CardTitle className="font-display">
                    <span className="text-3xl text-primary">₹{pkg.price.toLocaleString()}</span>
                    {pkg.originalPrice && <span className="text-base text-muted-foreground line-through ml-2">₹{pkg.originalPrice.toLocaleString()}</span>}
                    <span className="block text-sm font-normal text-muted-foreground mt-1">per person (base price)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button size="lg" className="w-full font-semibold" onClick={handleBookNow}>Book Now</Button>
                  <EnquiryModal trigger={<Button variant="outline" size="lg" className="w-full">Enquire Now</Button>} packageName={pkg.title} />
                  <Separator />
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between"><span className="text-muted-foreground">Base Price</span><span>₹{pkg.price.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Hotel ({hotel?.name})</span><span>₹{hotelTotal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Transport</span><span>₹{transport?.price.toLocaleString()}</span></div>
                    {addonTotal > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Add-ons</span><span>₹{addonTotal.toLocaleString()}</span></div>}
                    <Separator />
                    <div className="flex justify-between font-bold text-base"><span>Total / person</span><span className="text-primary">₹{totalPerPerson.toLocaleString()}</span></div>
                  </div>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
                    <Button variant="outline" className="w-full gap-2 mt-2">💬 Chat on WhatsApp</Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Booking Calculator */}
          {showBooking && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12" id="booking-section">
              <Card>
                <CardHeader><CardTitle className="font-display text-2xl">Complete Your Booking</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <Label>Travel Date</Label>
                      <Input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div>
                      <Label>Number of Members</Label>
                      <Input type="number" min={1} max={20} value={members} onChange={(e) => setMembers(Number(e.target.value))} />
                    </div>
                    <div>
                      <Label>Hotel</Label>
                      <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{pkg.hotels.map((h) => <SelectItem key={h.id} value={h.id}>{h.name} (₹{h.pricePerNight}/night)</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Transport</Label>
                      <Select value={selectedTransport} onValueChange={setSelectedTransport}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{pkg.transport.map((t) => <SelectItem key={t.id} value={t.id}>{t.type} (₹{t.price})</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="bg-muted rounded-lg p-6">
                    <h3 className="font-display text-lg font-semibold mb-4">Price Breakdown</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Base Package × {members}</span><span>₹{(pkg.price * members).toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Accommodation ({hotel?.name}) × {pkg.itinerary.length - 1} nights × {members}</span><span>₹{(hotelTotal * members).toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Transport ({transport?.type}) × {members}</span><span>₹{((transport?.price || 0) * members).toLocaleString()}</span></div>
                      {selectedAddons.length > 0 && pkg.addons.filter((a) => selectedAddons.includes(a.id)).map((a) => (
                        <div key={a.id} className="flex justify-between"><span>{a.name} × {members}</span><span>₹{(a.price * members).toLocaleString()}</span></div>
                      ))}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold"><span>Grand Total</span><span className="text-primary">₹{grandTotal.toLocaleString()}</span></div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6 justify-end">
                    <Button variant="outline" onClick={() => setShowBooking(false)}>Cancel</Button>
                    <Button size="lg" onClick={handleConfirmBooking} disabled={!travelDate} className="font-semibold gap-2">
                      <Calendar className="w-4 h-4" /> Confirm Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PackageDetail;
