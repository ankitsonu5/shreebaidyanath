"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("cart")) || [];
    }
    return [];
  });

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
    );
    saveCart(updatedCart);
  };

  const decreaseQty = (id) => {
    const updatedCart = cart
      .map((item) =>
        item._id === id ? { ...item, quantity: item.quantity - 1 } : item,
      )
      .filter((item) => item.quantity > 0);
    saveCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    saveCart(updatedCart);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (cart.length === 0) {
    return (
      <>
      <Navbar />
      <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span
                onClick={() => router.push("/")}
                className="hover:text-amber-600 cursor-pointer transition-colors">
                Home
              </span>
              <span>›</span>
              <span className="text-gray-800 font-medium">Cart</span>
            </div>
          </div>
        </div>
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Your Cart is Empty 🛒
      </div>
      <Footer />
      </>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="bg-white border-b border-gray-100 mb-1">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span
              onClick={() => router.push("/")}
              className="hover:text-amber-600 cursor-pointer transition-colors">
              Home
            </span>
            <span>›</span>
            <span className="text-gray-800 font-medium">Cart</span>
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-4 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1 text-center md:text-left">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">₹{item.price}</p>

                <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="px-3 py-1 bg-gray-200 rounded">
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQty(item._id)}
                    className="px-3 py-1 bg-gray-200 rounded">
                    +
                  </button>
                </div>
              </div>

              <div className="text-center">
                <p className="font-semibold">₹{item.price * item.quantity}</p>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 text-sm mt-2">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between mb-2">
            <span>Total Items:</span>
            <span>{cart.reduce((t, item) => t + item.quantity, 0)}</span>
          </div>

          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total Price:</span>
            <span>₹{totalPrice}</span>
          </div>

          <button onClick={() => router.push("/checkout")}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg cursor-pointer">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
          <Footer />
    </>
  );
}
