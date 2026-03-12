"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import TiptapEditor from "../../components/TiptapEditor";

export default function AddBlog() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    slug: "",
    author: "Shree Baidyanath",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title" && !form.slug) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setForm({ ...form, title: value, slug });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleContentChange = (html) => {
    setForm({ ...form, content: html });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please upload a featured image");
      return;
    }
    if (!form.content || form.content === "<p></p>" || form.content === "") {
      alert("Please enter blog content");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    const API = process.env.NEXT_PUBLIC_API_URL;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("content", form.content);
    formData.append("slug", form.slug);
    formData.append("author", form.author);
    formData.append("image", imageFile);

    try {
      const res = await axios.post(`${API}/add-blog`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        alert("Blog published successfully!");
        router.push("/blogs");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to publish blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Write New Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Enter a catchy title"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (URL)</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                placeholder="url-slug-here"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
            <textarea
              name="description"
              rows="2"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Brief summary for the blog card..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image</label>
              <div className="relative group border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-400 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-gray-400">
                    <span className="text-3xl mb-2">📸</span>
                    <span className="text-sm">Click to upload image</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Author Name</label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">Blog Content</label>
            <TiptapEditor
              content={form.content}
              onChange={handleContentChange}
            />
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 disabled:bg-blue-300 disabled:cursor-not-allowed">
              {loading ? "Publishing..." : "Publish Blog Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
