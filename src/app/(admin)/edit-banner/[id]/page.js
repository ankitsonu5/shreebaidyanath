"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";

export default function EditBanner() {
  const { id } = useParams();
  const router = useRouter();
  const [bannerType, setBannerType] = useState("hero");
  const [bannerOrder, setBannerOrder] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/signin");
      return;
    }
    if (id) fetchBanner();
  }, [id]);

  const fetchBanner = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/banner/${id}`,
      );
      const data = await res.json();
      if (data.success) {
        const b = data.banner;
        setBannerType(b.bannerType || "hero");
        setBannerOrder(b.bannerOrder || 0);
        const img = b.bannerImage;
        setPreview(
          img.startsWith("http")
            ? img
            : `${process.env.NEXT_PUBLIC_API_URL}/${img}`,
        );
      }
    } catch (error) {
      console.error("Failed to fetch banner:", error);
    }
  };

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
    formData.append("bannerType", bannerType);
    formData.append("bannerOrder", bannerOrder);
    if (imageFile) {
      formData.append("bannerImage", imageFile);
    }

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/banner/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res.data.success) {
        alert("Banner updated successfully");
        router.push("/banners");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-8">
        <button
          onClick={() => router.push("/banners")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6 group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 border border-gray-200 transition-all">
            <IoIosArrowBack />
          </div>
          <span className="text-sm font-medium">Back to Banners</span>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Banner</h2>

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
            {preview && (
              <div className="mb-3 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-40 object-contain rounded-lg border border-gray-200 bg-gray-50 w-full"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave empty to keep current image
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed">
            {loading ? "Updating..." : "Update Banner"}
          </button>
        </form>
      </div>
    </div>
  );
}
