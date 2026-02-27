"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddCollection() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [priview, setPriview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPriview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("collectionName", form.name);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/add-collection`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      alert("Collection added successfully");
      router.push("/collections");
    } catch (error) {
      console.log(error);
      alert("Failed to add collection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Add Collection
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">Collection Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Collection Name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleImage}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer transition-all"
            />
            {priview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={priview}
                  alt="Preview"
                  className="max-h-32 object-contain rounded-lg border border-gray-200 bg-gray-50"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer">
            {loading ? "Adding..." : "Add Collection"}
          </button>
        </form>
      </div>
    </div>
  );
}
