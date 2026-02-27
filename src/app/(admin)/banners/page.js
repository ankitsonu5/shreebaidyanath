"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEdit2 } from "react-icons/fi";

export default function BannersPage() {
  const router = useRouter();
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/banners/admin`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setBanners(data.banners);
      }
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/banner/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setBanners(banners.filter((b) => b._id !== id));
      }
    } catch (error) {
      alert("Failed to delete banner");
    }
  };

  const handleToggle = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/banner/${id}/toggle`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setBanners(
          banners.map((b) =>
            b._id === id ? { ...b, isActive: data.banner.isActive } : b,
          ),
        );
      }
    } catch (error) {
      alert("Failed to toggle banner");
    }
  };

  const getImageUrl = (banner) => {
    const img = banner.bannerImage;
    return img.startsWith("http")
      ? img
      : `${process.env.NEXT_PUBLIC_API_URL}/${img}`;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Banners</h1>
        <button
          onClick={() => router.push("/add-banner")}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2 text-sm font-medium w-fit cursor-pointer">
          <span className="text-lg">+</span> Add Banner
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
          No banners found. Add your first banner!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
                banner.isActive
                  ? "border-gray-100"
                  : "border-red-200 opacity-60"
              }`}>
              <div className="h-48 w-full">
                <img
                  src={getImageUrl(banner)}
                  alt="Banner"
                  className="w-full h-full object-contain bg-gray-50"
                />
              </div>
              <div className="p-4">
                {/* Top row: badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 capitalize">
                    {banner.bannerType}
                  </span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    Order: {banner.bannerOrder || 0}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      banner.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-600"
                    }`}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Bottom row: actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(banner._id)}
                    className={`text-sm font-medium px-3 py-1.5 rounded-lg cursor-pointer transition ${
                      banner.isActive
                        ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}>
                    {banner.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => router.push(`/edit-banner/${banner._id}`)}
                    className="text-sm font-medium px-3 py-1.5 rounded-lg cursor-pointer bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex items-center gap-1">
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="text-sm font-medium px-3 py-1.5 rounded-lg cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 transition ml-auto">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
