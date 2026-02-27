"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";

const slugToTag = {
  "deals-of-the-day": { tag: "deal", title: "Deals of the Day" },
  "herbal-juices": { tag: "herbal", title: "Herbal Juices" },
  "best-sellers": { tag: "bestseller", title: "Best Sellers" },
  "new-launches": { tag: "new", title: "New Launches" },
  "popular-products": { tag: "popular", title: "Popular Products" },
};

export default function ProductsByTag() {
  const { slug } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;
  const config = slugToTag[slug] || { tag: slug, title: slug };

  useEffect(() => {
    fetchProducts();
  }, [slug]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      const data = await res.data;
      if (data.success) {
        const filtered = data.products.filter(
          (p) => p.productTag === config.tag,
        );
        setProducts(filtered);
      }
    } catch (err) {
      console.error("Products fetch failed:", err);
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
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span
                onClick={() => router.push("/")}
                className="hover:text-amber-600 cursor-pointer transition-colors">
                Home
              </span>
              <span>›</span>
              <span className="text-gray-800 font-medium">{config.title}</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white py-8 md:py-12 border-b border-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
              {config.title}
            </h1>
            <div className="w-20 h-1 bg-amber-600 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition cursor-pointer">
                Go Home
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => (
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
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
