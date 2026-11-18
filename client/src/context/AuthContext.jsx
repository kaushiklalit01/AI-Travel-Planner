import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("itinera_token") || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check existing token on mount
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        if (res.data?.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.warn("Session check failed, clearing token:", err);
        localStorage.removeItem("itinera_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data?.success) {
        const { user: userData, token: jwtToken } = res.data;
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem("itinera_token", jwtToken);
        toast.success(`Welcome back, ${userData.name || "Traveler"}!`);
        setIsAuthModalOpen(false);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Check your credentials.";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (email, password, name) => {
    try {
      const res = await api.post("/auth/register", { email, password, name });
      if (res.data?.success) {
        const { user: userData, token: jwtToken } = res.data;
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem("itinera_token", jwtToken);
        toast.success("Account created successfully!");
        setIsAuthModalOpen(false);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem("itinera_token");
    setToken(null);
    setUser(null);
    toast.success("Signed out successfully.");
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
