"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaSave, FaImage } from "react-icons/fa";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    siteName: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
  });
  
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/settings`);
      if (res.data.success && res.data.settings) {
        const s = res.data.settings;
        setForm({
          siteName: s.siteName || "",
          contactEmail: s.contactEmail || "",
          contactPhone: s.contactPhone || "",
          contactAddress: s.contactAddress || "",
          facebookUrl: s.facebookUrl || "",
          instagramUrl: s.instagramUrl || "",
          twitterUrl: s.twitterUrl || "",
          youtubeUrl: s.youtubeUrl || "",
        });
        if (s.logo) {
          setPreview(s.logo.startsWith("http") ? s.logo : `${API}/${s.logo}`);
        }
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    try {
      const res = await axios.put(`${API}/settings`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        alert("Settings updated successfully!");
      }
    } catch (err) {
      console.error("Failed to update settings:", err);
      alert(err.response?.data?.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-5xl mx-auto">
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Global Site Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage contact information, social links, and your site logo here.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: General */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">1. General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                name="siteName"
                value={form.siteName}
                onChange={handleChange}
                placeholder="e.g. Shree Baidyanath"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Logo</label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white overflow-hidden relative group cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {preview ? (
                    <img src={preview} alt="Logo Preview" className="h-full object-contain p-1" />
                  ) : (
                    <span className="text-gray-400 text-xs text-center px-2">Click to Upload Logo</span>
                  )}
                  {preview && (
                     <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                        <FaImage className="text-white" />
                     </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">Recommended size:<br/>250px x 80px</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Info */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">2. Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="info@shreebaidyanath.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                type="text"
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
              <textarea
                name="contactAddress"
                value={form.contactAddress}
                onChange={handleChange}
                rows="2"
                placeholder="123 Ayurveda Street, Wellness City, India"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Section 3: Social Links */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">3. Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input
                type="url"
                name="facebookUrl"
                value={form.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input
                type="url"
                name="instagramUrl"
                value={form.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
              <input
                type="url"
                name="twitterUrl"
                value={form.twitterUrl}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
              <input
                type="url"
                name="youtubeUrl"
                value={form.youtubeUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaSave />
            )}
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
