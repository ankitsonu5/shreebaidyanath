"use client";

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function BlogPage() {
  const blogs = [
    {
      id: 1,
      title: "How to Build a Modern E-commerce Store",
      description:
        "Learn how to build a scalable and modern e-commerce platform using Next.js and Tailwind.",
      image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
      date: "Feb 20, 2026",
    },
    {
      id: 2,
      title: "Why Next.js is Perfect for SEO",
      description:
        "Discover why Next.js is one of the best frameworks for SEO-friendly applications.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
      date: "Feb 18, 2026",
    },
    {
      id: 3,
      title: "Tailwind CSS Tips & Tricks",
      description:
        "Boost your productivity with these powerful Tailwind CSS techniques.",
      image: "https://images.unsplash.com/photo-1505685296765-3a2736de412f",
      date: "Feb 15, 2026",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        {/* <div className="bg-black text-white py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Our Blog</h1>
          <p className="mt-4 text-gray-300">
            Insights, tutorials, and updates from our team
          </p>
        </div> */}

        <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-4 gap-8">
          {/* Blog Grid */}
          <div className="lg:col-span-3 grid md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                <img
                  src={`${blog.image}?auto=format&fit=crop&w=800&q=80`}
                  alt={blog.title}
                  className="h-52 w-full object-cover"
                />

                <div className="p-6">
                  <p className="text-sm text-gray-500">{blog.date}</p>
                  <h2 className="text-xl font-semibold mt-2">{blog.title}</h2>
                  <p className="text-gray-600 mt-3">{blog.description}</p>

                  <button className="mt-4 text-blue-600 font-medium hover:underline">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="bg-white p-6 rounded-xl shadow h-fit">
            <h3 className="text-lg font-semibold mb-4">Search</h3>
            <input
              type="text"
              placeholder="Search blog..."
              className="w-full border px-3 py-2 rounded-lg mb-6"
            />

            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-black cursor-pointer">E-commerce</li>
              <li className="hover:text-black cursor-pointer">Next.js</li>
              <li className="hover:text-black cursor-pointer">React</li>
              <li className="hover:text-black cursor-pointer">UI/UX</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
