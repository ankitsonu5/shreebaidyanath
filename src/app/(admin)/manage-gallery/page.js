"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { navigateTo } from "../../lib/navigation";

export default function GalleryPage() {
  const router = useRouter();
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error("Failed to fetch gallery images:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setImages(images.filter((img) => img._id !== id));
      }
    } catch (error) {
      alert("Failed to delete image");
    }
  };

  const getImageUrl = (imgObj) => {
    const img = imgObj.image;
    if (!img) return "";
    return img.startsWith("http")
      ? img
      : `${process.env.NEXT_PUBLIC_API_URL}/${img}`;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gallery</h1>
        <button
          onClick={() => navigateTo(router, "/add-gallery")}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2 text-sm font-medium w-fit cursor-pointer"
        >
          <span className="text-lg">+</span> Add Media
        </button>
      </div>

      {images.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
          No media found. Add your first gallery item!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm border overflow-hidden transition-all border-gray-100 flex flex-col"
            >
              <div className="h-48 w-full flex items-center justify-center bg-gray-50 overflow-hidden relative">
                {item.mediaType === "video" && item.image === "video-link" && item.videoUrl ? (
                  <iframe src={item.videoUrl} className="w-full h-full border-0 pointer-events-none" title="Video" />
                ) : item.mediaType === "video" ? (
                  <video src={getImageUrl(item)} className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={getImageUrl(item)}
                    alt={item.title || "Gallery Image"}
                    className="w-full h-full object-cover"
                  />
                )}
                <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded shadow-sm text-white ${item.mediaType === "video" ? "bg-red-500" : "bg-blue-500"}`}>
                  {item.mediaType === "video" ? "Video" : "Photo"}
                </span>
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-4">
                  {item.title || "Untitled"}
                </h3>
                <div className="flex items-center gap-2 mt-auto">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-sm font-medium px-3 py-1.5 rounded-lg cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 transition w-full"
                  >
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
