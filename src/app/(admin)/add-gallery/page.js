"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { navigateTo } from "../../lib/navigation";

export default function AddGalleryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [mediaType, setMediaType] = useState("photo");
  const [videoUrl, setVideoUrl] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mediaType === "photo" && !image) {
      alert("Please select an image");
      return;
    }
    if (mediaType === "video" && !image && !videoUrl) {
      alert("Please either provide a Video URL or upload a video file");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("title", title);
    formData.append("mediaType", mediaType);
    if (videoUrl) formData.append("videoUrl", videoUrl);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        navigateTo(router, "/manage-gallery");
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          &larr; Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add Gallery Media</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-6 border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image Title (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="E.g., Event at headquarters"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Media Type *
          </label>
          <select
            value={mediaType}
            onChange={(e) => {
              setMediaType(e.target.value);
              setImage(null);
              setPreview(null);
              setVideoUrl("");
            }}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="photo">Photo</option>
            <option value="video">Video</option>
          </select>
        </div>

        {mediaType === "video" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL (e.g., YouTube embed link)
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="https://www.youtube.com/embed/..."
            />
            <p className="text-xs text-gray-500 mt-1">Provide a URL OR upload a video file below.</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {mediaType === "photo" ? "Image File *" : "Video File (Optional if URL provided)"}
          </label>
          <input
            type="file"
            accept={mediaType === "photo" ? "image/*" : "image/*,video/*"}
            onChange={handleImageChange}
            className="w-full border rounded-lg p-2"
            required={mediaType === "photo" || (!videoUrl && mediaType === "video")}
          />
        </div>

        {preview && mediaType === "photo" && (
          <div className="h-48 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
            <img src={preview} alt="Preview" className="h-full object-contain" />
          </div>
        )}
        
        {preview && mediaType === "video" && (
          <div className="h-48 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
             <video src={preview} controls className="h-full max-w-full" />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Add Media"}
        </button>
      </form>
    </div>
  );
}
