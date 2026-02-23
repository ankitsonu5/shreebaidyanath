"use client";

import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import Link from "next/link";

export default function BlogSlug({ params }) {
  const { slug } = params;

  // Dummy data (baad me API se replace kar dena)
  const blog = {
    title: "How to Build a Modern E-commerce Store",
    author: "Admin",
    date: "Feb 20, 2026",
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    content: `
      Building a modern e-commerce store requires scalability,
      performance optimization, and SEO best practices.

      Next.js provides server-side rendering and static generation,
      making it perfect for SEO-driven applications.

      Tailwind CSS helps you rapidly build modern UI without
      leaving your HTML.
    `,
    tags: ["Next.js", "E-commerce", "Web Development"],
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <div className="relative h-80 w-full">
          <img
            src={`${blog.image}?auto=format&fit=crop&w=1400&q=80`}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h1 className="text-3xl md:text-5xl text-white font-bold text-center px-4">
              {blog.title}
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-12 bg-white shadow-lg rounded-xl -mt-16 relative z-10">
          <div className="text-gray-500 text-sm mb-4">
            {blog.date} • By {blog.author}
          </div>

          <div className="prose max-w-none text-gray-700 whitespace-pre-line">
            {blog.content}
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-3">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-sm px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Back Button */}
          <div className="mt-10">
            <Link
              href="/blog"
              className="text-blue-600 font-medium hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
