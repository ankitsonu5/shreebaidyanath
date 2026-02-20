"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Signin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === "admin") {
      router.push("/admindashboard");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/signin`,
        {
          ...formData,
        },
      );

      if (response.data.success) {
        const token = response.data.token;
        const role = response.data.role;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        document.cookie = `token=${token}; path=/`;
        document.cookie = `role=${role}; path=/`;

        // Check for guest cart and merge
        const guestCart = JSON.parse(
          localStorage.getItem("guestCart") || '{"items":[]}',
        );
        if (guestCart.items.length > 0) {
          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/merge-cart`,
              { items: guestCart.items },
              { headers: { Authorization: token } },
            );
            localStorage.removeItem("guestCart");
          } catch (mergeError) {
            console.log("Cart merge error:", mergeError);
          }
        }

        if (role === "admin") {
          router.push("/admindashboard");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Sign In
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <a
                href="/forgotpassword"
                className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 cursor-pointer">
              Sign In
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-blue-600 cursor-pointer">
              Register
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
