import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const USERS_PER_PAGE = 8;

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers, authUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      await getUsers();
      setIsLoading(false);
    };
    fetchUsers();
  }, [onlineUsers]);

  // Filter by search & online toggle
  const filteredUsers = (users || []).filter((user) => {
    const matchesSearch = searchInput
      ? user.fullName.toLowerCase().includes(searchInput.toLowerCase())
      : true;
    const matchesOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    return matchesSearch && matchesOnline;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput, showOnlineOnly]);

  return (
    <div
      className={`h-full flex flex-col ${selectedUser ? "max-md:hidden" : ""}`}
      style={{
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      {/* ─── Header ─────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border-color)" }}>
        {/* Logo + name */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" }}
          >
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
          <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
            ChatApp
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate("/settings")}
            title="Settings"
            className="p-2 rounded-xl transition-all hover:scale-105"
            style={{ background: "var(--bg-glass)", border: "1px solid var(--border-color)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--text-secondary)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Profile dropdown */}
          <div className="relative group">
            <button
              className="p-1 rounded-xl transition-all"
              title={authUser?.fullName}
            >
              <img
                src={authUser?.profilePic || assets.avatar_icon}
                alt="me"
                className="w-7 h-7 rounded-full object-cover"
                style={{ border: "2px solid var(--accent)" }}
              />
            </button>
            <div
              className="absolute top-full right-0 mt-1 w-44 rounded-xl py-2 z-30 hidden group-hover:block animate-fadeIn"
              style={{
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <button
                onClick={() => navigate("/profile")}
                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-white/5"
                style={{ color: "var(--text-secondary)" }}
              >
                Edit Profile
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-white/5"
                style={{ color: "var(--text-secondary)" }}
              >
                Settings
              </button>
              <div style={{ height: "1px", background: "var(--border-color)", margin: "4px 0" }} />
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-white/5"
                style={{ color: "var(--danger)" }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Search ──────────────────────────────── */}
      <div className="px-4 py-3 flex-shrink-0">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: "var(--bg-glass)", border: "1px solid var(--border-color)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search contacts..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--text-primary)" }}
          />
          {searchInput && (
            <button onClick={() => setSearchInput("")} style={{ color: "var(--text-muted)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          )}
        </div>

        {/* Online filter toggle */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {filteredUsers.length} contact{filteredUsers.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={() => setShowOnlineOnly((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: showOnlineOnly ? "var(--success)" : "var(--text-muted)" }}
          >
            <span className="online-dot w-2 h-2" style={{ background: showOnlineOnly ? "var(--success)" : "var(--text-muted)", boxShadow: "none" }} />
            Online only
          </button>
        </div>
      </div>

      {/* ─── User List ───────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {isLoading ? (
          // Skeleton loaders
          <div className="flex flex-col gap-1 px-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="skeleton h-3 w-3/4 rounded" />
                  <div className="skeleton h-2.5 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedUsers.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-muted)" }}>
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {searchInput ? "No contacts found" : "No contacts yet"}
            </p>
          </div>
        ) : (
          paginatedUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
              }}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all relative"
              style={{
                background:
                  selectedUser?._id === user._id
                    ? "var(--accent-glow)"
                    : "transparent",
                border:
                  selectedUser?._id === user._id
                    ? "1px solid var(--border-active)"
                    : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (selectedUser?._id !== user._id)
                  e.currentTarget.style.background = "var(--bg-glass)";
              }}
              onMouseLeave={(e) => {
                if (selectedUser?._id !== user._id)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Avatar with online dot */}
              <div className="relative flex-shrink-0">
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
                    style={{
                      background: "var(--success)",
                      border: "2px solid var(--bg-secondary)",
                    }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.fullName}
                </p>
                <p
                  className="text-xs truncate"
                  style={{
                    color: onlineUsers.includes(user._id)
                      ? "var(--success)"
                      : "var(--text-muted)",
                  }}
                >
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </p>
              </div>

              {unseenMessages[user._id] > 0 && (
                <span
                  className="flex-shrink-0 w-5 h-5 text-xs font-bold flex items-center justify-center rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
                    color: "white",
                  }}
                >
                  {unseenMessages[user._id] > 9 ? "9+" : unseenMessages[user._id]}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* ─── Pagination ──────────────────────────── */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderTop: "1px solid var(--border-color)" }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: "var(--bg-glass)",
              border: "1px solid var(--border-color)",
              color: currentPage === 1 ? "var(--text-muted)" : "var(--text-secondary)",
              opacity: currentPage === 1 ? 0.4 : 1,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>

          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: "var(--bg-glass)",
              border: "1px solid var(--border-color)",
              color: currentPage === totalPages ? "var(--text-muted)" : "var(--text-secondary)",
              opacity: currentPage === totalPages ? 0.4 : 1,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
