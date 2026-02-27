"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/collection`,
      );
      const data = await response.json();
      if (data.success) {
        setCollections(data.collections);
      }
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
  };

  const collectionDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/collection/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setCollections(collections.filter((item) => item._id !== id));
        alert("Collection deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete collection:", error);
      alert("Failed to delete collection");
    }
    setOpenMenu(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Collections</h1>
        <button
          onClick={() => router.push("/add-collections")}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2 text-sm font-medium w-fit cursor-pointer">
          <span className="text-lg">+</span> Add Collection
        </button>
      </div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
          No collections found. Add your first collection!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-0 relative group border border-gray-100">
              {/* Image container */}
              <div className="h-40 w-full relative overflow-hidden">
                <img
                  src={
                    item.collectionImage && item.collectionImage[0]
                      ? item.collectionImage[0].startsWith("http")
                        ? item.collectionImage[0]
                        : `${process.env.NEXT_PUBLIC_API_URL}/${item.collectionImage[0]}`
                      : ""
                  }
                  alt={item.collectionName}
                  className="w-full h-full object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
              </div>

              <div className="p-4 flex justify-between items-center bg-white">
                <h3 className="text-lg font-semibold text-gray-800 truncate pr-8">
                  {item.collectionName}
                </h3>

                {/* 3 Dot Button */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === item._id ? null : item._id)
                    }
                    className="text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                    ⋮
                  </button>

                  {/* Dropdown */}
                  {openMenu === item._id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-xl z-50 py-1 transition-all overflow-hidden border-gray-200 ">
                      <button
                        onClick={() =>
                          router.push(`/edit-collections/${item._id}`)
                        }
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer">
                        Edit
                      </button>
                      <button
                        onClick={() => collectionDelete(item._id)}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-medium border-t border-gray-100 cursor-pointer">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
