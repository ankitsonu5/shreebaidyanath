"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import axios from "axios";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.length === 0) {
      router.push("/cart");
      return;
    }
    setCart(storedCart);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin?redirect=/");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const u = JSON.parse(storedUser);
        setFormData((prev) => ({
          ...prev,
          name: u.name || "",
          email: u.email || "",
        }));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalItems = cart.reduce((t, item) => t + item.quantity, 0);

  const placeOrder = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      const u = storedUser ? JSON.parse(storedUser) : null;

      const orderData = {
        userId: u ? u.id : undefined,
        orderItems: cart.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        totalAmount: totalPrice,
        paymentMethod: "COD",
      };

      const res = await axios.post(`${API}/order`, orderData);

      if (res.data.success) {
        alert("Order placed successfully! 🎉");
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        router.push("/");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm";

  return (
    <>
      <Navbar />

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
            <span
              onClick={() => router.push("/cart")}
              className="hover:text-amber-600 cursor-pointer transition-colors">
              Cart
            </span>
            <span>›</span>
            <span className="text-gray-800 font-medium">Checkout</span>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
            Checkout
          </h1>

          <form onSubmit={placeOrder}>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left — Shipping Details */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold mb-5 text-gray-800 flex items-center gap-2">
                    <span className="w-7 h-7 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    Shipping Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="6-digit pincode"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        rows="2"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House no., Street, Locality"
                        required
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold mb-5 text-gray-800 flex items-center gap-2">
                    <span className="w-7 h-7 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    Order Items ({totalItems})
                  </h2>

                  <div className="divide-y divide-gray-100">
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-800 text-sm">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — Order Summary */}
              <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <hr className="border-gray-100" />
                    <div className="flex justify-between font-bold text-lg text-gray-800">
                      <span>Total</span>
                      <span className="text-amber-600">₹{totalPrice}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-colors cursor-pointer disabled:bg-amber-300 disabled:cursor-not-allowed">
                    {loading ? "Placing Order..." : "Place Order"}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-3">
                    By placing this order, you agree to our Terms & Conditions
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
