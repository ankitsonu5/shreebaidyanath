"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { navigateTo } from "../../lib/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reset-password`,
        { token, password },
      );

      if (res.data.success) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigateTo(router, "/signin");
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired reset link.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Invalid Link</h2>
        <p className="text-gray-600 mb-6">The reset link is missing or invalid.</p>
        <button
          onClick={() => navigateTo(router, "/forgotpassword")}
          className="text-blue-600 hover:underline">
          Go back to Forgot Password
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <div
        onClick={() => navigateTo(router, "/")}
        className="flex items-center justify-center cursor-pointer mb-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={160}
          height={50}
          className="w-[120px] sm:w-[140px] md:w-[160px] h-auto"
          priority
        />
      </div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Reset Password
      </h2>
      <p className="text-center text-gray-500 text-sm mb-6">
        Enter your new password below
      </p>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm font-medium">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm font-medium">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
              {showConfirmPassword ? (
                <FaEyeSlash size={18}
              />
              ) : (
                <FaEye size={18}
              />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 cursor-pointer disabled:bg-blue-300`}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
