import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";

interface EnquiryModalProps {
  trigger?: React.ReactNode;
  packageName?: string;
}

const EnquiryModal = ({ trigger, packageName }: EnquiryModalProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/enquiries", { ...form, package_name: packageName });
      toast.success(t("enquiry.successToast"));
      setOpen(false);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("enquiry.failedDefault"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <MessageCircle className="w-4 h-4" /> {t("enquiry.enquireNow")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {packageName ? `${t("enquiry.enquiryFor")} ${packageName}` : t("enquiry.title")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="eq-name">{t("enquiry.fullName")}</Label>
            <Input id="eq-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="eq-email">{t("enquiry.email")}</Label>
            <Input id="eq-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="eq-phone">{t("enquiry.phone")}</Label>
            <Input id="eq-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="eq-message">{t("enquiry.message")}</Label>
            <Textarea id="eq-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t("enquiry.messagePlaceholder")} rows={4} required />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t("enquiry.submitting") : t("enquiry.submit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnquiryModal;
