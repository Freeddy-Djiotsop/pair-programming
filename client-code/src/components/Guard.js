import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Auth";

export const UserGuard = ({ children }) => {
  const location = useLocation();
  const auth = useAuth();

  return auth.isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ path: location.pathname }} replace={true} />
  );
};

export const ProtectedRoutesGuard = ({ children }) => {
  const auth = useAuth();
  return auth.isAuthenticated ? <Navigate to="/" replace={true} /> : children;
};
