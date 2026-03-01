"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function HomePage() {
  const router = useRouter();
  const [banners, setBanners] = useState([]);
  const [collections, setCollections] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [herbalProducts, setHerbalProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newLaunches, setNewLaunches] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [showAllCollections, setShowAllCollections] = useState(false);
  const [cartItems, setCartItems] = useState({});

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchBanners();
    fetchCollections();
    fetchProducts();
    // Load cart items from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartMap = {};
    storedCart.forEach((item) => {
      cartMap[item._id] = item.quantity;
    });
    setCartItems(cartMap);
  }, []);

  // Auto-slide banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners]);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${API}/banners`);
      const data = await res.data;
      if (data.success) setBanners(data.banners);
    } catch (err) {
      console.error("Banners fetch failed:", err);
    }
  };

  const fetchCollections = async () => {
    try {
      const res = await axios.get(`${API}/collection`);
      const data = await res.data;
      if (data.success) setCollections(data.collections);
    } catch (err) {
      console.error("Collections fetch failed:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      const data = await res.data;
      if (data.success) {
        const all = data.products;
        setDealProducts(all.filter((p) => p.productTag === "deal"));
        setHerbalProducts(all.filter((p) => p.productTag === "herbal"));
        setBestSellers(all.filter((p) => p.productTag === "bestseller"));
        setNewLaunches(all.filter((p) => p.productTag === "new"));
        setPopularProducts(all.filter((p) => p.productTag === "popular"));
      }
    } catch (err) {
      console.error("Products fetch failed:", err);
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
    // Update local cart state
    const cartMap = {};
    storedCart.forEach((item) => {
      cartMap[item._id] = item.quantity;
    });
    setCartItems(cartMap);
    // Reset quantity selector for this product
    setQuantities((prev) => ({ ...prev, [product._id]: 1 }));
    // Notify navbar to update counter
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateCartQty = (product, delta) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = storedCart.findIndex(
      (item) => item._id === product._id,
    );
    if (existingIndex >= 0) {
      storedCart[existingIndex].quantity += delta;
      if (storedCart[existingIndex].quantity <= 0) {
        storedCart.splice(existingIndex, 1);
      }
    }
    localStorage.setItem("cart", JSON.stringify(storedCart));
    const cartMap = {};
    storedCart.forEach((item) => {
      cartMap[item._id] = item.quantity;
    });
    setCartItems(cartMap);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Tag to slug mapping for View All pages
  const tagSlugMap = {
    deal: "deals-of-the-day",
    herbal: "herbal-juices",
    bestseller: "best-sellers",
    new: "new-launches",
    popular: "popular-products",
  };

  // Reusable product section — rectangular card layout
  const ProductSection = ({ title, products, tag }) => {
    if (products.length === 0) return null;
    // On mobile show only 4 items (2 rows of 2-col grid)
    const mobileLimit = 4;
    const showViewAll = products.length > mobileLimit;
    const slug = tagSlugMap[tag] || tag;

    return (
      <section className="bg-gray-50 py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 relative">
            <h2 className="text-xl md:text-4xl font-medium text-gray-900">
              {title}
            </h2>
            {showViewAll && (
              <a
                href={`/products/${slug}`}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-amber-600 font-semibold hover:underline flex items-center gap-1 group cursor-pointer text-xs md:text-base">
                View All{" "}
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {products.slice(0, mobileLimit).map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                <div
                  onClick={() =>
                    (window.location.href = `/product/${product._id}`)
                  }
                  className="w-full aspect-square bg-gray-50 overflow-hidden cursor-pointer">
                  <img
                    src={getImgUrl(
                      product.productImage && product.productImage[0],
                    )}
                    alt={product.productName}
                    className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <p
                    onClick={() =>
                      (window.location.href = `/product/${product._id}`)
                    }
                    className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 mb-1 cursor-pointer hover:text-amber-600 transition-colors">
                    {product.productName}
                  </p>
                  <p className="text-amber-600 font-bold text-base mb-2">
                    ₹{product.productPrice}
                  </p>
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <button
                      onClick={() => updateQty(product._id, -1)}
                      className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700 cursor-pointer transition">
                      −
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">
                      {quantities[product._id] || 1}
                    </span>
                    <button
                      onClick={() => updateQty(product._id, 1)}
                      className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700 cursor-pointer transition">
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-auto w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold py-2 rounded-md transition-colors cursor-pointer">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
            {/* Remaining products only visible on md+ */}
            {products.slice(mobileLimit).map((product) => (
              <div
                key={product._id}
                className="hidden md:flex bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex-col">
                <div
                  onClick={() =>
                    (window.location.href = `/product/${product._id}`)
                  }
                  className="w-full aspect-square bg-gray-50 overflow-hidden cursor-pointer">
                  <img
                    src={getImgUrl(
                      product.productImage && product.productImage[0],
                    )}
                    alt={product.productName}
                    className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <p
                    onClick={() =>
                      (window.location.href = `/product/${product._id}`)
                    }
                    className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 mb-1 cursor-pointer hover:text-amber-600 transition-colors">
                    {product.productName}
                  </p>
                  <p className="text-amber-600 font-bold text-base mb-2">
                    ₹{product.productPrice}
                  </p>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <button
                      onClick={() => updateQty(product._id, -1)}
                      className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700 cursor-pointer transition">
                      −
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">
                      {quantities[product._id] || 1}
                    </span>
                    <button
                      onClick={() => updateQty(product._id, 1)}
                      className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700 cursor-pointer transition">
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-auto w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold py-2 rounded-md transition-colors cursor-pointer">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Get hero and offer banners
  const heroBanners = banners.filter((b) => b.bannerType === "hero");
  const offerBanners = banners.filter((b) => b.bannerType === "offer");

  return (
    <>
      <Navbar />

      {/* Banner Section — Full Width */}
      <section className="w-full">
        {heroBanners.length > 0 && (
          <div className="relative w-full overflow-hidden">
            {heroBanners.map((banner, idx) => (
              <div
                key={banner._id}
                className={`w-full transition-all duration-700 ${
                  idx === currentBanner % heroBanners.length
                    ? "relative opacity-100"
                    : "absolute inset-0 opacity-0"
                }`}>
                <img
                  src={getImgUrl(banner.bannerImage)}
                  alt="banner"
                  className="w-full h-auto block"
                />
              </div>
            ))}
            {heroBanners.length > 1 && (
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {heroBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBanner(idx)}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all cursor-pointer ${
                      idx === currentBanner % heroBanners.length
                        ? "bg-white scale-110"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Baidyanath Section */}
      <section>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-base md:text-2xl font-bold">
              Baidyanath - India's Most Trusted Ayurvedic Brand
            </h2>
          </div>
        </div>
      </section>

      {/* Shop By Collections - Dynamic */}
      {collections.length > 0 && (
        <section className="bg-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-2 relative">
              <h2 className="text-xl md:text-4xl font-bold text-gray-900">
                Shop By Collections
              </h2>
              <div className="w-16 md:w-20 h-1 bg-amber-600 mx-auto rounded-full mt-2"></div>
              <a
                href="/all-collections"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-amber-600 font-semibold hover:underline flex items-center gap-1 group cursor-pointer text-xs md:text-base">
                View All{" "}
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-12 mt-8 md:mt-10">
              {/* First 4 — visible on all screens */}
              {collections.slice(0, 4).map((col) => (
                <div
                  key={col._id}
                  onClick={() =>
                    router.push(`/all-products?collection=${col._id}`)
                  }
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
                  <p className="text-center text-xs md:text-base font-semibold text-gray-800 group-hover:text-amber-700 transition-colors duration-300">
                    {col.collectionName}
                  </p>
                </div>
              ))}
              {/* Rest — hidden on mobile, visible on md+ */}
              {collections.slice(4, 12).map((col) => (
                <div
                  key={col._id}
                  onClick={() =>
                    router.push(`/all-products?collection=${col._id}`)
                  }
                  className="hidden md:flex group flex-col items-center cursor-pointer">
                  <div className="relative w-36 h-36 rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-amber-600 transition-all duration-300 shadow-md group-hover:shadow-xl">
                    <img
                      src={getImgUrl(
                        col.collectionImage && col.collectionImage[0],
                      )}
                      alt={col.collectionName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
                  </div>
                  <p className="text-center text-base font-semibold text-gray-800 group-hover:text-amber-700 transition-colors duration-300">
                    {col.collectionName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Offer Banners */}
      {offerBanners.length > 0 && (
        <section className="bg-white py-4 md:py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-0">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-5 items-stretch justify-center">
              {offerBanners.map((banner) => (
                <div
                  key={banner._id}
                  className="cursor-pointer w-full sm:flex-1 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={getImgUrl(banner.bannerImage)}
                    alt="Offer"
                    className="w-full h-32 sm:h-40 md:h-80 object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Sections - All Dynamic */}
      <ProductSection
        title="Deals of the Day"
        products={dealProducts}
        tag="deal"
      />
      <ProductSection
        title="Herbal Juices"
        products={herbalProducts}
        tag="herbal"
      />
      <ProductSection
        title="Best Sellers"
        products={bestSellers}
        tag="bestseller"
      />
      <ProductSection title="New Launches" products={newLaunches} tag="new" />
      <ProductSection
        title="Popular Products"
        products={popularProducts}
        tag="popular"
      />

      {/* Youtube Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto shadow-2xl rounded-2xl overflow-hidden aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/PWoNp1q8raU"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen></iframe>
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10 pb-4 border-b border-gray-100">
            <div className="flex-1 text-center translate-x-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Blogs
              </h2>
            </div>
            <span
              onClick={() => router.push("/blog")}
              className="text-amber-600 font-semibold hover:underline flex items-center gap-1 group cursor-pointer">
              View all{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 group cursor-pointer">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 shadow-lg">
                <img
                  src="/banner.webp"
                  alt="10 Morning Drinks for Weight Loss"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-4xl font-bold text-red-700 leading-tight group-hover:text-red-800 transition-colors">
                  10 Morning Drinks for Weight Loss
                </h3>
                <p className="text-xl md:text-2xl font-medium text-gray-700 border-l-4 border-amber-600 pl-4 py-1">
                  Reduce Belly Fat Naturally at Home
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8 divide-y divide-gray-100">
              {[
                {
                  title:
                    "Broccoli Benefits: Nutritional Value, Health Advantages & How to Eat It Right",
                  date: "FEB 14, 2026",
                  img: "/banner.webp",
                },
                {
                  title:
                    "Ajwain Benefits: 7 Ayurvedic Health Benefits of Carom Seeds",
                  date: "JAN 29, 2026",
                  img: "/banner.webp",
                },
                {
                  title:
                    "How Dimag Paushtik Rasayan Supports Memory and Brain Nourishment",
                  date: "JAN 27, 2026",
                  img: "/banner.webp",
                },
              ].map((blog, idx) => (
                <div
                  key={idx}
                  className={`pt-8 first:pt-0 group cursor-pointer flex gap-4`}>
                  <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-20 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={blog.img}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-sm md:text-md font-bold text-gray-800 leading-tight line-clamp-3 group-hover:text-amber-700 transition-colors">
                      {blog.title}
                    </h4>
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                      {blog.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
