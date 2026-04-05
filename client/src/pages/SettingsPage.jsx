import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import assets from "../assets/assets";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { authUser, updateProfile, changePassword, logout, theme, toggleTheme } =
    useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("profile");

  // Profile tab state
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [selectedImg, setSelectedImg] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password tab state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      await new Promise((resolve) => {
        reader.onload = async () => {
          await updateProfile({ profilePic: reader.result, fullName: name, bio });
          resolve();
        };
      });
    }
    setProfileLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setPasswordLoading(true);
    const success = await changePassword({ currentPassword, newPassword });
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setPasswordLoading(false);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4S7.2 4.5 7.2 7.2S9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" },
    { id: "password", label: "Password", icon: "M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" },
    { id: "appearance", label: "Appearance", icon: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" },
    { id: "about", label: "About", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" },
  ];

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{
        background: "radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.08) 0%, var(--bg-primary) 60%)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl transition-all hover:scale-105"
            style={{ background: "var(--bg-glass)", border: "1px solid var(--border-color)" }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-secondary)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              Settings
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Manage your account and preferences
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar tabs */}
          <aside className="md:w-52 flex flex-row md:flex-col gap-1 flex-shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-left"
                style={{
                  background: activeTab === tab.id ? "var(--accent-glow)" : "transparent",
                  color: activeTab === tab.id ? "var(--accent-light)" : "var(--text-secondary)",
                  border: activeTab === tab.id ? "1px solid var(--border-active)" : "1px solid transparent",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d={tab.icon} />
                </svg>
                <span className="hidden md:block">{tab.label}</span>
              </button>
            ))}

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-left mt-auto"
              style={{ color: "var(--danger)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
              <span className="hidden md:block">Logout</span>
            </button>
          </aside>

          {/* Main content */}
          <main className="flex-1 glass-card p-6 animate-fadeIn">

            {/* ── Profile Tab ── */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSave} className="flex flex-col gap-5">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  Profile Information
                </h2>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative group flex-shrink-0">
                    <img
                      src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon}
                      alt="avatar"
                      className="w-20 h-20 rounded-full object-cover"
                      style={{ border: "3px solid var(--accent)", boxShadow: "0 0 16px rgba(139,92,246,0.3)" }}
                    />
                    <label
                      htmlFor="settings-avatar"
                      className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "rgba(0,0,0,0.55)" }}
                    >
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </label>
                    <input id="settings-avatar" type="file" accept=".png,.jpg,.jpeg" hidden onChange={(e) => setSelectedImg(e.target.files[0])} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {authUser?.fullName}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {authUser?.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Full Name</label>
                  <input className="input-field" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your full name" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Bio</label>
                  <textarea className="input-field resize-none" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} required placeholder="Tell others about yourself..." />
                </div>

                <button type="submit" className="btn-primary self-start flex items-center gap-2" disabled={profileLoading}>
                  {profileLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white" style={{ animation: "spin 0.7s linear infinite" }} />
                      Saving...
                    </>
                  ) : "Save Profile"}
                </button>
              </form>
            )}

            {/* ── Password Tab ── */}
            {activeTab === "password" && (
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-5">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  Change Password
                </h2>

                {passwordError && (
                  <div
                    className="px-4 py-3 rounded-xl text-sm"
                    style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "var(--danger)" }}
                  >
                    {passwordError}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Current Password</label>
                  <input className="input-field" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required placeholder="••••••••" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>New Password</label>
                  <input className="input-field" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Min. 6 characters" minLength={6} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Confirm New Password</label>
                  <input className="input-field" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" />
                </div>

                <button type="submit" className="btn-primary self-start flex items-center gap-2" disabled={passwordLoading}>
                  {passwordLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white" style={{ animation: "spin 0.7s linear infinite" }} />
                      Updating...
                    </>
                  ) : "Update Password"}
                </button>
              </form>
            )}

            {/* ── Appearance Tab ── */}
            {activeTab === "appearance" && (
              <div className="flex flex-col gap-5">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  Appearance
                </h2>
                <div
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: "var(--bg-glass)", border: "1px solid var(--border-color)" }}
                >
                  <div>
                    <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                      Dark Mode
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Switch between light and dark theme
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
                    style={{
                      background: theme === "dark"
                        ? "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
                        : "var(--border-color)",
                    }}
                  >
                    <span
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300"
                      style={{ transform: theme === "dark" ? "translateX(24px)" : "translateX(0)" }}
                    />
                  </button>
                </div>

                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Current theme: <span style={{ color: "var(--accent)" }}>{theme === "dark" ? "Dark" : "Light"}</span>
                </p>
              </div>
            )}

            {/* ── About Tab ── */}
            {activeTab === "about" && (
              <div className="flex flex-col gap-5">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  About ChatApp
                </h2>
                <div className="flex flex-col gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <div className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <span>Version</span><span style={{ color: "var(--accent)" }}>1.0.0</span>
                  </div>
                  <div className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <span>Stack</span><span style={{ color: "var(--text-primary)" }}>React + Express + MongoDB</span>
                  </div>
                  <div className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <span>Real-time</span><span style={{ color: "var(--text-primary)" }}>Socket.io</span>
                  </div>
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  A real-time chat application with end-to-end messaging, image sharing, and online presence.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
