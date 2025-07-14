import React, { useState } from "react";

export default function Login({ onSwitch, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = email.split("@")[0] || "User";
    onSuccess(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-1">Password</label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <button
            onClick={onSwitch}
            className="text-purple-600 font-medium hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
