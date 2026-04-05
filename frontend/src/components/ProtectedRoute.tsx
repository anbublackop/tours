import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

/**
 * Wraps a route so that:
 * - Unauthenticated users are redirected to /login (with `?next=` for post-login redirect)
 * - Non-admin users attempting an admin-only route are redirected to /dashboard
 */
const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
