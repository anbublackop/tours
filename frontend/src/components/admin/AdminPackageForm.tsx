import { useState } from "react";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ApiPackage, ApiDestination, ApiCategory } from "@/types/api";

// ─── types ────────────────────────────────────────────────────────────────────

interface ItineraryDay {
  day: number; title: string; description: string;
  meals: string; overnight: string; image_url: string;
}

interface Hotel {
  id: string; name: string; category: string;
  pricePerNight: number; rating: number; amenities: string[];
}

interface Transport {
  id: string; type: string; description: string; price: number;
}

interface Addon {
  id: string; name: string; description: string; icon: string;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function Field({ label, required, children, hint }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** A simple dynamic list of strings (highlights, inclusions, etc.) */
function StringListEditor({ items, onChange, placeholder }: {
  items: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  const update = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, ""]);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
          <Input value={item} onChange={e => update(i, e.target.value)} placeholder={placeholder} className="flex-1" />
          <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1.5 w-full border-dashed">
        <Plus className="w-3.5 h-3.5" /> Add item
      </Button>
    </div>
  );
}

// ─── section components ───────────────────────────────────────────────────────

function ItineraryEditor({ days, onChange }: {
  days: ItineraryDay[]; onChange: (v: ItineraryDay[]) => void;
}) {
  const add = () => onChange([...days, {
    day: days.length + 1, title: "", description: "",
    meals: "Breakfast", overnight: "", image_url: "",
  }]);
  const remove = (i: number) => {
    const next = days.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 }));
    onChange(next);
  };
  const set = (i: number, field: keyof ItineraryDay, val: string | number) => {
    const next = [...days];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {days.map((day, i) => (
        <Card key={i} className="border-border">
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{day.day}</span>
              Day {day.day}
            </CardTitle>
            <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field label="Title" required>
              <Input value={day.title} onChange={e => set(i, "title", e.target.value)} placeholder="Arrival & City Tour" />
            </Field>
            <Field label="Description" required>
              <Textarea value={day.description} onChange={e => set(i, "description", e.target.value)} rows={3}
                placeholder="Detailed description of the day's activities…" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Meals" hint="e.g. Breakfast, Lunch, Dinner">
                <Input value={day.meals} onChange={e => set(i, "meals", e.target.value)} placeholder="Breakfast" />
              </Field>
              <Field label="Overnight at">
                <Input value={day.overnight} onChange={e => set(i, "overnight", e.target.value)} placeholder="Delhi" />
              </Field>
            </div>
            <Field label="Day Photo URL" hint="Optional image shown when this day is expanded">
              <Input value={day.image_url} onChange={e => set(i, "image_url", e.target.value)} placeholder="https://…" />
            </Field>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" onClick={add} className="w-full gap-2 border-dashed">
        <Plus className="w-4 h-4" /> Add Day
      </Button>
    </div>
  );
}

function HotelsEditor({ hotels, onChange }: {
  hotels: Hotel[]; onChange: (v: Hotel[]) => void;
}) {
  const add = () => onChange([...hotels, {
    id: `hotel-${Date.now()}`, name: "", category: "3-star",
    pricePerNight: 0, rating: 4.0, amenities: [],
  }]);
  const remove = (i: number) => onChange(hotels.filter((_, idx) => idx !== i));
  const set = (i: number, field: keyof Hotel, val: unknown) => {
    const next = [...hotels];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };
  const setAmenity = (i: number, j: number, val: string) => {
    const next = [...hotels];
    const amenities = [...next[i].amenities];
    amenities[j] = val;
    next[i] = { ...next[i], amenities };
    onChange(next);
  };
  const addAmenity = (i: number) => {
    const next = [...hotels];
    next[i] = { ...next[i], amenities: [...next[i].amenities, ""] };
    onChange(next);
  };
  const removeAmenity = (i: number, j: number) => {
    const next = [...hotels];
    next[i] = { ...next[i], amenities: next[i].amenities.filter((_, idx) => idx !== j) };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {hotels.map((h, i) => (
        <Card key={i}>
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold">{h.name || `Hotel ${i + 1}`}</CardTitle>
            <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Hotel Name" required>
                <Input value={h.name} onChange={e => set(i, "name", e.target.value)} placeholder="The Grand Hotel" />
              </Field>
              <Field label="Category">
                <select value={h.category} onChange={e => set(i, "category", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                  {["Budget", "2-star", "3-star", "4-star", "5-star", "Luxury"].map(c =>
                    <option key={c} value={c}>{c}</option>
                  )}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price per Night (₹)" required>
                <Input type="number" value={h.pricePerNight || ""} onChange={e => set(i, "pricePerNight", Number(e.target.value))} />
              </Field>
              <Field label="Star Rating">
                <Input type="number" step="0.1" min="1" max="5" value={h.rating || ""} onChange={e => set(i, "rating", Number(e.target.value))} />
              </Field>
            </div>
            <div>
              <Label className="text-sm mb-2 block">Amenities</Label>
              <div className="space-y-2">
                {h.amenities.map((a, j) => (
                  <div key={j} className="flex gap-2 items-center">
                    <Input value={a} onChange={e => setAmenity(i, j, e.target.value)} placeholder="Free WiFi" className="flex-1" />
                    <button onClick={() => removeAmenity(i, j)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addAmenity(i)} className="gap-1.5 border-dashed w-full">
                  <Plus className="w-3.5 h-3.5" /> Add amenity
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" onClick={add} className="w-full gap-2 border-dashed">
        <Plus className="w-4 h-4" /> Add Hotel Option
      </Button>
    </div>
  );
}

function TransportEditor({ transport, onChange }: {
  transport: Transport[]; onChange: (v: Transport[]) => void;
}) {
  const add = () => onChange([...transport, { id: `transport-${Date.now()}`, type: "", description: "", price: 0 }]);
  const remove = (i: number) => onChange(transport.filter((_, idx) => idx !== i));
  const set = (i: number, field: keyof Transport, val: unknown) => {
    const next = [...transport];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {transport.map((t, i) => (
        <Card key={i}>
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold">{t.type || `Option ${i + 1}`}</CardTitle>
            <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Type" required>
                <Input value={t.type} onChange={e => set(i, "type", e.target.value)} placeholder="Private AC Car" />
              </Field>
              <Field label="Price (₹)" required>
                <Input type="number" value={t.price || ""} onChange={e => set(i, "price", Number(e.target.value))} />
              </Field>
            </div>
            <Field label="Description">
              <Textarea value={t.description} onChange={e => set(i, "description", e.target.value)}
                rows={2} placeholder="Comfortable AC vehicle with professional driver…" />
            </Field>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" onClick={add} className="w-full gap-2 border-dashed">
        <Plus className="w-4 h-4" /> Add Transport Option
      </Button>
    </div>
  );
}

function AddonsEditor({ addons, onChange }: {
  addons: Addon[]; onChange: (v: Addon[]) => void;
}) {
  const add = () => onChange([...addons, { id: `addon-${Date.now()}`, name: "", description: "", icon: "" }]);
  const remove = (i: number) => onChange(addons.filter((_, idx) => idx !== i));
  const set = (i: number, field: keyof Addon, val: unknown) => {
    const next = [...addons];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {addons.map((a, i) => (
        <Card key={i}>
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold">{a.name || `Add-on ${i + 1}`}</CardTitle>
            <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Name" required>
                <Input value={a.name} onChange={e => set(i, "name", e.target.value)} placeholder="Travel Insurance" className="col-span-2" />
              </Field>
              <Field label="Icon (emoji)">
                <Input value={a.icon} onChange={e => set(i, "icon", e.target.value)} placeholder="🛡️" />
              </Field>
            </div>
            <Field label="Description">
              <Input value={a.description} onChange={e => set(i, "description", e.target.value)} placeholder="Comprehensive travel coverage" />
            </Field>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" onClick={add} className="w-full gap-2 border-dashed">
        <Plus className="w-4 h-4" /> Add Add-on
      </Button>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

interface Props {
  initial?: ApiPackage;
  destinations: ApiDestination[];
  categories: ApiCategory[];
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}

const EMPTY_BASIC = {
  title: "", country: "", destination_id: "", category_id: "", category: "",
  state: "", location: "", description: "", price: "", original_price: "",
  duration: "", duration_days: "", image: "", rating: "", max_group_size: "",
  available_dates: "",
};

export default function AdminPackageForm({ initial, destinations, categories, onSave, onCancel }: Props) {
  const [basic, setBasic] = useState(() => initial ? {
    title: initial.title, country: initial.country, category: initial.category ?? "",
    destination_id: String(initial.destination_id ?? ""), category_id: String(initial.category_id ?? ""),
    state: initial.state ?? "", location: initial.location ?? "", description: initial.description ?? "",
    price: String(initial.price), original_price: String(initial.original_price ?? ""),
    duration: initial.duration, duration_days: String(initial.duration_days ?? ""),
    image: initial.image ?? "", rating: initial.rating ?? "",
    max_group_size: String(initial.max_group_size ?? ""), available_dates: (initial as Record<string, unknown>).available_dates as string ?? "",
  } : EMPTY_BASIC);

  const [highlights,    setHighlights]    = useState<string[]>((initial?.highlights as string[]) ?? []);
  const [itinerary,     setItinerary]     = useState<ItineraryDay[]>((initial?.itinerary as ItineraryDay[]) ?? []);
  const [hotels,        setHotels]        = useState<Hotel[]>((initial?.hotels as Hotel[]) ?? []);
  const [transport,     setTransport]     = useState<Transport[]>((initial?.transport as Transport[]) ?? []);
  const [addons,        setAddons]        = useState<Addon[]>((initial?.addons as Addon[]) ?? []);
  const [inclusions,    setInclusions]    = useState<string[]>((initial?.inclusions as string[]) ?? []);
  const [exclusions,    setExclusions]    = useState<string[]>((initial?.exclusions as string[]) ?? []);
  const [bookingRules,  setBookingRules]  = useState<string[]>((initial?.booking_rules as string[]) ?? []);
  const [travelRules,   setTravelRules]   = useState<string[]>((initial?.travel_rules as string[]) ?? []);

  const [saving, setSaving] = useState(false);

  const setB = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setBasic(prev => ({ ...prev, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        ...basic,
        price:           Number(basic.price),
        original_price:  basic.original_price  ? Number(basic.original_price)  : undefined,
        duration_days:   basic.duration_days   ? Number(basic.duration_days)   : undefined,
        destination_id:  basic.destination_id  ? Number(basic.destination_id)  : undefined,
        category_id:     basic.category_id     ? Number(basic.category_id)     : undefined,
        max_group_size:  basic.max_group_size  ? Number(basic.max_group_size)  : undefined,
        highlights,
        itinerary,
        hotels,
        transport,
        addons,
        inclusions,
        exclusions,
        booking_rules: bookingRules,
        travel_rules:  travelRules,
      });
    } finally {
      setSaving(false);
    }
  };

  const counts = {
    itinerary: itinerary.length,
    accommodation: hotels.length,
    transport: transport.length,
    addons: addons.length,
    inclexcl: inclusions.length + exclusions.length,
    rules: bookingRules.length + travelRules.length,
  };

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-display font-semibold text-foreground">
              {initial ? "Edit Package" : "Add New Package"}
            </h2>
            <p className="text-xs text-muted-foreground">{initial?.title ?? "Fill in the details below"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={saving}>Discard</Button>
          <Button onClick={handleSave} disabled={saving} className="min-w-24">
            {saving ? "Saving…" : initial ? "Save Changes" : "Create Package"}
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-1 bg-muted/60 p-1">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="highlights">
              Highlights {highlights.length > 0 && <span className="ml-1.5 text-xs opacity-70">({highlights.length})</span>}
            </TabsTrigger>
            <TabsTrigger value="itinerary">
              Itinerary {counts.itinerary > 0 && <span className="ml-1.5 text-xs opacity-70">({counts.itinerary}d)</span>}
            </TabsTrigger>
            <TabsTrigger value="accommodation">
              Accommodation {counts.accommodation > 0 && <span className="ml-1.5 text-xs opacity-70">({counts.accommodation})</span>}
            </TabsTrigger>
            <TabsTrigger value="transport">
              Transport {counts.transport > 0 && <span className="ml-1.5 text-xs opacity-70">({counts.transport})</span>}
            </TabsTrigger>
            <TabsTrigger value="addons">
              Add-ons {counts.addons > 0 && <span className="ml-1.5 text-xs opacity-70">({counts.addons})</span>}
            </TabsTrigger>
            <TabsTrigger value="inclexcl">
              Inclusions / Exclusions {counts.inclexcl > 0 && <span className="ml-1.5 text-xs opacity-70">({counts.inclexcl})</span>}
            </TabsTrigger>
            <TabsTrigger value="rules">
              Rules {counts.rules > 0 && <span className="ml-1.5 text-xs opacity-70">({counts.rules})</span>}
            </TabsTrigger>
          </TabsList>

          {/* ── Basic Info ── */}
          <TabsContent value="basic">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="font-display text-base">Core Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Field label="Package Title" required>
                    <Input value={basic.title} onChange={setB("title")} placeholder="Rajasthan Royal Heritage Tour" />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Destination" required>
                      <select value={basic.destination_id} onChange={setB("destination_id")}
                        className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="">— select —</option>
                        {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </Field>
                    <Field label="Country slug" required hint="e.g. india, nepal">
                      <Input value={basic.country} onChange={setB("country")} placeholder="india" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Category">
                      <select value={basic.category_id} onChange={setB("category_id")}
                        className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="">— select —</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </Field>
                    <Field label="State">
                      <Input value={basic.state} onChange={setB("state")} placeholder="Rajasthan" />
                    </Field>
                  </div>
                  <Field label="Location / Starting city" required>
                    <Input value={basic.location} onChange={setB("location")} placeholder="Jaipur, Rajasthan" />
                  </Field>
                  <Field label="Description">
                    <Textarea value={basic.description} onChange={setB("description")} rows={4}
                      placeholder="A detailed overview of this package for potential travellers…" />
                  </Field>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle className="font-display text-base">Pricing & Duration</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Price (₹ per person)" required>
                        <Input type="number" value={basic.price} onChange={setB("price")} placeholder="25000" />
                      </Field>
                      <Field label="Original Price (₹)" hint="For showing strikethrough">
                        <Input type="number" value={basic.original_price} onChange={setB("original_price")} placeholder="30000" />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Duration label" required hint='e.g. "7D/6N"'>
                        <Input value={basic.duration} onChange={setB("duration")} placeholder="7D/6N" />
                      </Field>
                      <Field label="Duration (days)">
                        <Input type="number" value={basic.duration_days} onChange={setB("duration_days")} placeholder="7" />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Rating" hint="e.g. 4.8">
                        <Input value={basic.rating} onChange={setB("rating")} placeholder="4.8" />
                      </Field>
                      <Field label="Max Group Size">
                        <Input type="number" value={basic.max_group_size} onChange={setB("max_group_size")} placeholder="20" />
                      </Field>
                    </div>
                    <Field label="Available Dates" hint="e.g. Year-round / Oct–Mar">
                      <Input value={basic.available_dates} onChange={setB("available_dates")} placeholder="October to March" />
                    </Field>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="font-display text-base">Cover Image</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <Field label="Image URL">
                      <Input value={basic.image} onChange={setB("image")} placeholder="https://images.unsplash.com/…" />
                    </Field>
                    {basic.image && (
                      <img src={basic.image} alt="preview" className="w-full h-40 object-cover rounded-lg border border-border" />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── Highlights ── */}
          <TabsContent value="highlights">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle className="font-display text-base">Highlights</CardTitle>
                <p className="text-sm text-muted-foreground">Key selling points shown as badges on the package card.</p>
              </CardHeader>
              <CardContent>
                <StringListEditor items={highlights} onChange={setHighlights} placeholder="Guided Taj Mahal visit at sunrise" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Itinerary ── */}
          <TabsContent value="itinerary">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-foreground">Day-wise Itinerary</h3>
                  <p className="text-sm text-muted-foreground">Days are numbered automatically. Add them in order.</p>
                </div>
              </div>
              <ItineraryEditor days={itinerary} onChange={setItinerary} />
            </div>
          </TabsContent>

          {/* ── Accommodation ── */}
          <TabsContent value="accommodation">
            <div className="max-w-2xl space-y-2">
              <div className="mb-4">
                <h3 className="font-display font-semibold text-foreground">Accommodation Options</h3>
                <p className="text-sm text-muted-foreground">Travellers pick one hotel option during booking. Add multiple tiers (budget, standard, luxury).</p>
              </div>
              <HotelsEditor hotels={hotels} onChange={setHotels} />
            </div>
          </TabsContent>

          {/* ── Transport ── */}
          <TabsContent value="transport">
            <div className="max-w-2xl space-y-2">
              <div className="mb-4">
                <h3 className="font-display font-semibold text-foreground">Transport Options</h3>
                <p className="text-sm text-muted-foreground">Travellers pick one transport option during booking.</p>
              </div>
              <TransportEditor transport={transport} onChange={setTransport} />
            </div>
          </TabsContent>

          {/* ── Add-ons ── */}
          <TabsContent value="addons">
            <div className="max-w-2xl space-y-2">
              <div className="mb-4">
                <h3 className="font-display font-semibold text-foreground">Add-ons</h3>
                <p className="text-sm text-muted-foreground">Optional extras travellers can select. Displayed as a bullet list on the detail page.</p>
              </div>
              <AddonsEditor addons={addons} onChange={setAddons} />
            </div>
          </TabsContent>

          {/* ── Inclusions / Exclusions ── */}
          <TabsContent value="inclexcl">
            <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
              <Card className="border-green-100 dark:border-green-900/40">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</span>
                    Inclusions
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">What's included in the package price.</p>
                </CardHeader>
                <CardContent>
                  <StringListEditor items={inclusions} onChange={setInclusions} placeholder="Accommodation (as per itinerary)" />
                </CardContent>
              </Card>
              <Card className="border-red-100 dark:border-red-900/40">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">✕</span>
                    Exclusions
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">What's NOT included in the price.</p>
                </CardHeader>
                <CardContent>
                  <StringListEditor items={exclusions} onChange={setExclusions} placeholder="International airfare" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Rules ── */}
          <TabsContent value="rules">
            <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base">Booking Rules</CardTitle>
                  <p className="text-xs text-muted-foreground">Payment, cancellation, and refund policies.</p>
                </CardHeader>
                <CardContent>
                  <StringListEditor items={bookingRules} onChange={setBookingRules} placeholder="50% advance required at booking" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base">Travel Rules</CardTitle>
                  <p className="text-xs text-muted-foreground">What travellers need to know before the trip.</p>
                </CardHeader>
                <CardContent>
                  <StringListEditor items={travelRules} onChange={setTravelRules} placeholder="Valid government ID mandatory" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer save bar */}
      <div className="bg-card border-t border-border px-6 py-3 flex justify-end gap-2 shrink-0">
        <Button variant="outline" onClick={onCancel} disabled={saving}>Discard</Button>
        <Button onClick={handleSave} disabled={saving} className="min-w-32">
          {saving ? "Saving…" : initial ? "Save Changes" : "Create Package"}
        </Button>
      </div>
    </div>
  );
}
