import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  // Default to "Login" not "Sign up"
  const [currState, setCurrState] = useState("Login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    setIsLoading(true);
    await login(currState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
    setIsLoading(false);
  };

  const switchToLogin = () => {
    setCurrState("Login");
    setIsDataSubmitted(false);
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
  };

  const switchToSignup = () => {
    setCurrState("Sign up");
    setIsDataSubmitted(false);
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse at 60% 40%, rgba(139,92,246,0.12) 0%, var(--bg-primary) 65%)",
      }}
    >
      {/* Subtle decorative orbs */}
      <div
        className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed bottom-[-10%] left-[-5%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(109,40,217,0.1) 0%, transparent 70%)",
        }}
      />

      <div
        className="w-full max-w-md glass-card p-8 animate-slideUp"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Logo / Branding */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
              boxShadow: "0 4px 20px rgba(139,92,246,0.45)",
            }}
          >
            {/* Chat bubble icon */}
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            ChatApp
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {currState === "Login"
              ? "Welcome back! Sign in to continue"
              : isDataSubmitted
              ? "Just a bit more about you"
              : "Create your free account"}
          </p>
        </div>

        {/* Tab switcher */}
        <div
          className="flex rounded-xl p-1 mb-6"
          style={{ background: "var(--bg-glass)" }}
        >
          {["Login", "Sign up"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() =>
                tab === "Login" ? switchToLogin() : switchToSignup()
              }
              className="flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200"
              style={{
                background:
                  currState === tab
                    ? "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
                    : "transparent",
                color:
                  currState === tab ? "white" : "var(--text-muted)",
                boxShadow:
                  currState === tab
                    ? "0 2px 12px rgba(139,92,246,0.4)"
                    : "none",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          {/* Back arrow for signup step 2 */}
          {currState === "Sign up" && isDataSubmitted && (
            <button
              type="button"
              onClick={() => setIsDataSubmitted(false)}
              className="flex items-center gap-2 text-sm mb-1 transition-opacity hover:opacity-80"
              style={{ color: "var(--accent)" }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}

          {/* Full Name — signup step 1 */}
          {currState === "Sign up" && !isDataSubmitted && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                Full Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email + Password — both steps */}
          {!isDataSubmitted && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </>
          )}

          {/* Bio — signup step 2 */}
          {currState === "Sign up" && isDataSubmitted && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                Short Bio
              </label>
              <textarea
                className="input-field resize-none"
                rows={4}
                placeholder="Tell others a little about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                  style={{ animation: "spin 0.7s linear infinite" }}
                />
                Please wait...
              </>
            ) : currState === "Sign up" ? (
              isDataSubmitted ? "Create Account" : "Continue"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Terms note */}
        <p className="text-xs text-center mt-4" style={{ color: "var(--text-muted)" }}>
          By continuing, you agree to our{" "}
          <span style={{ color: "var(--accent)" }} className="cursor-pointer hover:underline">
            Terms of Service
          </span>{" "}
          and{" "}
          <span style={{ color: "var(--accent)" }} className="cursor-pointer hover:underline">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
