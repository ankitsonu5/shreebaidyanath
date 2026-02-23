"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.push("/signin");
    } else {
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter((p) => p._id !== id));
        alert("Product deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    }
    setOpenMenu(null);
  };

  const getImageUrl = (product) => {
    if (!product.productImage || !product.productImage[0]) return "";
    const img = product.productImage[0];
    return img.startsWith("http")
      ? img
      : `${process.env.NEXT_PUBLIC_API_URL}/${img}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admindashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-gray-200 border border-gray-200 transition-all shadow-sm">
                <IoIosArrowBack />
              </div>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          </div>
          <button
            onClick={() => router.push("/add-product")}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2 text-sm font-medium w-fit cursor-pointer">
            <span className="text-lg">+</span> Add Product
          </button>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
            No products found. Add your first product!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-0 relative group border border-gray-100">
                {/* Image */}
                <div className="h-48 w-full relative overflow-hidden rounded-t-xl">
                  <img
                    src={getImageUrl(item)}
                    alt={item.productName}
                    className="w-full h-full object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-6 w-64">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                        {item.productName}
                      </h3>
                      <p className="text-blue-600 font-bold mt-1">
                        ₹{item.productPrice}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Stock:{" "}
                        <span
                          className={
                            item.productStock > 0
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }>
                          {item.productStock > 0
                            ? item.productStock
                            : "Out of Stock"}
                        </span>
                      </p>
                    </div>

                    {/* 3 Dot Menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === item._id ? null : item._id)
                        }
                        className="text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                        ⋮
                      </button>

                      {openMenu === item._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-xl z-50 py-1 border-gray-200">
                          <button
                            onClick={() =>
                              router.push(`/edit-product/${item._id}`)
                            }
                            className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-medium border-t border-gray-100 cursor-pointer">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
