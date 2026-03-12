"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import TiptapEditor from "../../../components/TiptapEditor";

export default function EditBlog() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    slug: "",
    author: "",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/blogs/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const blog = res.data.blogs.find((b) => b._id === id);
          if (blog) {
            setForm({
              title: blog.title,
              description: blog.description,
              content: blog.content,
              slug: blog.slug,
              author: blog.author,
              isActive: blog.isActive,
            });
            setPreview(blog.image.startsWith("http") ? blog.image : `${API}/${blog.image.replace(/\\/g, "/")}`);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id, API]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
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
    setSaving(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("content", form.content);
    formData.append("slug", form.slug);
    formData.append("author", form.author);
    formData.append("isActive", form.isActive);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await axios.put(`${API}/blog/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        alert("Blog updated successfully!");
        router.push("/blogs");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Blog Post</h1>

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
                {preview && <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />}
              </div>
            </div>
            <div className="space-y-6">
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
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                  Published (Visible to public)
                </label>
              </div>
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
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 disabled:bg-blue-300 disabled:cursor-not-allowed">
              {saving ? "Saving Changes..." : "Update Blog Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
