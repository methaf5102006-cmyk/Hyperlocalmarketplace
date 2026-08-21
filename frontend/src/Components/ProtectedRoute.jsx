import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ SUPER SAFE ROLE CLEANING
  const role = String(user.role || "").toLowerCase().trim();

  const allowed = allowedRoles.map((r) =>
    String(r).toLowerCase().trim()
  );

  console.log("ROLE:", role);
  console.log("ALLOWED:", allowed);

  // ✅ FIX: direct safe comparison
  const isAllowed = allowed.some((r) => r === role);

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">
          Access Denied
        </h1>

        <p className="mt-2 text-gray-600">
          Role: {role}
        </p>

        <p className="text-gray-400 text-sm">
          Allowed: {allowed.join(", ")}
        </p>

        <button
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-black text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;