"use client";

import Link from "next/link";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import axios from "axios";

export default function BlogPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API}/blogs`);
        if (res.data.success) {
          setBlogs(res.data.blogs);
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [API]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/blog/${blog.slug}`)}>
                  <img
                    src={blog.image.startsWith("http") ? blog.image : `${API}/${blog.image.replace(/\\/g, "/")}`}
                    alt={blog.title}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-6">
                    <p className="text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <h2 className="text-xl font-semibold mt-2 line-clamp-2">{blog.title}</h2>
                    <p className="text-gray-600 mt-3 line-clamp-3">{blog.description}</p>

                    <Link
                      href={`/blog/${blog.slug}`}
                      className="mt-4 inline-block text-blue-600 font-medium hover:underline">
                      Read More →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500">No blogs found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}