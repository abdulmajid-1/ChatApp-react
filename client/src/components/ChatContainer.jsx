import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utlis";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setIsSending(true);
    await sendMessage({ text: input.trim() });
    setInput("");
    setIsSending(false);
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      setIsSending(true);
      await sendMessage({ image: reader.result });
      e.target.value = "";
      setIsSending(false);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      const fetch = async () => {
        setIsLoading(true);
        await getMessages(selectedUser._id);
        setIsLoading(false);
      };
      fetch();
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ── No user selected ────────────────────────────────────────
  if (!selectedUser) {
    return (
      <div
        className="h-full flex-col items-center justify-center gap-4 max-md:hidden flex"
        style={{ background: "var(--bg-primary)" }}
      >
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
            boxShadow: "0 8px 32px rgba(139,92,246,0.4)",
          }}
        >
          <svg width="36" height="36" fill="white" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Start a conversation
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Select a contact from the left to chat
          </p>
        </div>
      </div>
    );
  }

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div
      className="h-full flex flex-col overflow-hidden animate-fadeIn"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* ─── Header ─────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        {/* Mobile back button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="md:hidden p-1.5 rounded-lg transition-all"
          style={{ background: "var(--bg-glass)" }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-secondary)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="relative flex-shrink-0">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt={selectedUser?.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          {isOnline && (
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--success)", border: "2px solid var(--bg-secondary)" }}
            />
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {selectedUser?.fullName}
          </p>
          <p className="text-xs" style={{ color: isOnline ? "var(--success)" : "var(--text-muted)" }}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* ─── Messages Area ───────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {isLoading ? (
          // Loading skeleton
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${i % 2 === 0 ? "justify-end" : ""}`}
              >
                {i % 2 !== 0 && <div className="skeleton w-7 h-7 rounded-full flex-shrink-0" />}
                <div className={`skeleton h-10 rounded-2xl ${i % 2 === 0 ? "w-40" : "w-52"}`} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-60">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" style={{ color: "var(--text-muted)" }}>
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
              No messages yet.
              <br />
              Say hello to {selectedUser?.fullName?.split(" ")[0]}!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMine = msg.senderId === authUser._id;
            return (
              <div
                key={index}
                className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"} animate-slideUp`}
                style={{ animationDelay: `${Math.min(index * 0.03, 0.3)}s` }}
              >
                {/* Receiver avatar */}
                {!isMine && (
                  <img
                    src={selectedUser?.profilePic || assets.avatar_icon}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                  />
                )}

                <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[70%]`}>
                  {msg.image ? (
                    <img
                      src={msg.image}
                      alt="shared"
                      className="max-w-[220px] rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(msg.image)}
                    />
                  ) : (
                    <p
                      className={`px-4 py-2.5 text-sm leading-relaxed break-words ${isMine ? "bubble-sent" : "bubble-received"}`}
                    >
                      {msg.text}
                    </p>
                  )}
                  <span className="text-[10px] mt-1 px-1" style={{ color: "var(--text-muted)" }}>
                    {formatMessageTime(msg.createdAt)}
                  </span>
                </div>

                {/* Sender avatar */}
                {isMine && (
                  <img
                    src={authUser?.profilePic || assets.avatar_icon}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={scrollEnd} />
      </div>

      {/* ─── Input Area ─────────────────────────── */}
      <div
        className="px-4 py-3 flex-shrink-0"
        style={{
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div
            className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-full"
            style={{
              background: "var(--bg-glass)",
              border: "1px solid var(--border-color)",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage(e)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "var(--text-primary)" }}
              disabled={isSending}
            />
            {/* Image upload */}
            <label htmlFor="chat-image" className="flex-shrink-0 cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--text-secondary)" }}>
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </label>
            <input id="chat-image" type="file" accept="image/png,image/jpeg" hidden onChange={handleSendImage} />
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
            style={{
              background:
                input.trim() && !isSending
                  ? "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
                  : "var(--bg-glass)",
              border: "1px solid var(--border-color)",
              boxShadow: input.trim() ? "0 4px 12px rgba(139,92,246,0.4)" : "none",
              opacity: !input.trim() ? 0.5 : 1,
            }}
          >
            {isSending ? (
              <span
                className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white inline-block"
                style={{ animation: "spin 0.7s linear infinite" }}
              />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;
