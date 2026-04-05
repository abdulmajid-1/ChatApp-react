import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const App = () => {
  const { authUser, isCheckingAuth } = useContext(AuthContext);

  if (isCheckingAuth && !authUser) {
    return <LoadingSpinner message="Checking session..." />;
  }

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: "var(--bg-tertiary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            fontSize: "0.875rem",
          },
          success: {
            iconTheme: { primary: "#8b5cf6", secondary: "white" },
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
