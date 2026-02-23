import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Enquiry = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-16 bg-background flex-1">
        <div className="container max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-foreground mb-3">Get in Touch</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">Have a question or need a customized package? We'd love to hear from you!</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                      <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><Label>Phone</Label><Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
                      <div><Label>Subject</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /></div>
                    </div>
                    <div><Label>Message</Label><Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} placeholder="Tell us about your travel plans, special requirements, or questions..." required /></div>
                    <Button type="submit" size="lg" className="w-full font-semibold">Send Enquiry</Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {[
                { icon: Phone, label: "Call Us", value: "+91 98765 43210" },
                { icon: Mail, label: "Email Us", value: "info@yatrasathi.com" },
                { icon: MapPin, label: "Visit Us", value: "42, Travel Hub, Connaught Place, New Delhi" },
              ].map((item) => (
                <Card key={item.label}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <item.icon className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
                <Button variant="outline" className="w-full gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp Us</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Enquiry;
