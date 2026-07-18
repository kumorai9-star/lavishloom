import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useStore();
  const location = useLocation();

  if (!user) {
    // Remember where they were headed so Login can send them back after signing in.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}