/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ProtectedRoute.tsx
import { useUser } from "../hooks/useUser";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  requiredRole,
}: {
  requiredRole?: "ADMIN" | "USER";
}) => {
  const { userProfile, isLoading } = useUser();
  if (!userProfile && !isLoading) return <Navigate to="/auth" replace />;

  if (requiredRole && userProfile && userProfile.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return null;
};

export default ProtectedRoute;
