import React from "react";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-4"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Animated logo / spinner ring */}
      <div className="relative flex items-center justify-center">
        <div className="spinner" />
        <div
          className="absolute w-5 h-5 rounded-full"
          style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" }}
        />
      </div>
      <p
        className="text-sm font-medium animate-pulse"
        style={{ color: "var(--text-secondary)" }}
      >
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
