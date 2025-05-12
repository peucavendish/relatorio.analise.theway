import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);


  useEffect(() => {
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
}
