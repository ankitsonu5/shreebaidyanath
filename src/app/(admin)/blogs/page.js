"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoAdd, IoPencil, IoTrash, IoEye } from "react-icons/io5";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/blogs/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setBlogs(res.data.blogs);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API}/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        alert("Blog deleted successfully");
        fetchBlogs();
      }
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Blogs</h1>
        <Link
          href="/add-blog"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-lg">
          <IoAdd size={20} />
          Add New Blog
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-100">
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Image</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Title</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Author</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="p-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr key={blog._id} className="transition hover:bg-gray-50">
                    <td className="p-4">
                      <img
                        src={blog.image.startsWith("http") ? blog.image : `${API}/${blog.image.replace(/\\/g, "/")}`}
                        alt={blog.title}
                        className="w-16 h-12 object-cover rounded shadow-sm"
                      />
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">{blog.title}</div>
                      <div className="text-xs text-gray-400">/{blog.slug}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{blog.author}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          blog.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                        {blog.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-blue-500 transition"
                          title="View Blog">
                          <IoEye size={18} />
                        </Link>
                        <Link
                          href={`/edit-blog/${blog._id}`}
                          className="p-2 text-gray-400 hover:text-green-500 transition"
                          title="Edit Blog">
                          <IoPencil size={18} />
                        </Link>
                        <button
                          onClick={() => deleteBlog(blog._id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                          title="Delete Blog">
                          <IoTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    No blogs found. Click "Add New Blog" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
