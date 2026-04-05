import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success(t("login.successToast"));
      const next = searchParams.get("next");
      if (next) {
        navigate(next, { replace: true });
        return;
      }
      const raw = localStorage.getItem("yatrasathi_auth");
      const auth = raw ? JSON.parse(raw) : null;
      navigate(auth?.user?.is_admin === 1 ? "/admin" : "/dashboard", { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("login.failedDefault");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <span className="text-3xl mb-2 block">🏔️</span>
            <CardTitle className="font-display text-2xl">{t("login.welcomeBack")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("login.signInAccount")}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>{t("login.email")}</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
              <div><Label>{t("login.password")}</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
              <Button type="submit" className="w-full font-semibold" disabled={loading}>
                {loading ? t("login.signingIn") : t("login.signIn")}
              </Button>
            </form>
            <p className="text-sm text-center mt-4 text-muted-foreground">
              {t("login.noAccount")} <Link to="/register" className="text-primary font-medium hover:underline">{t("login.register")}</Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
