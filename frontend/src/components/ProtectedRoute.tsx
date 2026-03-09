import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "@/services/auth";
import { useState, useEffect } from "react";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

// ✅ FIX: Prevent rapid state changes that can cause flickering
let isRedirecting = false;

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  
  // Use useEffect to ensure we're in a valid state before rendering
  useEffect(() => {
    // Small delay to prevent rapid re-renders
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  // Prevent rendering while state is stabilizing
  if (!isReady) {
    return null;
  }

  const user = authService.getCurrentUser();
  const token = localStorage.getItem("token");

  // ✅ 🔐 Not authenticated - redirect to /auth
  if (!user || !token) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  const userRole = user.role?.toLowerCase();

  // ✅ 🔒 Role-based protection
  if (
    allowedRoles &&
    (!userRole || !allowedRoles.map(r => r.toLowerCase()).includes(userRole))
  ) {
    // Prevent multiple rapid redirects
    if (isRedirecting) {
      return null;
    }
    
    isRedirecting = true;
    
    // Redirect to correct home based on role
    setTimeout(() => {
      isRedirecting = false;
    }, 100);
    
    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (userRole === "farmer") {
      return <Navigate to="/farmer" replace />;
    } else if (userRole === "pilot") {
      return <Navigate to="/pilot" replace />;
    } else if (userRole === "agronomist") {
      return <Navigate to="/agronomist" replace />;
    } else {
      return <Navigate to="/auth" replace />;
    }
  }

  return <Outlet />;
}
