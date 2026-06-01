"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/signup`,
        {
          ...formData,
        },
      );

      if (res.status === 201) {
        alert("Registration successful! Please login.");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        router.push(redirect ? `/signin?redirect=${redirect}` : "/signin");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <div
            onClick={() => router.push("/")}
            className="flex items-center justify-center cursor-pointer mb-4">
            {/* <Image
            src=""
            alt="Logo"
            width={160}
            height={50}
            className="w-[120px] sm:w-[140px] md:w-[160px] h-auto"
            priority
          /> */}
            <h1 className="text-2xl font-bold text-red-600">
              Shree Baidyanath
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create Account
          </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-1">
                Name
              </label>
              <input
                name="name"
                id="name"
                placeholder="Enter your name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer">
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>
            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer">
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>
            {/* Button */}
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 cursor-pointer disabled:bg-blue-300">
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                router.push(
                  redirect ? `/signin?redirect=${redirect}` : "/signin",
                );
              }}>
              Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="text-gray-500">Loading...</div></div>}>
      <RegisterForm />
    </Suspense>
  );
}
