import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTranslation } from "react-i18next";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error(t("register.passwordMismatch"));
      return;
    }
    try {
      const BASE = import.meta.env.VITE_API_URL ?? "/api/v1";
      const response = await fetch(`${BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          is_admin: 0,
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const detail = err.detail;
        const message =
          typeof detail === "string" ? detail
          : Array.isArray(detail) ? detail.map((d: { msg?: string }) => d.msg).join(", ")
          : "Registration failed";
        toast.error(message);
        return;
      }
      toast.success(t("register.successToast"));
      navigate("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <span className="text-3xl mb-2 block">🏔️</span>
            <CardTitle className="font-display text-2xl">{t("register.createAccount")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("register.joinUs")}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>{t("register.fullName")}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label>{t("register.email")}</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
              <div><Label>{t("register.phone")}</Label><Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
              <div><Label>{t("register.password")}</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
              <div><Label>{t("register.confirmPassword")}</Label><Input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required /></div>
              <Button type="submit" className="w-full font-semibold">{t("register.createAccountBtn")}</Button>
            </form>
            <p className="text-sm text-center mt-4 text-muted-foreground">
              {t("register.alreadyHave")} <Link to="/login" className="text-primary font-medium hover:underline">{t("register.signIn")}</Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
