"use client";
import { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { FaMapMarkerAlt, FaPhone, FaClock } from "react-icons/fa";
import axios from "axios";

export default function Consult() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    problem: "",
  });

  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/add-consult`, form);
      if (res.data.success) {
        alert("Consult request submitted successfully!");
        setForm({
          name: "",
          email: "",
          mobile: "",
          problem: "",
        });
      } else {
        alert("Failed to submit request: " + (res.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit request: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-green-50 p-6">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
          Consult by Ayurvedic Expert
        </h1>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Doctor Info */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <img
              src="/doctor.png"
              alt="Doctor"
              // style={{ width: "200px", height: "200px" }}
              className="w-40 h-40 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-center">
              Vaidya Krishna Mohan Giri (M.D.)
            </h2>
            <p className="text-center text-gray-600 mb-4">
              Shree Baidyanath Ayurvedic Clinic
            </p>

            <div className="text-sm text-gray-700 space-y-3 mt-6 border-t pt-4 border-gray-100">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-green-600 mt-1 flex-shrink-0" />
                <p>
                  <strong>Address:</strong> Sundarpur, Newada- B.H.U, BLW Road,
                  Varanasi, Uttar Pradesh 221005
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-green-600 flex-shrink-0" />
                <p>
                  <strong>Phone:</strong> +91 94735 21779, +91 93363 25001
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-green-600 flex-shrink-0" />
                <p>
                  <strong>Timing:</strong> 10 AM - 6 PM
                </p>
              </div>
            </div>
          </div>

          {/* Consultation Form */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-green-700">
              Book Your Consultation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
              />

              <input
                type="tel"
                name="mobile"
                placeholder="Phone Number"
                value={form.mobile}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
              />

              <textarea
                name="problem"
                placeholder="Describe your problem"
                value={form.problem}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 cursor-pointer"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
