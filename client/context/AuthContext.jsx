import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  // Loading state while we validate the stored token on startup
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  // Dark mode
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Apply theme class to <html>
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Validate stored token on every app startup  ← THIS was missing before
  const checkAuth = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setIsCheckingAuth(false);
      return;
    }
    try {
      axios.defaults.headers.common["token"] = storedToken;
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      } else {
        // Token invalid / expired – clear it
        localStorage.removeItem("token");
        setToken(null);
        axios.defaults.headers.common["token"] = null;
      }
    } catch (error) {
      console.error("Auth check failed:", error.message);
      localStorage.removeItem("token");
      setToken(null);
      axios.defaults.headers.common["token"] = null;
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []); // Run once on mount

  // Login & signup
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  // Update profile
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Change password
  const changePassword = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/change-password", body);
      if (data.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  // Connect socket
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
    changePassword,
    isCheckingAuth,
    theme,
    toggleTheme,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
