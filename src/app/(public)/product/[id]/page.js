"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API}/product/${id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.product);
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  };

  const getImgUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API}/${path}`;
  };

  const addToCart = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = storedCart.findIndex(
      (item) => item._id === product._id,
    );

    if (existingIndex >= 0) {
      storedCart[existingIndex].quantity += quantity;
    } else {
      storedCart.push({
        _id: product._id,
        name: product.productName,
        price: product.productPrice,
        image:
          product.productImage && product.productImage[0]
            ? getImgUrl(product.productImage[0])
            : "",
        quantity: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(storedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setQuantity(1);
  };

  const buyNow = () => {
    addToCart();
    router.push("/cart");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-500 mb-4">
              The product you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition cursor-pointer">
              Go Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const images = product.productImage || [];
  const isOutOfStock = product.productStock === 0;

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
              <span className="text-gray-800 font-medium truncate">
                {product.productName}
              </span>
            </div>
          </div>
        </div>

        {/* Product Content */}
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image Gallery */}
              <div className="p-4 md:p-8 border-b md:border-b-0 md:border-r border-gray-100">
                {/* Main Image */}
                <div className="relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
                  {images.length > 0 ? (
                    <img
                      src={getImgUrl(images[selectedImage])}
                      alt={product.productName}
                      className="w-full h-full object-contain p-4 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image available
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          selectedImage === idx
                            ? "border-amber-500 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}>
                        <img
                          src={getImgUrl(img)}
                          alt={`${product.productName} ${idx + 1}`}
                          className="w-full h-full object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 md:p-8 flex flex-col">
                {/* Title */}
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                  {product.productName}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl md:text-3xl font-bold text-amber-600">
                    ₹{product.productPrice}
                  </span>
                  <span className="text-sm text-gray-500">
                    Inclusive of all taxes
                  </span>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-50 text-red-600">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Out of Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      In Stock ({product.productStock} available)
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-4"></div>

                {/* Description */}
                {product.productDescription && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      {product.productDescription}
                    </p>
                  </div>
                )}

                {/* Spacer to push actions to bottom */}
                <div className="flex-1"></div>

                {/* Quantity + Actions */}
                {!isOutOfStock && (
                  <div className="space-y-4 mt-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-gray-700">
                        Quantity:
                      </span>
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            setQuantity((prev) => Math.max(1, prev - 1))
                          }
                          className="w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer">
                          −
                        </button>
                        <span className="w-12 h-10 flex items-center justify-center text-base font-semibold text-gray-800 border-x border-gray-200">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQuantity((prev) =>
                              Math.min(product.productStock, prev + 1),
                            )
                          }
                          className="w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer">
                          +
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={addToCart}
                        className="flex-1 py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98]">
                        Add to Cart
                      </button>
                      <button
                        onClick={buyNow}
                        className="flex-1 py-3 px-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98]">
                        Buy Now
                      </button>
                    </div>
                  </div>
                )}

                {isOutOfStock && (
                  <div className="mt-6">
                    <button
                      disabled
                      className="w-full py-3 px-6 bg-gray-300 text-gray-500 font-semibold rounded-xl cursor-not-allowed">
                      Out of Stock
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
