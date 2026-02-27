"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function CollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await axios.get(`${API}/collection`);
      const data = await res.data;
      if (data.success) setCollections(data.collections);
    } catch (err) {
      console.error("Collections fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const getImgUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API}/${path}`;
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span
                onClick={() => router.push("/")}
                className="hover:text-amber-600 cursor-pointer transition-colors">
                Home
              </span>
              <span>›</span>
              <span className="text-gray-800 font-medium">Collections</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white py-8 md:py-12 border-b border-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              All Collections
            </h1>
            <div className="w-20 h-1 bg-amber-600 mx-auto rounded-full"></div>
            <p className="text-gray-500 mt-3 text-sm md:text-base">
              Browse our complete range of Ayurvedic collections
            </p>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="container mx-auto px-4 py-10 md:py-16">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No collections found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
              {collections.map((col) => (
                <div
                  key={col._id}
                  className="group flex flex-col items-center cursor-pointer">
                  <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-amber-600 transition-all duration-300 shadow-md group-hover:shadow-xl">
                    <img
                      src={getImgUrl(
                        col.collectionImage && col.collectionImage[0],
                      )}
                      alt={col.collectionName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
                  </div>
                  <p className="text-center text-sm md:text-base font-semibold text-gray-800 group-hover:text-amber-700 transition-colors duration-300">
                    {col.collectionName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
