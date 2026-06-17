"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import { useParams, useRouter } from "next/navigation";
import {
  FaCalendarAlt,
  FaUser,
  FaChevronRight,
  FaComments,
  FaArrowLeft,
  FaGlobe,
} from "react-icons/fa";
import { navigateTo } from "../../../lib/navigation";

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comment Form State
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentWebsite, setCommentWebsite] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL;

  // Sidebar Categories (Ayurvedic theme)
  const categories = [
    { name: "Immunity Boosters", count: 4 },
    { name: "Respiratory Care", count: 3 },
    { name: "Digestive Health", count: 5 },
    { name: "Vitality & Strength", count: 4 },
    { name: "General Wellness", count: 6 },
  ];

  // Fetch Blog, Comments, and Recent Blogs
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        // 1. Fetch Blog Detail
        const blogRes = await axios.get(`${API}/blog/${slug}`);
        if (blogRes.data.success) {
          const fetchedBlog = blogRes.data.blog;
          setBlog(fetchedBlog);

          // 2. Fetch Blog Comments
          const commentsRes = await axios.get(`${API}/blog/${slug}/comments`);
          if (commentsRes.data.success) {
            setComments(commentsRes.data.comments || []);
          }

          // 3. Fetch Recent Blogs (for sidebar)
          const allRes = await axios.get(`${API}/blogs`);
          if (allRes.data.success) {
            const filtered = (allRes.data.blogs || [])
              .filter((b) => b.slug !== slug)
              .slice(0, 3);
            setRecentBlogs(filtered);
          }
        }
      } catch (err) {
        console.error("Failed to load blog page details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [slug, API]);

  // Client-Side SEO Dynamic Updates (Title, Description, and Structured JSON-LD Data)
  useEffect(() => {
    if (!blog) return;

    // 1. Update Document Title
    const originalTitle = document.title;
    document.title = `${blog.title} | Shree Baidyanath`;

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    let originalDescription = metaDescription
      ? metaDescription.getAttribute("content")
      : "";

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", blog.description || "");

    // 3. Inject Structured Schema JSON-LD (Article type)
    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.id = "blog-jsonld-schema";

    const blogImageUrl = blog.image.startsWith("http")
      ? blog.image
      : `${API}/${blog.image.replace(/\\/g, "/")}`;

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: blog.title,
      description: blog.description,
      image: blogImageUrl,
      datePublished: blog.createdAt,
      dateModified: blog.updatedAt || blog.createdAt,
      author: {
        "@type": "Person",
        name: blog.author || "Shree Baidyanath",
      },
      publisher: {
        "@type": "Organization",
        name: "Shree Baidyanath",
        logo: {
          "@type": "ImageObject",
          url: "/logo.png", // Fallback logo path
        },
      },
    };

    schemaScript.text = JSON.stringify(schemaData);
    document.head.appendChild(schemaScript);

    // Cleanup functions
    return () => {
      document.title = originalTitle;
      if (metaDescription && originalDescription) {
        metaDescription.setAttribute("content", originalDescription);
      } else if (metaDescription) {
        document.head.removeChild(metaDescription);
      }

      const existingSchema = document.getElementById("blog-jsonld-schema");
      if (existingSchema) {
        document.head.removeChild(existingSchema);
      }
    };
  }, [blog, API]);

  // Handle Comment Submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName || !commentEmail || !commentBody) {
      setFormError("Please fill out the name, email, and comment body.");
      return;
    }

    setFormSubmitting(true);
    setFormError("");
    setFormSuccess(false);

    try {
      const res = await axios.post(`${API}/blog/${slug}/comment`, {
        name: commentName,
        email: commentEmail,
        website: commentWebsite,
        comment: commentBody,
      });

      if (res.data.success) {
        setFormSuccess(true);
        // Reset comment fields
        setCommentBody("");
        // Instantly append new comment to the list
        setComments((prev) => [res.data.comment, ...prev]);
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
      setFormError(
        err.response?.data?.message ||
          "Failed to submit comment. Please try again.",
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-semibold">
              Preparing Ayurvedic Insights...
            </p>
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
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm border max-w-md">
            <h1 className="text-2xl font-bold text-gray-900">
              Blog Article Not Found
            </h1>
            <p className="mt-2 text-gray-600 text-sm">
              The article you are looking for might have been moved or removed.
            </p>
            <button
              onClick={() => navigateTo(router, "/blog")}
              className="mt-6 inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-5 rounded-full transition shadow-sm"
            >
              <FaArrowLeft size={12} /> Back to Catalog
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const blogCoverImage = blog.image.startsWith("http")
    ? blog.image
    : `${API}/${blog.image.replace(/\\/g, "/")}`;

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen">
        {/* Visual Banner - Full Width Premium Header */}
        <div
          className="relative h-[380px] md:h-[480px] bg-cover bg-center flex items-end justify-center shadow-lg"
          style={{ backgroundImage: `url('${blogCoverImage}')` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/35"></div>

          {/* Content inside Banner */}
          <div className="max-w-7xl w-full mx-auto px-4 pb-12 relative z-10 text-white">
            <button
              onClick={() => navigateTo(router, "/blog")}
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-bold mb-4 transition text-sm"
            >
              <FaArrowLeft size={11} /> Back to Blog
            </button>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white max-w-4xl tracking-tight">
              {blog.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-amber-200/90 font-medium">
              <span className="flex items-center gap-2">
                <FaUser className="text-amber-500 text-xs" /> By{" "}
                {blog.author || "Shree Baidyanath"}
              </span>
              <span className="hidden sm:inline text-amber-500/50">•</span>
              <span className="flex items-center gap-2">
                <FaCalendarAlt className="text-amber-500 text-xs" />{" "}
                {formatDate(blog.createdAt)}
              </span>
              <span className="hidden sm:inline text-amber-500/50">•</span>
              <span className="flex items-center gap-2">
                <FaComments className="text-amber-500 text-xs" />{" "}
                {comments.length} Reply/Replies
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column SEO Restructured Layout */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Main Column (8 Cols) */}
            <main className="lg:col-span-8 space-y-12">
              {/* Rich Blog Content Block */}
              <article className="bg-white p-6 md:p-10 rounded-2xl border border-gray-100 shadow-sm">
                <div
                  className="prose prose-amber max-w-none text-gray-800 leading-relaxed text-base md:text-lg"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </article>

              {/* Comments Section */}
              <section className="space-y-8 bg-white p-6 md:p-10 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2.5">
                  <FaComments className="text-amber-600" /> Comments (
                  {comments.length})
                </h3>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.length > 0 ? (
                    comments.map((cmt) => (
                      <div
                        key={cmt._id}
                        className="flex gap-4 p-4 rounded-xl hover:bg-gray-50/50 border border-gray-100/50 transition"
                      >
                        {/* Circular Avatar */}
                        <div className="w-12 h-12 bg-amber-100 text-amber-800 font-extrabold rounded-full flex items-center justify-center text-lg flex-shrink-0">
                          {cmt.name ? cmt.name.charAt(0).toUpperCase() : "U"}
                        </div>

                        {/* Comment Content */}
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-bold text-gray-900">
                              {cmt.name}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                              {new Date(cmt.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>

                          {cmt.website && (
                            <a
                              href={
                                cmt.website.startsWith("http")
                                  ? cmt.website
                                  : `https://${cmt.website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-amber-700 hover:underline flex items-center gap-1 font-medium"
                            >
                              <FaGlobe size={10} /> {cmt.website}
                            </a>
                          )}

                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap pt-1.5">
                            {cmt.comment}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500 text-sm">
                      Be the first to share your thoughts on this Ayurvedic
                      article!
                    </div>
                  )}
                </div>

                {/* "Leave a Reply" Form */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-xl font-bold text-gray-900">
                    Leave a Reply
                  </h4>
                  <p className="text-gray-500 text-xs mt-1">
                    Your email address will not be published. Required fields
                    are marked *
                  </p>

                  <form
                    onSubmit={handleCommentSubmit}
                    className="mt-6 space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="comment_body"
                        className="block text-sm font-bold text-gray-700 mb-1"
                      >
                        Comment *
                      </label>
                      <textarea
                        id="comment_body"
                        rows="5"
                        required
                        value={commentBody}
                        onChange={(e) => setCommentBody(e.target.value)}
                        placeholder="Write your comment..."
                        className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="comment_name"
                          className="block text-sm font-bold text-gray-700 mb-1"
                        >
                          Name *
                        </label>
                        <input
                          type="text"
                          id="comment_name"
                          required
                          value={commentName}
                          onChange={(e) => setCommentName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="comment_email"
                          className="block text-sm font-bold text-gray-700 mb-1"
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          id="comment_email"
                          required
                          value={commentEmail}
                          onChange={(e) => setCommentEmail(e.target.value)}
                          placeholder="Your Email"
                          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="comment_website"
                        className="block text-sm font-bold text-gray-700 mb-1"
                      >
                        Website (Optional)
                      </label>
                      <input
                        type="url"
                        id="comment_website"
                        value={commentWebsite}
                        onChange={(e) => setCommentWebsite(e.target.value)}
                        placeholder="example.com"
                        className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                      />
                    </div>

                    {formSuccess && (
                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-lg text-sm font-semibold">
                        Your comment has been posted successfully!
                      </div>
                    )}

                    {formError && (
                      <div className="bg-red-50 border border-red-100 text-red-800 p-3 rounded-lg text-sm font-semibold">
                        {formError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md shadow-amber-600/10 cursor-pointer disabled:bg-amber-400"
                    >
                      {formSubmitting ? "Posting..." : "Post Comment"}
                    </button>
                  </form>
                </div>
              </section>
            </main>

            {/* Right Sidebar Column (4 Cols) */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Ayurvedic Categories Widget */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                  Ayurvedic Categories
                </h4>
                <ul className="space-y-2.5">
                  {categories.map((cat, idx) => (
                    <li key={idx}>
                      <Link
                        href="/blog"
                        className="flex items-center justify-between text-gray-600 hover:text-amber-700 text-sm font-bold py-1.5 px-2 rounded-lg hover:bg-amber-50/50 transition"
                      >
                        <span className="flex items-center gap-2">
                          <FaChevronRight
                            size={10}
                            className="text-amber-500"
                          />
                          {cat.name}
                        </span>
                        <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                          {cat.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Posts Widget */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                  Recent Articles
                </h4>

                <div className="space-y-4">
                  {recentBlogs.length > 0 ? (
                    recentBlogs.map((item) => {
                      const itemImage = item.image.startsWith("http")
                        ? item.image
                        : `${API}/${item.image.replace(/\\/g, "/")}`;
                      return (
                        <div
                          key={item._id}
                          onClick={() =>
                            navigateTo(router, `/blog/${item.slug}`)
                          }
                          className="flex gap-3 cursor-pointer group hover:bg-gray-50 p-1.5 rounded-xl transition"
                        >
                          <img
                            src={itemImage}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                          />

                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-amber-700 transition">
                              {item.title}
                            </h5>
                            <span className="flex items-center gap-1 text-[11px] text-gray-400 mt-1 font-medium">
                              <FaCalendarAlt size={9} />{" "}
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-gray-400">
                      No other recent posts found.
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
