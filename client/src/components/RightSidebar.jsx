import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const navigate = useNavigate();
  const [msgImages, setMsgImages] = useState([]);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div
      className="h-full flex flex-col max-md:hidden overflow-y-auto animate-slideRight"
      style={{
        background: "var(--bg-secondary)",
        borderLeft: "1px solid var(--border-color)",
      }}
    >
      {/* ─── Profile section ─────────────────────── */}
      <div className="flex flex-col items-center gap-3 p-6 text-center">
        <div className="relative">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt={selectedUser?.fullName}
            className="w-20 h-20 rounded-full object-cover"
            style={{
              border: "3px solid var(--accent)",
              boxShadow: "0 0 20px rgba(139,92,246,0.35)",
            }}
          />
          {isOnline && (
            <span
              className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full"
              style={{
                background: "var(--success)",
                border: "2px solid var(--bg-secondary)",
                boxShadow: "0 0 6px var(--success)",
              }}
            />
          )}
        </div>

        <div>
          <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
            {selectedUser?.fullName}
          </h2>
          <p
            className="text-xs mt-0.5"
            style={{ color: isOnline ? "var(--success)" : "var(--text-muted)" }}
          >
            {isOnline ? "● Online" : "○ Offline"}
          </p>
        </div>

        {selectedUser?.bio && (
          <p
            className="text-xs leading-relaxed px-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {selectedUser.bio}
          </p>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border-color)", margin: "0 16px" }} />

      {/* ─── Shared Media ────────────────────────── */}
      <div className="flex-1 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
          Shared Media
        </p>

        {msgImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 opacity-60">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" style={{ color: "var(--text-muted)" }}>
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
              <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
            </svg>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              No shared images yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {msgImages.map((url, i) => (
              <div
                key={i}
                onClick={() => setLightboxImg(url)}
                className="aspect-square rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
                style={{ border: "1px solid var(--border-color)" }}
              >
                <img
                  src={url}
                  alt={`shared-${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Actions ─────────────────────────────── */}
      {/* <div
        className="p-4 flex flex-col gap-2 flex-shrink-0"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        <button
          onClick={() => navigate("/profile")}
          className="w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style={{
            background: "var(--bg-glass)",
            border: "1px solid var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          My Profile
        </button>
        <button
          onClick={logout}
          className="w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all"
          style={{
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.25)",
            color: "var(--danger)",
          }}
        >
          Logout
        </button>
      </div> */}

      {/* ─── Lightbox overlay ────────────────────── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setLightboxImg(null)}
        >
          <img
            src={lightboxImg}
            alt="full"
            className="max-w-full max-h-full rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 p-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.15)" }}
            onClick={() => setLightboxImg(null)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
