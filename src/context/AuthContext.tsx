import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest } from "../services/auth";
import { api } from "../services/api";
import { Navigate } from "react-router-dom";

type User = {
  name: string;
  email: string;
  session_id: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  authenticate: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const storageToken = localStorage.getItem("token");
    const storageUser = localStorage.getItem("user");
    if (storageToken && storageUser) {
      setUser(JSON.parse(storageUser));
      api.defaults.headers["Authorization"] = `Bearer ${storageToken}`;
    }
  }, []);

  const authenticate = async (email: string, password: string) => {
    const response = await loginRequest(email, password);
    if (response.user && response.access_token) {
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.access_token);
      api.defaults.headers["Authorization"] = `Bearer ${response.access_token}`;
      window.location.href = `/relatorio-cliente/?sessionId=${response.user.session_id}`;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    api.defaults.headers["Authorization"] = "";
    return <Navigate to="/" />;
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, authenticate, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  return context;
}
