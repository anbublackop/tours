import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { api } from "@/lib/api";

const ResetPassword = () => {
  const [searchParams]      = useSearchParams();
  const navigate            = useNavigate();
  const token               = searchParams.get("token") ?? "";

  const [form, setForm]         = useState({ password: "", confirm: "" });
  const [showPw, setShowPw]     = useState(false);
  const [showCf, setShowCf]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const mismatch   = form.confirm.length > 0 && form.password !== form.confirm;
  const tooShort   = form.password.length > 0 && form.password.length < 8;
  const canSubmit  = form.password.length >= 8 && form.password === form.confirm && !!token;

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-12 bg-background">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-full bg-destructive/15 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-destructive" />
                </div>
              </div>
              <CardTitle className="font-display text-2xl">Invalid Link</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                This reset link is missing or malformed.
              </p>
            </CardHeader>
            <CardContent>
              <Link to="/forgot-password">
                <Button className="w-full">Request a new reset link</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, new_password: form.password });
      setSuccess(true);
      toast.success("Password reset! Redirecting to login…");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 bg-background">
        <Card className="w-full max-w-md mx-4">
          {success ? (
            <>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <CardTitle className="font-display text-2xl">Password Reset!</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Your password has been updated. Redirecting to login…
                </p>
              </CardHeader>
              <CardContent>
                <Link to="/login">
                  <Button className="w-full">Go to Login</Button>
                </Link>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                    <KeyRound className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <CardTitle className="font-display text-2xl">Set New Password</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a strong password (min. 8 characters).
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>New Password</Label>
                    <div className="relative">
                      <Input
                        type={showPw ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Min. 8 characters"
                        required
                        className={tooShort ? "border-destructive" : ""}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {tooShort && (
                      <p className="text-xs text-destructive mt-1">Must be at least 8 characters.</p>
                    )}
                  </div>

                  <div>
                    <Label>Confirm Password</Label>
                    <div className="relative">
                      <Input
                        type={showCf ? "text" : "password"}
                        value={form.confirm}
                        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                        placeholder="Repeat password"
                        required
                        className={mismatch ? "border-destructive" : ""}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCf(!showCf)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {mismatch && (
                      <p className="text-xs text-destructive mt-1">Passwords do not match.</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full font-semibold" disabled={loading || !canSubmit}>
                    {loading ? "Resetting…" : "Reset Password"}
                  </Button>
                </form>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Link expired?{" "}
                  <Link to="/forgot-password" className="text-primary hover:underline">
                    Request a new one
                  </Link>
                </p>
              </CardContent>
            </>
          )}
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
