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
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";

const Enquiry = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/enquiries", form);
      toast.success(t("enquiryPage.successToast"));
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("enquiryPage.failedDefault"));
    } finally {
      setSubmitting(false);
    }
  };

  const contactItems = [
    { icon: Phone,  label: t("enquiryPage.callUs"),  value: "+91 98765 43210" },
    { icon: Mail,   label: t("enquiryPage.emailUs"), value: "info@yatrasathi.com" },
    { icon: MapPin, label: t("enquiryPage.visitUs"), value: "42, Travel Hub, Connaught Place, New Delhi" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-16 bg-background flex-1">
        <div className="container max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-foreground mb-3">{t("enquiryPage.title")}</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">{t("enquiryPage.subtitle")}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><Label>{t("enquiryPage.fullName")}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                      <div><Label>{t("enquiryPage.email")}</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><Label>{t("enquiryPage.phone")}</Label><Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
                      <div><Label>{t("enquiryPage.subject")}</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /></div>
                    </div>
                    <div>
                      <Label>{t("enquiryPage.message")}</Label>
                      <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} placeholder={t("enquiryPage.messagePlaceholder")} required />
                    </div>
                    <Button type="submit" size="lg" className="w-full font-semibold" disabled={submitting}>
                      {submitting ? t("enquiryPage.sending") : t("enquiryPage.send")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {contactItems.map((item) => (
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
                <Button variant="outline" className="w-full gap-2">
                  <MessageCircle className="w-4 h-4" /> {t("enquiryPage.whatsapp")}
                </Button>
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
