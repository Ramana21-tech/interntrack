import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;