"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import { useParams } from "next/navigation";

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API}/blog/${slug}`);
        if (res.data.success) {
          setBlog(res.data.blog);
        }
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlog();
  }, [slug, API]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog content...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Blog Not Found</h1>
            <p className="mt-2 text-gray-600">The blog you are looking for does not exist.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-white min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <img
            src={blog.image.startsWith("http") ? blog.image : `${API}/${blog.image.replace(/\\/g, "/")}`}
            alt={blog.title}
            className="w-full h-[400px] object-cover rounded-2xl shadow-lg mb-8"
          />

          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              {blog.title}
            </h1>
            <div className="mt-4 flex items-center text-gray-500 text-sm">
              <span className="font-medium text-gray-900 mr-2">{blog.author}</span>
              <span className="mx-2">•</span>
              <span>
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            {/* Using dangerouslySetInnerHTML because we'll be using a Rich Text Editor for content */}
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
