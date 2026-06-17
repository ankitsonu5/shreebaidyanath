"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { navigateTo } from "../../lib/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/forgot-password`,
        { email },
      );
      if (res.data.success) {
        setMessage("Reset link sent! Please check your email.");
        setEmail("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <div
            onClick={() => navigateTo(router, "/")}
            className="flex items-center justify-center cursor-pointer mb-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={240}
              height={60}
              className="w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] h-auto rounded-lg shadow-sm"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Forgot Password
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Enter your email to receive reset link
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
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 cursor-pointer disabled:bg-blue-300`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <p
            onClick={() => navigateTo(router, "/signin")}
            className="text-center text-sm text-gray-500 mt-5 cursor-pointer"
          >
            <span className="text-blue-600 cursor-pointer hover:underline">
              Back to Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
