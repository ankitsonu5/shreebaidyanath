"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

export default function EditCollection() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/collection/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.data && res.data.success) {
          const { collection } = res.data;
          setForm({
            name: collection.collectionName,
          });
          if (collection.collectionImage && collection.collectionImage[0]) {
            setPreview(
              collection.collectionImage[0].startsWith("http")
                ? collection.collectionImage[0]
                : `${process.env.NEXT_PUBLIC_API_URL}/${collection.collectionImage[0]}`,
            );
          }
        }
      } catch (error) {
        alert("Error Loading Collection");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCollection();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("collectionName", form.name);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/collection/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        alert("Collection updated successfully!");
        router.push("/collections");
      }
    } catch (error) {
      alert("Failed to update collection");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-xl font-medium text-gray-600">
          Loading collection...
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Edit Collection
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Collection Name */}
          <div>
            <label className="block text-gray-700 font-bold text-sm mb-2 uppercase tracking-wide">
              Collection Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Current Image Preview */}
          <div>
            <label className="block text-gray-700 font-bold text-sm mb-2 uppercase tracking-wide">
              Collection Image
            </label>

            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image selected
                </div>
              )}
            </div>
          </div>

          {/* New Image Upload */}
          <div>
            <label className="block text-gray-700 font-bold text-sm mb-2 uppercase tracking-wide">
              Change Image
            </label>

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImage}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
            />
          </div>

          {/* Update Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-blue-700 transition shadow-lg disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer">
            {loading ? "Updating..." : "Update Collection"}
          </button>
        </form>
      </div>
    </div>
  );
}
