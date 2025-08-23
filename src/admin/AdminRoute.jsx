import { Navigate } from "react-router-dom";
import { useAuth } from "../signup/AuthContext";

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}