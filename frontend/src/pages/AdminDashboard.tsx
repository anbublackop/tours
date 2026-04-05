import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Package, MapPin, Tag, BookOpen,
  PlusCircle, Pencil, Trash2, Archive, ArchiveRestore,
  XCircle, BarChart3, Users, Calendar, ExternalLink, X,
} from "lucide-react";
import AdminPackageForm from "@/components/admin/AdminPackageForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { ApiBooking, ApiPackage, ApiDestination, ApiCategory } from "@/types/api";

// ─── helpers ────────────────────────────────────────────────────────────────

const statusBadge = (s: string) => {
  if (s === "confirmed") return "bg-green-100 text-green-700 border-green-200";
  if (s === "pending")   return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-red-100 text-red-700 border-red-200";
};

// ─── slide-over dialog ───────────────────────────────────────────────────────

function SlideOver({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-lg bg-background border-l border-border shadow-2xl flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}{required && <span className="text-destructive ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

// ─── Destination Form ────────────────────────────────────────────────────────

function DestinationForm({ initial, onSave, onCancel }: {
  initial?: ApiDestination;
  onSave: (d: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "", slug: initial?.slug ?? "",
    description: initial?.description ?? "", image_url: initial?.image_url ?? "",
    banner_url: initial?.banner_url ?? "", is_featured: initial?.is_featured ?? true,
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Name" required><Input value={form.name} onChange={set("name")} required /></Field>
      <Field label="Slug" required><Input value={form.slug} onChange={set("slug")} placeholder="south-korea" required /></Field>
      <Field label="Description"><Textarea value={form.description} onChange={set("description")} rows={3} /></Field>
      <Field label="Card Image URL"><Input value={form.image_url} onChange={set("image_url")} placeholder="https://…" /></Field>
      <Field label="Banner Image URL"><Input value={form.banner_url} onChange={set("banner_url")} placeholder="https://…" /></Field>
      <Separator />
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1" disabled={saving}>{saving ? "Saving…" : initial ? "Update" : "Create Destination"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

// ─── Category Form ────────────────────────────────────────────────────────────

function CategoryForm({ initial, onSave, onCancel }: {
  initial?: ApiCategory;
  onSave: (d: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "", slug: initial?.slug ?? "",
    description: initial?.description ?? "", icon: initial?.icon ?? "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Name" required><Input value={form.name} onChange={set("name")} required /></Field>
      <Field label="Slug" required><Input value={form.slug} onChange={set("slug")} placeholder="wildlife-safari" required /></Field>
      <Field label="Description"><Textarea value={form.description} onChange={set("description")} rows={2} /></Field>
      <Field label="Icon (emoji)"><Input value={form.icon} onChange={set("icon")} placeholder="🦁" /></Field>
      <Separator />
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1" disabled={saving}>{saving ? "Saving…" : initial ? "Update" : "Create Category"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Section = "overview" | "packages" | "destinations" | "categories" | "bookings";

const AdminDashboard = () => {
  const { user } = useAuth();

  const [section, setSection] = useState<Section>("overview");
  const [packages, setPackages]       = useState<ApiPackage[]>([]);
  const [destinations, setDestinations] = useState<ApiDestination[]>([]);
  const [categories, setCategories]   = useState<ApiCategory[]>([]);
  const [bookings, setBookings]        = useState<ApiBooking[]>([]);
  const [loading, setLoading]          = useState(true);

  // package form (full-screen)
  const [pkgForm, setPkgForm]      = useState<{ open: boolean; editing?: ApiPackage }>({ open: false });
  const [pkgFormLoading, setPkgFormLoading] = useState(false);
  const [destForm, setDestForm] = useState<{ open: boolean; editing?: ApiDestination }>({ open: false });
  const [catForm, setCatForm]   = useState<{ open: boolean; editing?: ApiCategory }>({ open: false });

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get<ApiPackage[]>("/packages/all", true),
      api.get<ApiDestination[]>("/destinations"),
      api.get<ApiCategory[]>("/categories"),
      api.get<ApiBooking[]>("/bookings", true),
    ])
      .then(([p, d, c, b]) => { setPackages(p); setDestinations(d); setCategories(c); setBookings(b); })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // ── Package actions ──────────────────────────────────────────────────────
  const savePackage = async (data: Record<string, unknown>) => {
    try {
      if (pkgForm.editing) {
        const updated = await api.put<ApiPackage>(`/packages/${pkgForm.editing.id}`, data, true);
        setPackages(prev => prev.map(p => p.id === updated.id ? updated : p));
        toast.success("Package updated.");
      } else {
        const created = await api.post<ApiPackage>("/packages", data, true);
        setPackages(prev => [created, ...prev]);
        toast.success("Package created.");
      }
      setPkgForm({ open: false });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save package.");
      throw e;
    }
  };

  const openEditForm = async (pkg: ApiPackage) => {
    setPkgFormLoading(true);
    try {
      // Fetch full package detail so all complex fields (itinerary, hotels, etc.) are populated
      const full = await api.get<ApiPackage>(`/packages/${pkg.id}`, true);
      setPkgForm({ open: true, editing: full });
    } catch {
      toast.error("Failed to load package details.");
    } finally {
      setPkgFormLoading(false);
    }
  };

  const toggleArchive = async (pkg: ApiPackage) => {
    try {
      const updated = await api.patch<ApiPackage>(`/packages/${pkg.id}/archive`, {}, true);
      setPackages(prev => prev.map(p => p.id === updated.id ? updated : p));
      toast.success(updated.is_active ? "Package restored." : "Package archived.");
    } catch { toast.error("Failed to update package."); }
  };

  const deletePackage = async (id: number) => {
    if (!confirm("Permanently delete this package? This cannot be undone.")) return;
    try {
      await api.delete(`/packages/${id}`, true);
      setPackages(prev => prev.filter(p => p.id !== id));
      toast.success("Package deleted.");
    } catch { toast.error("Failed to delete package."); }
  };

  // ── Destination actions ──────────────────────────────────────────────────
  const saveDestination = async (data: Record<string, unknown>) => {
    try {
      if (destForm.editing) {
        const updated = await api.put<ApiDestination>(`/destinations/${destForm.editing.slug}`, data, true);
        setDestinations(prev => prev.map(d => d.id === updated.id ? updated : d));
        toast.success("Destination updated.");
      } else {
        const created = await api.post<ApiDestination>("/destinations", data, true);
        setDestinations(prev => [...prev, created]);
        toast.success("Destination created.");
      }
      setDestForm({ open: false });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save destination.");
      throw e;
    }
  };

  const deleteDestination = async (slug: string) => {
    if (!confirm("Delete this destination? Packages linked to it will become unlinked.")) return;
    try {
      await api.delete(`/destinations/${slug}`, true);
      setDestinations(prev => prev.filter(d => d.slug !== slug));
      toast.success("Destination deleted.");
    } catch { toast.error("Failed to delete destination."); }
  };

  // ── Category actions ─────────────────────────────────────────────────────
  const saveCategory = async (data: Record<string, unknown>) => {
    try {
      if (catForm.editing) {
        const updated = await api.put<ApiCategory>(`/categories/${catForm.editing.slug}`, data, true);
        setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
        toast.success("Category updated.");
      } else {
        const created = await api.post<ApiCategory>("/categories", data, true);
        setCategories(prev => [...prev, created]);
        toast.success("Category created.");
      }
      setCatForm({ open: false });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save category.");
      throw e;
    }
  };

  const deleteCategory = async (slug: string) => {
    if (!confirm("Delete this category? Packages linked to it will become unlinked.")) return;
    try {
      await api.delete(`/categories/${slug}`, true);
      setCategories(prev => prev.filter(c => c.slug !== slug));
      toast.success("Category deleted.");
    } catch { toast.error("Failed to delete category."); }
  };

  // ── Booking actions ──────────────────────────────────────────────────────
  const cancelBooking = async (id: number) => {
    try {
      const updated = await api.put<ApiBooking>(`/bookings/${id}/cancel`, {}, true);
      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
      toast.success("Booking cancelled.");
    } catch { toast.error("Failed to cancel booking."); }
  };

  const revenue = bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + b.total_price, 0);
  const activePackages = packages.filter(p => p.is_active);
  const archivedPackages = packages.filter(p => !p.is_active);

  // ─── Nav ─────────────────────────────────────────────────────────────────

  const navItems: { id: Section; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "overview",     label: "Overview",     icon: LayoutDashboard },
    { id: "packages",     label: "Packages",     icon: Package,  count: packages.length },
    { id: "destinations", label: "Destinations", icon: MapPin,   count: destinations.length },
    { id: "categories",   label: "Categories",   icon: Tag,      count: categories.length },
    { id: "bookings",     label: "Bookings",     icon: BookOpen, count: bookings.length },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">

      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 bg-card border-r border-border shrink-0">
        <div className="p-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
                <path d="M4 26 L11 13 L16 21 L21.5 10 L28 26Z" fill="white" fillOpacity="0.95"/>
                <circle cx="25" cy="8" r="3" fill="white" fillOpacity="0.85"/>
              </svg>
            </div>
            <span className="font-display font-bold text-foreground">YatraSathi</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1 font-body">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ id, label, icon: Icon, count }) => (
            <button key={id} onClick={() => setSection(id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                section === id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
              <span className="flex items-center gap-2.5"><Icon className="w-4 h-4" />{label}</span>
              {count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${section === id ? "bg-white/20" : "bg-muted text-muted-foreground"}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Link to="/"><Button variant="outline" size="sm" className="w-full gap-1.5"><ExternalLink className="w-3.5 h-3.5" />View Site</Button></Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-foreground capitalize">
            {navItems.find(n => n.id === section)?.label}
          </h1>
          <div className="flex items-center gap-2">
            {/* Mobile nav */}
            <div className="flex lg:hidden gap-1">
              {navItems.map(({ id, icon: Icon }) => (
                <button key={id} onClick={() => setSection(id)}
                  className={`p-2 rounded-lg transition-colors ${section === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-32 text-muted-foreground">Loading…</div>
          ) : (

            <>
              {/* ── Overview ── */}
              {section === "overview" && (
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { icon: Package,  label: "Active Packages", value: activePackages.length,                           color: "from-blue-500 to-indigo-500" },
                      { icon: Calendar, label: "Total Bookings",  value: bookings.length,                                 color: "from-green-500 to-teal-500" },
                      { icon: Users,    label: "Customers",       value: new Set(bookings.map(b => b.user_id)).size,       color: "from-purple-500 to-pink-500" },
                      { icon: BarChart3,label: "Revenue",         value: `₹${revenue.toLocaleString()}`,                  color: "from-orange-500 to-red-500" },
                    ].map((s) => (
                      <Card key={s.label} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className={`h-1.5 bg-gradient-to-r ${s.color}`} />
                          <div className="p-5 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                              <s.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-foreground font-display">{s.value}</p>
                              <p className="text-sm text-muted-foreground">{s.label}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-3 gap-4">
                    <Card className="lg:col-span-2">
                      <CardHeader className="pb-3"><CardTitle className="font-display text-base">Recent Bookings</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        {bookings.slice(0, 5).map(b => (
                          <div key={b.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                            <div>
                              <p className="text-sm font-medium">{b.package_title ?? `Package #${b.package_id}`}</p>
                              <p className="text-xs text-muted-foreground">{b.user_name ?? `User #${b.user_id}`} · {b.travel_date}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={`text-xs border ${statusBadge(b.status)}`}>{b.status}</Badge>
                              <p className="text-xs text-primary font-semibold mt-1">₹{b.total_price.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                        {bookings.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No bookings yet.</p>}
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <Card>
                        <CardHeader className="pb-3"><CardTitle className="font-display text-base">Quick Actions</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                          <Button className="w-full justify-start gap-2" size="sm" onClick={() => { setSection("packages"); setPkgForm({ open: true }); }}>
                            <PlusCircle className="w-4 h-4" /> Add Package
                          </Button>
                          <Button variant="outline" className="w-full justify-start gap-2" size="sm" onClick={() => { setSection("destinations"); setDestForm({ open: true }); }}>
                            <PlusCircle className="w-4 h-4" /> Add Destination
                          </Button>
                          <Button variant="outline" className="w-full justify-start gap-2" size="sm" onClick={() => { setSection("categories"); setCatForm({ open: true }); }}>
                            <PlusCircle className="w-4 h-4" /> Add Category
                          </Button>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3"><CardTitle className="font-display text-base">Content Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          {[
                            { label: "Active packages",   value: activePackages.length,   color: "text-green-600" },
                            { label: "Archived packages", value: archivedPackages.length, color: "text-muted-foreground" },
                            { label: "Destinations",      value: destinations.length,     color: "text-blue-600" },
                            { label: "Categories",        value: categories.length,       color: "text-purple-600" },
                          ].map(r => (
                            <div key={r.label} className="flex justify-between">
                              <span className="text-muted-foreground">{r.label}</span>
                              <span className={`font-semibold ${r.color}`}>{r.value}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Packages ── */}
              {section === "packages" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{activePackages.length} active · {archivedPackages.length} archived</p>
                    <Button size="sm" className="gap-2" onClick={() => setPkgForm({ open: true })}>
                      <PlusCircle className="w-4 h-4" /> Add Package
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {packages.map(pkg => (
                      <Card key={pkg.id} className={pkg.is_active ? "" : "opacity-60"}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <img src={pkg.image ?? "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200"}
                              alt={pkg.title} className="w-16 h-12 rounded-lg object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground truncate">{pkg.title}</h4>
                                {!pkg.is_active && <Badge variant="outline" className="text-xs text-muted-foreground shrink-0">Archived</Badge>}
                              </div>
                              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <span className="capitalize">{pkg.country}</span>
                                <span>·</span><span>{pkg.duration}</span>
                                <span>·</span><span className="text-primary font-semibold">₹{pkg.price.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground"
                                disabled={pkgFormLoading}
                                onClick={() => openEditForm(pkg)}>
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground"
                                onClick={() => toggleArchive(pkg)}>
                                {pkg.is_active ? <Archive className="w-3.5 h-3.5" /> : <ArchiveRestore className="w-3.5 h-3.5" />}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => deletePackage(pkg.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {packages.length === 0 && <p className="text-center text-muted-foreground py-12">No packages yet. Add one above.</p>}
                  </div>
                </div>
              )}

              {/* ── Destinations ── */}
              {section === "destinations" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{destinations.length} destinations</p>
                    <Button size="sm" className="gap-2" onClick={() => setDestForm({ open: true })}>
                      <PlusCircle className="w-4 h-4" /> Add Destination
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {destinations.map(dest => (
                      <Card key={dest.id} className="overflow-hidden group">
                        <div className="relative h-32 bg-muted">
                          {dest.image_url && <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover" />}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-3">
                            <p className="font-display font-bold text-white text-lg">{dest.name}</p>
                            <p className="text-white/70 text-xs font-mono">{dest.slug}</p>
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setDestForm({ open: true, editing: dest })}
                              className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                              <Pencil className="w-3.5 h-3.5 text-foreground" />
                            </button>
                            <button onClick={() => deleteDestination(dest.slug)}
                              className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-destructive hover:text-white transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground line-clamp-2">{dest.description ?? "No description."}</p>
                        </CardContent>
                      </Card>
                    ))}
                    {destinations.length === 0 && <p className="col-span-3 text-center text-muted-foreground py-12">No destinations yet.</p>}
                  </div>
                </div>
              )}

              {/* ── Categories ── */}
              {section === "categories" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{categories.length} categories</p>
                    <Button size="sm" className="gap-2" onClick={() => setCatForm({ open: true })}>
                      <PlusCircle className="w-4 h-4" /> Add Category
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(cat => (
                      <Card key={cat.id} className="group">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                                {cat.icon ?? "🏷️"}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{cat.name}</p>
                                <p className="text-xs font-mono text-muted-foreground">{cat.slug}</p>
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setCatForm({ open: true, editing: cat })}
                                className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                              <button onClick={() => deleteCategory(cat.slug)}
                                className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-destructive/10 transition-colors">
                                <Trash2 className="w-3.5 h-3.5 text-destructive" />
                              </button>
                            </div>
                          </div>
                          {cat.description && <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{cat.description}</p>}
                        </CardContent>
                      </Card>
                    ))}
                    {categories.length === 0 && <p className="col-span-3 text-center text-muted-foreground py-12">No categories yet.</p>}
                  </div>
                </div>
              )}

              {/* ── Bookings ── */}
              {section === "bookings" && (
                <div className="space-y-3">
                  {bookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">No bookings yet.</p>
                  ) : bookings.map(b => (
                    <Card key={b.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-muted-foreground font-mono">#{b.id}</span>
                              <h4 className="font-semibold text-foreground truncate">{b.package_title ?? `Package #${b.package_id}`}</h4>
                              <Badge className={`text-xs border shrink-0 ${statusBadge(b.status)}`}>{b.status}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <span>👤 {b.user_name ?? `User #${b.user_id}`}</span>
                              <span>📅 {b.travel_date}</span>
                              <span>👥 {b.num_people} pax</span>
                              <span className="text-primary font-semibold">₹{b.total_price.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Link to={`/booking/${b.id}`}>
                              <Button variant="outline" size="sm">Details</Button>
                            </Link>
                            {b.status !== "cancelled" && (
                              <Button variant="destructive" size="sm" className="gap-1" onClick={() => cancelBooking(b.id)}>
                                <XCircle className="w-3.5 h-3.5" /> Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── Package form (full-screen overlay) ── */}
      {pkgForm.open && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <AdminPackageForm
            initial={pkgForm.editing}
            destinations={destinations}
            categories={categories}
            onSave={savePackage}
            onCancel={() => setPkgForm({ open: false })}
          />
        </div>
      )}

      <SlideOver open={destForm.open} onClose={() => setDestForm({ open: false })}
        title={destForm.editing ? "Edit Destination" : "Add New Destination"}>
        <DestinationForm
          initial={destForm.editing}
          onSave={saveDestination}
          onCancel={() => setDestForm({ open: false })}
        />
      </SlideOver>

      <SlideOver open={catForm.open} onClose={() => setCatForm({ open: false })}
        title={catForm.editing ? "Edit Category" : "Add New Category"}>
        <CategoryForm
          initial={catForm.editing}
          onSave={saveCategory}
          onCancel={() => setCatForm({ open: false })}
        />
      </SlideOver>
    </div>
  );
};

export default AdminDashboard;
