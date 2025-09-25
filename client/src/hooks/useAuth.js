import { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      setAuthError(null);
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });

      if (response.data.user) {
        setUser(response.data.user);
        return response.data.user;
      } else {
        throw new Error("No user data received");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthError("Session expired. Please log in again.");
      setUser(null);
      navigate("/user");
      return null;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
      setAuthError(null);
      navigate("/user");
    } catch (error) {
      console.error("Logout failed:", error);
      setAuthError("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return { user, loading, authError, checkAuth, logout };
};

export default useAuth;
