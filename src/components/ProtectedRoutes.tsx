import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import { toast } from "sonner";
import { useEffect } from "react";

interface ProtectedRoutesProps {
  allowedRoles?: string[];
}

export default function ProtectedRoutes({ allowedRoles }: ProtectedRoutesProps) {
  const { isAuthenticated, user, isInitializing } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role) && user.role !== "SUPER_ADMIN") {
      toast.error("You do not have permission to access this page.");
    }
  }, [isAuthenticated, allowedRoles, user]);

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (allowedRoles && user && !allowedRoles.includes(user.role) && user.role !== "SUPER_ADMIN") {
    return <Navigate to="/attendance" replace />;
  }

  return <Outlet />;
}
