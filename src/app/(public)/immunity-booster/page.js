"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaHeart,
  FaShieldAlt,
} from "react-icons/fa";
import { navigateTo } from "../../lib/navigation";

export default function ImmunityBoosterPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [collectionInfo, setCollectionInfo] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchImmunityProducts();
  }, []);

  const fetchImmunityProducts = async () => {
    setLoading(true);
    try {
      // 1. Fetch all collections
      const colRes = await axios.get(`${API}/collection`);
      if (colRes.data.success) {
        const collections = colRes.data.collections || [];
        // Find the "Immunity Booster" collection (case-insensitive)
        const immunityCol = collections.find(
          (c) =>
            c.collectionName &&
            c.collectionName.toLowerCase() === "immunity booster",
        );

        if (immunityCol) {
          setCollectionInfo(immunityCol);
          // 2. Fetch products in this collection
          const prodRes = await axios.get(
            `${API}/products?productCollection=${immunityCol._id}`,
          );
          if (prodRes.data.success) {
            setProducts(prodRes.data.products || []);
          }
        } else {
          // Fallback if the collection doesn't exist yet: fetch all products
          // and filter by name/description contains immunity
          const prodRes = await axios.get(`${API}/products`);
          if (prodRes.data.success) {
            const allProducts = prodRes.data.products || [];
            const filtered = allProducts.filter(
              (p) =>
                (p.productName &&
                  p.productName.toLowerCase().includes("immunity")) ||
                (p.productDescription &&
                  p.productDescription.toLowerCase().includes("immunity")) ||
                (p.productName &&
                  p.productName.toLowerCase().includes("kumbhprash")) ||
                (p.productName &&
                  p.productName.toLowerCase().includes("basant")),
            );
            setProducts(filtered);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load immunity booster products:", err);
    } finally {
      setLoading(false);
    }
  };

  const getImgUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API}/${path}`;
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

    const price = product.productSellingPrice || product.productPrice;

    if (existingIndex >= 0) {
      storedCart[existingIndex].quantity += qty;
    } else {
      storedCart.push({
        _id: product._id,
        name: product.productName,
        price: price,
        image:
          product.productImage && product.productImage[0]
            ? getImgUrl(product.productImage[0])
            : "",
        quantity: qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(storedCart));
    setQuantities((prev) => ({ ...prev, [product._id]: 1 }));
    alert(`${product.productName} added to cart!`);

    // Dispatch cart updated event to refresh count in Navbar
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }
    }, 0);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fcfbf7] pb-16">
        {/* Luxury Hero Banner */}
        <div className="relative bg-gradient-to-r from-emerald-950 via-emerald-900 to-amber-950 text-white overflow-hidden py-16 md:py-24 px-6 md:px-12 border-b border-amber-500/20">
          {/* Decorative shapes */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-15 pointer-events-none">
            <svg
              viewBox="0 0 100 100"
              fill="currentColor"
              className="text-amber-300 w-full h-full object-cover"
            >
              <path d="M50 0 C65 20 80 40 100 50 C80 60 65 80 50 100 C35 80 20 60 0 50 C20 40 35 20 50 0 Z" />
            </svg>
          </div>

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <FaShieldAlt className="text-sm" /> 100% Authentic Ayurveda
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 leading-tight">
                Shield Your Health with Ayurveda
              </h1>
              <p className="text-emerald-100/90 text-sm md:text-lg max-w-xl font-light leading-relaxed">
                Elevate your body's natural defenses. Discover Shree
                Baidyanath's premium range of Immunity Boosters, crafted
                meticulously with time-tested organic herbs, pure honey, and
                Swarna Bhasma (Gold).
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mx-auto md:mx-0"></div>
            </div>

            {/* Banner graphics */}
            <div className="hidden md:flex justify-center items-center flex-shrink-0 w-80 h-80 rounded-full border-4 border-amber-500/20 bg-emerald-900/50 p-6 shadow-2xl relative">
              <div
                className="absolute inset-4 rounded-full border border-amber-500/10 animate-spin"
                style={{ animationDuration: "20s" }}
              ></div>
              <img
                src={
                  collectionInfo?.collectionImage?.[0]
                    ? getImgUrl(collectionInfo.collectionImage[0])
                    : "/shopbycolletions/immunitybooster.webp"
                }
                alt="Immunity Booster Collections"
                className="w-full h-full object-contain rounded-full shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100/80">
            <div className="flex items-start gap-4 p-2 border-b md:border-b-0 md:border-r border-gray-100">
              <span className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold">
                01
              </span>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Enriched with Gold (Swarna)
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Gold particles boost cellular immunity and promote longevity.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 border-b md:border-b-0 md:border-r border-gray-100">
              <span className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold">
                02
              </span>
              <div>
                <h4 className="font-semibold text-gray-900">
                  100% Natural Active Herbs
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sourced ethically from organic farms directly to clinic.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2">
              <span className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold">
                03
              </span>
              <div>
                <h4 className="font-semibold text-gray-900">Vaidya Approved</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Formulations clinically recommended by Ayurvedic Doctors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-6xl mx-auto px-4 mt-16">
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 border-b border-gray-100 pb-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-950">
              Our Premium Immunity Boosters
            </h2>
            <p className="text-sm text-gray-500">
              {loading
                ? "Loading products..."
                : `Showing ${products.length} elite product(s)`}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-700"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white text-center py-16 px-6 rounded-2xl border border-gray-100 shadow-sm max-w-lg mx-auto">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
                <FaShieldAlt size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                No Products Available
              </h3>
              <p className="text-gray-500 text-sm mt-1 mb-6">
                Our immunity booster products are currently restocking. Please
                check back shortly or explore other solutions!
              </p>
              <button
                onClick={() => navigateTo(router, "/all-products")}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white rounded-lg transition-colors cursor-pointer text-sm font-semibold"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => {
                const selling =
                  product.productSellingPrice || product.productPrice;
                const mrp = product.productMrpPrice || selling;
                const discount =
                  mrp > selling ? Math.round(((mrp - selling) / mrp) * 100) : 0;

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group relative"
                  >
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                        {discount}% OFF
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 text-gray-400 hover:text-red-500 hover:scale-110 flex items-center justify-center transition cursor-pointer">
                      <FaHeart size={14} />
                    </button>

                    {/* Image */}
                    <div
                      onClick={() =>
                        navigateTo(router, `/product/${product._id}`)
                      }
                      className="w-full aspect-[4/3] bg-gradient-to-b from-gray-50/50 to-white overflow-hidden cursor-pointer relative flex items-center justify-center p-4 border-b border-gray-50"
                    >
                      <img
                        src={
                          product.productImage && product.productImage[0]
                            ? getImgUrl(product.productImage[0])
                            : ""
                        }
                        alt={product.productName}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                      />
                      {product.productStock === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                          <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3
                        onClick={() =>
                          navigateTo(router, `/product/${product._id}`)
                        }
                        className="text-base font-bold text-gray-900 line-clamp-2 mb-1.5 cursor-pointer hover:text-emerald-800 transition-colors leading-snug min-h-[44px]"
                      >
                        {product.productName}
                      </h3>

                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                        {product.productDescription ||
                          "Premium Ayurvedic formulation to rejuvenate health, support immunity, and promote overall wellness."}
                      </p>

                      <div className="flex items-baseline gap-2 mb-4 border-t border-gray-50 pt-4">
                        <span className="text-emerald-800 font-extrabold text-xl">
                          ₹{selling}
                        </span>
                        {mrp > selling && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{mrp}
                          </span>
                        )}
                      </div>

                      {product.productStock > 0 ? (
                        <div className="space-y-3">
                          {/* Quantity control */}
                          <div className="flex items-center justify-center gap-3 bg-gray-50/80 p-1.5 rounded-xl border border-gray-100">
                            <button
                              onClick={() => updateQty(product._id, -1)}
                              className="w-8 h-8 rounded-lg bg-white hover:bg-gray-100 border border-gray-200/50 flex items-center justify-center text-gray-700 cursor-pointer shadow-sm transition active:scale-95"
                            >
                              <FaMinus size={10} />
                            </button>
                            <span className="text-sm font-semibold w-8 text-center text-gray-800">
                              {quantities[product._id] || 1}
                            </span>
                            <button
                              onClick={() => updateQty(product._id, 1)}
                              className="w-8 h-8 rounded-lg bg-white hover:bg-gray-100 border border-gray-200/50 flex items-center justify-center text-gray-700 cursor-pointer shadow-sm transition active:scale-95"
                            >
                              <FaPlus size={10} />
                            </button>
                          </div>

                          {/* Add to Cart button */}
                          <button
                            onClick={() => addToCart(product)}
                            className="w-full bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white text-sm font-bold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
                          >
                            <FaShoppingCart size={13} /> Add to Cart
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-200 text-gray-400 text-sm font-bold py-3 rounded-xl cursor-not-allowed text-center"
                        >
                          Out of Stock
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
