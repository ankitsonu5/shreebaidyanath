"use client";

import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Forgot Password
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Enter your email to receive reset link
          </p>
          <form className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 cursor-pointer">
              Send Reset Link
            </button>
          </form>
          {/* Back to login */}
          <p
            onClick={() => router.push("/signin")}
            className="text-center text-sm text-gray-500 mt-5 cursor-pointer">
            <span className="text-blue-600 cursor-pointer hover:underline">
              Back to Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
