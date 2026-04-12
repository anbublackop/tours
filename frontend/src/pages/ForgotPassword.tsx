import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { api } from "@/lib/api";

const ForgotPassword = () => {
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch {
      // Show generic success even on errors to prevent user enumeration
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 bg-background">
        <Card className="w-full max-w-md mx-4">
          {submitted ? (
            <>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <CardTitle className="font-display text-2xl">Check Your Email</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  If <span className="text-foreground font-medium">{email}</span> is registered,
                  you'll receive a reset link shortly.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground text-center">
                  Didn't get the email? Check your spam folder or try again.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => { setSubmitted(false); setEmail(""); }}
                >
                  Try a different email
                </Button>
                <Link to="/login" className="block text-center text-sm text-primary hover:underline">
                  Back to login
                </Link>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <CardTitle className="font-display text-2xl">Forgot Password?</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your email and we'll send you a reset link.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Email address</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full font-semibold" disabled={loading}>
                    {loading ? "Sending…" : "Send Reset Link"}
                  </Button>
                </form>
                <Link
                  to="/login"
                  className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to login
                </Link>
              </CardContent>
            </>
          )}
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
