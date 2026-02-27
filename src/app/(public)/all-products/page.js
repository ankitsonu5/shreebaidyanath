"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import FilterUI from "../../components/filter";

function AllProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quantities, setQuantities] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [filters, setFilters] = useState({
    productCollection: searchParams.get("collection") || "",
    productTag: searchParams.get("tag") || "",
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.productCollection)
        params.productCollection = filters.productCollection;
      if (filters.productTag) params.productTag = filters.productTag;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;

      const query = new URLSearchParams(params).toString();
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products${query ? `?${query}` : ""}`,
      );
      const data = res.data;
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Products fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const applyFilters = () => {
    const params = {};
    if (filters.productCollection)
      params.collection = filters.productCollection;
    if (filters.productTag) params.tag = filters.productTag;
    if (filters.search) params.search = filters.search;
    if (filters.sort) params.sort = filters.sort;

    const query = new URLSearchParams(params).toString();
    router.push(`/all-products${query ? `?${query}` : ""}`);
    setShowMobileFilter(false);
    fetchProducts();
  };

  const resetFilters = () => {
    setFilters({
      productCollection: "",
      productTag: "",
      search: "",
      sort: "",
    });
    router.push("/all-products");
    setTimeout(() => {
      setFilters({
        productCollection: "",
        productTag: "",
        search: "",
        sort: "",
      });
    }, 0);
  };

  useEffect(() => {
    if (
      !filters.productCollection &&
      !filters.productTag &&
      !filters.search &&
      !filters.sort
    ) {
      fetchProducts();
    }
  }, [
    filters.productCollection,
    filters.productTag,
    filters.search,
    filters.sort,
  ]);

  const getImgUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http")
      ? path
      : `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
  };

  const updateQty = (id, delta) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const addToCart = (product) => {
    const qty = quantities[product._id] || 1;
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = storedCart.findIndex(
      (item) => item._id === product._id,
    );

    if (existingIndex >= 0) {
      storedCart[existingIndex].quantity += qty;
    } else {
      storedCart.push({
        _id: product._id,
        name: product.productName,
        price: product.productPrice,
        image:
          product.productImage && product.productImage[0]
            ? getImgUrl(product.productImage[0])
            : "",
        quantity: qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(storedCart));
    setQuantities((prev) => ({ ...prev, [product._id]: 1 }));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span
                onClick={() => router.push("/")}
                className="hover:text-amber-600 cursor-pointer transition-colors">
                Home
              </span>
              <span>›</span>
              <span className="text-gray-800 font-medium">All Products</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div
          className="py-8 md:py-12 border-b border-gray-100"
          style={{
            background:
              "linear-gradient(135deg, #fffbeb 0%, #ffffff 50%, #fef3c7 100%)",
          }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
              All Products
            </h1>
            <p className="text-gray-500 text-sm md:text-base mb-3">
              Explore our complete range of Ayurvedic products
            </p>
            <div className="w-20 h-1 bg-amber-600 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3">
          <button
            onClick={() => setShowMobileFilter(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 text-sm font-medium cursor-pointer hover:bg-amber-100 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
            {(filters.productCollection ||
              filters.productTag ||
              filters.search) && (
              <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Main Content: Sidebar + Product Grid */}
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="flex gap-6 md:gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-4">
                <FilterUI
                  filters={filters}
                  setFilters={setFilters}
                  applyFilters={applyFilters}
                  resetFilters={resetFilters}
                />
              </div>
            </aside>

            {/* Product Grid Area */}
            <main className="flex-1 min-w-0">
              {/* Results count */}
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <p className="text-sm text-gray-500">
                  {loading
                    ? "Loading..."
                    : `Showing ${products.length} product${products.length !== 1 ? "s" : ""}`}
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-gray-500 text-lg mb-2">
                    No products found
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition cursor-pointer font-medium">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group">
                      {/* Image */}
                      <div
                        onClick={() => router.push(`/product/${product._id}`)}
                        className="w-full aspect-square bg-gray-50 overflow-hidden cursor-pointer relative">
                        <img
                          src={getImgUrl(
                            product.productImage && product.productImage[0],
                          )}
                          alt={product.productName}
                          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.productStock === 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                              Out of Stock
                            </span>
                          </div>
                        )}
                        {product.productTag && (
                          <span className="absolute top-2 left-2 bg-amber-600 text-white text-[10px] md:text-xs px-2 py-0.5 rounded-full font-medium capitalize">
                            {product.productTag}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3 md:p-4 flex flex-col flex-1">
                        <p
                          onClick={() => router.push(`/product/${product._id}`)}
                          className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2 mb-1.5 cursor-pointer hover:text-amber-600 transition-colors leading-snug">
                          {product.productName}
                        </p>

                        {product.productCollection &&
                          typeof product.productCollection === "object" && (
                            <p className="text-[10px] md:text-xs text-gray-400 mb-1.5">
                              {product.productCollection.collectionName}
                            </p>
                          )}

                        <p className="text-amber-600 font-bold text-sm md:text-lg mb-2">
                          ₹{product.productPrice}
                        </p>

                        {product.productStock > 0 ? (
                          <>
                            <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
                              <button
                                onClick={() => updateQty(product._id, -1)}
                                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-base font-bold text-gray-700 cursor-pointer transition">
                                −
                              </button>
                              <span className="text-sm font-semibold w-6 text-center">
                                {quantities[product._id] || 1}
                              </span>
                              <button
                                onClick={() => updateQty(product._id, 1)}
                                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-base font-bold text-gray-700 cursor-pointer transition">
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => addToCart(product)}
                              className="mt-auto w-full bg-amber-600 hover:bg-amber-700 text-white text-xs md:text-sm font-semibold py-2 md:py-2.5 rounded-lg transition-colors cursor-pointer">
                              Add to Cart
                            </button>
                          </>
                        ) : (
                          <button
                            disabled
                            className="mt-auto w-full bg-gray-300 text-gray-500 text-xs md:text-sm font-semibold py-2 md:py-2.5 rounded-lg cursor-not-allowed">
                            Out of Stock
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setShowMobileFilter(false)}></div>

            {/* Drawer */}
            <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Filter Content */}
              <div className="p-4">
                <FilterUI
                  filters={filters}
                  setFilters={setFilters}
                  applyFilters={applyFilters}
                  resetFilters={resetFilters}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default function AllProducts() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      }>
      <AllProductsContent />
    </Suspense>
  );
}
