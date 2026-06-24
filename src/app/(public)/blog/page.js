"use client";

import Link from "next/link";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { useRouter } from "next/navigation";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { useState, useEffect } from "react";
import axios from "axios";
import { navigateTo } from "../../lib/navigation";

export default function BlogPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState(null);
  const blogsPerPage = 3; // 3 blogs per page as requested

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API}/blogs`);
        if (res.data.success) {
          setBlogs(res.data.blogs || []);
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    const fetchPageData = async () => {
      try {
        const res = await axios.get(`${API}/page-cms/blog`);
        if (res.data.success) {
          setPageData(res.data.page);
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("Failed to fetch page data:", err);
        }
      }
    };
    fetchBlogs();
    fetchPageData();
  }, [API]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Discovering Ayurvedic wisdom...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Pagination calculations
  const totalBlogs = blogs.length;
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  // Slice current page blogs
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Generate pagination sliding window of at most 5 pages centered around currentPage
  const getPaginationGroup = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Smooth scroll to top of blogs section
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen pb-16">
        {/* Banner Section */}
        <div
          className="relative bg-cover bg-center py-25 px-4 text-center overflow-hidden shadow-md text-white"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(180, 83, 9, 0.5), rgba(120, 53, 4, 0.5), rgba(66, 32, 6, 0.1)), url('${
              pageData?.bannerImage
                ? pageData.bannerImage.startsWith("http")
                  ? pageData.bannerImage
                  : `${API}/${pageData.bannerImage}`
                : "/blogbanner.jpg"
            }')`,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.08)_0%,transparent_70%)]"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
              Shree Baidyanath Knowledge Center
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-3 tracking-tight">
              {pageData?.heroHeading || "Our Ayurvedic Blog"}
            </h1>
            <p className="text-amber-100/80 mt-4 max-w-xl mx-auto text-base leading-relaxed">
              {pageData?.heroSubheading || "Explore timeless wisdom, home remedies, and lifestyle practices for holistic health, immune vitality, and longevity."}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Blog Grid - Exactly 3 columns per row on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentBlogs.length > 0 ? (
              currentBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100/80 flex flex-col group h-full cursor-pointer"
                  onClick={() => navigateTo(router, `/blog/${blog.slug}`)}
                >
                  <div className="relative overflow-hidden h-56 w-full">
                    <img
                      src={
                        blog.image.startsWith("http")
                          ? blog.image
                          : `${API}/${blog.image.replace(/\\/g, "/")}`
                      }
                      alt={blog.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 line-clamp-2 hover:text-amber-700 transition group-hover:text-amber-700">
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 mt-3 text-sm leading-relaxed line-clamp-3">
                        {blog.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        By Shree Baidyanath
                      </span>
                      <Link
                        href={`/blog/${blog.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-amber-700 font-extrabold text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                      >
                        Read More{" "}
                        <FaArrowRight size={12} className="text-amber-600" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-lg font-medium">
                  No blog posts found at the moment.
                </p>
              </div>
            )}
          </div>

          {/* Centered Premium Pagination Widget */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center">
              <nav
                className="flex items-center gap-2 bg-white px-4 py-3 rounded-full border border-gray-100 shadow-sm"
                aria-label="Pagination"
              >
                {/* Left Arrow */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-amber-50 hover:text-amber-800 cursor-pointer"
                  }`}
                  aria-label="Previous Page"
                >
                  <FaChevronLeft size={14} />
                </button>

                {/* Sliding Window Numbers */}
                <div className="flex gap-1.5 items-center">
                  {getPaginationGroup().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[40px] h-10 rounded-full font-bold text-sm transition-all flex items-center justify-center cursor-pointer ${
                        currentPage === page
                          ? "bg-amber-600 text-white shadow-md shadow-amber-600/20 scale-105"
                          : "text-gray-600 hover:bg-amber-50 hover:text-amber-800"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-amber-50 hover:text-amber-800 cursor-pointer"
                  }`}
                  aria-label="Next Page"
                >
                  <FaChevronRight size={14} />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
