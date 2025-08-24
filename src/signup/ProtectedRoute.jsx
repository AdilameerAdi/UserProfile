import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // adjust path if needed

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Minimal loading state - removed the heavy div wrapper
  if (isLoading) {
    return null; // Just show nothing while loading for faster initial render
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
