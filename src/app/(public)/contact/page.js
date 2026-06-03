"use client";

import { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import axios from "axios";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [alertState, setAlertState] = useState({
    show: false,
    type: "success", // 'success' | 'error'
    message: "",
  });

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email.";

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim()))
      return "Please enter a valid email address.";

    if (!form.mobile.trim()) return "Please enter your phone number.";

    // Phone validation
    const phoneRegex = /^[0-9\s\-\+\(\)]{10,15}$/;
    if (!phoneRegex.test(form.mobile.trim().replace(/\s+/g, ""))) {
      return "Please enter a valid phone number (at least 10 digits).";
    }

    if (!form.subject.trim()) return "Please specify a subject.";
    if (!form.message.trim()) return "Please write your message.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      setAlertState({
        show: true,
        type: "error",
        message: errorMsg,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/add-contact`, form);
      if (res.data.success) {
        setAlertState({
          show: true,
          type: "success",
          message:
            "Thank you! Your inquiry has been submitted successfully. We will get back to you shortly.",
        });
        setForm({
          name: "",
          email: "",
          mobile: "",
          subject: "",
          message: "",
        });
      } else {
        setAlertState({
          show: true,
          type: "error",
          message:
            res.data.message || "Failed to submit request. Please try again.",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setAlertState({
        show: true,
        type: "error",
        message:
          error.response?.data?.message ||
          "Something went wrong. Please check your network connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center py-16 sm:py-24 text-white text-center px-4 overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(153, 27, 27, 0.5), rgba(120, 53, 4, 0.5), rgba(66, 32, 6, 0.1)), url('/contactbanner.jpg')",
        }}
      >
        {/* Background Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-xs sm:text-sm">
            Feel Free to Reach Out
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-2 tracking-tight text-white">
            Contact Us
          </h1>
          <p className="mt-4 text-sm sm:text-lg text-gray-200 font-medium max-w-2xl mx-auto leading-relaxed">
            Have queries about our Ayurvedic products or need help with your
            orders? Our support team is always here to guide you toward
            wellness.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-gray-50 py-12 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Info & Map */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Our Office Information
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Visit us at our main location, give us a call, or send us an
                email. We value your comments and inquiries and will answer your
                request within 24 hours.
              </p>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Address */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow duration-300">
                  <div className="bg-red-50 p-3 rounded-lg text-red-600 flex-shrink-0">
                    <FaMapMarkerAlt size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                      Location
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                      B.H.U, BLW Road, Sundarpur, Newada, Varanasi, UP 221005
                    </p>
                  </div>
                </div>

                {/* Call */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow duration-300">
                  <div className="bg-amber-50 p-3 rounded-lg text-amber-600 flex-shrink-0">
                    <FaPhoneAlt size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                      Call Us
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                      +91 94735 21779
                    </p>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                      +91 9336325001
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Mon - Sat (10am - 6pm)
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow duration-300">
                  <div className="bg-red-50 p-3 rounded-lg text-red-600 flex-shrink-0">
                    <FaEnvelope size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                      Email Us
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium break-all">
                      <a
                        href="mailto:shreebaidyanathayurvedicclinic@gmail.com"
                        className="hover:text-red-600 transition-colors"
                      >
                        shreebaidyanathayurvedicclinic@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow duration-300">
                  <div className="bg-amber-50 p-3 rounded-lg text-amber-600 flex-shrink-0">
                    <FaClock size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                      Open Hours
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                      Mon - Sat: 10:00 AM - 6:00 PM
                    </p>
                    <p className="text-[10px] text-red-500 font-semibold">
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Section */}
            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
              <iframe
                suppressHydrationWarning={true}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2851.334476621463!2d82.97334187415701!3d25.283391028206385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e327484178ab3%3A0x9dd4408046a19c0d!2sShri%20Baidyanath%20Ayurvedic%20Clinic%20%26%20Retail!5e1!3m2!1sen!2sin!4v1779346614836!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Social Media Links */}
            <div className="space-y-3">
              <h3 className="text-md font-bold text-gray-800 uppercase tracking-wider">
                Follow Our Wellness Journey
              </h3>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/people/Shree-Baidyanath-Ayurvedic-Clinic/61584680139773/"
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
                >
                  <FaFacebookF size={30} />
                </a>
                <a
                  href="https://www.instagram.com/shreebaidyanathayurveda/"
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-300"
                >
                  <FaInstagram size={30} />
                </a>
                <a
                  href="https://www.youtube.com/@ShreeBaidyanathAyurvedicClinic"
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
                >
                  <FaYoutube size={30} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Send Us a Message
                </h2>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  Fill out this form and our support executive will respond to
                  you within one working day.
                </p>
              </div>

              {/* Form Feedback Alerts */}
              {alertState.show && (
                <div
                  className={`p-4 mb-6 rounded-xl border flex items-start gap-3 animate-in fade-in duration-300 ${
                    alertState.type === "success"
                      ? "bg-green-50 text-green-800 border-green-200"
                      : "bg-red-50 text-red-800 border-red-200"
                  }`}
                >
                  <div className="flex-1 text-sm font-semibold">
                    {alertState.message}
                  </div>
                  <button
                    onClick={() =>
                      setAlertState({ ...alertState, show: false })
                    }
                    className="text-xs uppercase tracking-wide font-bold hover:underline cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1">
                    <label
                      htmlFor="name"
                      className="text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-gray-50/50 text-sm text-gray-800 font-medium transition"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label
                      htmlFor="mobile"
                      className="text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      placeholder="e.g. +91 98765 43210"
                      required
                      className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-gray-50/50 text-sm text-gray-800 font-medium transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@example.com"
                      required
                      className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-gray-50/50 text-sm text-gray-800 font-medium transition"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label
                      htmlFor="subject"
                      className="text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="e.g. Inquiry about product usage"
                      required
                      className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-gray-50/50 text-sm text-gray-800 font-medium transition"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label
                    htmlFor="message"
                    className="text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your detailed query or message here..."
                    required
                    className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-gray-50/50 text-sm text-gray-800 font-medium transition resize-y"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-700 to-amber-600 text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl hover:from-red-800 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane size={14} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Small trust banner inside form */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-xs font-bold">
              <span>🔒 Secure Form Submission</span>
              <span>•</span>
              <span>🌿 100% Authentic Products Support</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
