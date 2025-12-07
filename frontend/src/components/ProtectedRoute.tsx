import { Navigate } from "react-router-dom";
import api from "../services/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component
 * Checks if user is authenticated (has a valid token)
 * Redirects to login page if not authenticated
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = api.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
