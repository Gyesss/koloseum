import { useEffect, useRef, useState } from "react";
import AuthContext from "./AuthContext";
import { login as apiLogin, register as apiRegister, getMe } from "../api/auth";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchProfile = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await getMe();
        setUser(data.user);
      } catch (error) {
        console.error("Fetch profile failed:", error);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = async (credentials) => {
    const data = await apiLogin(credentials);

    localStorage.setItem("token", data.token);
    setToken(data.token);

    const profile = await getMe();
    setUser(profile.user);
  };

  const register = async (form) => {
    await apiRegister(form);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
