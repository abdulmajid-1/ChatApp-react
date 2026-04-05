import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import assets from "../assets/assets";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
    setIsLoading(false);
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse at 40% 60%, rgba(139,92,246,0.1) 0%, var(--bg-primary) 60%)",
      }}
    >
      <div className="w-full max-w-lg glass-card p-8 animate-slideUp">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl transition-all hover:scale-105"
            style={{ background: "var(--bg-glass)", border: "1px solid var(--border-color)" }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-secondary)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              Edit Profile
            </h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Update your personal information
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="relative group">
              <img
                src={
                  selectedImg
                    ? URL.createObjectURL(selectedImg)
                    : authUser?.profilePic || assets.avatar_icon
                }
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover"
                style={{
                  border: "3px solid var(--accent)",
                  boxShadow: "0 0 20px rgba(139,92,246,0.4)",
                }}
              />
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.55)" }}
              >
                <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                  <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept=".png,.jpg,.jpeg"
                hidden
                onChange={(e) => setSelectedImg(e.target.files[0])}
              />
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Click photo to change
            </p>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              Full Name
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              Bio
            </label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Tell others about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          </div>

          {/* Save */}
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <span
                  className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                  style={{ animation: "spin 0.7s linear infinite" }}
                />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
