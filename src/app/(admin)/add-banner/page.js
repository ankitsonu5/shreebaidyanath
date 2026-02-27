"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddBanner() {
  const router = useRouter();
  const [bannerType, setBannerType] = useState("hero");
  const [bannerOrder, setBannerOrder] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("bannerImage", imageFile);
    formData.append("bannerType", bannerType);
    formData.append("bannerOrder", bannerOrder);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/add-banner`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res.data.success) {
        alert("Banner added successfully");
        router.push("/banners");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Banner</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">Banner Type</label>
            <select
              value={bannerType}
              onChange={(e) => setBannerType(e.target.value)}
              className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
              <option value="hero">Hero Banner (Main)</option>
              <option value="offer">Offer Banner</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Display Order</label>
            <input
              type="number"
              value={bannerOrder}
              onChange={(e) => setBannerOrder(e.target.value)}
              min="0"
              className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0 = first, 1 = second, etc."
            />
            <p className="text-xs text-gray-400 mt-1">
              Lower number = shown first
            </p>
          </div>

          <div>
            <label className="block mb-2 font-medium">Banner Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              required
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer transition-all"
            />
            {preview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-40 object-contain rounded-lg border border-gray-200 bg-gray-50 w-full"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed">
            {loading ? "Uploading..." : "Add Banner"}
          </button>
        </form>
      </div>
    </div>
  );
}
