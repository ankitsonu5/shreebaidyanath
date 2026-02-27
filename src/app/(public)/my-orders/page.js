"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }
      const res = await axios.get(`${API}/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API}/cancel/${orderId}`,
        { reason: "User Cancelled" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert(res.data.message || "Order cancelled successfully");
      fetchMyOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const statusColors = {
    Processing: "bg-yellow-100 text-yellow-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  const statusIcons = {
    Processing: "⏳",
    Shipped: "🚚",
    Delivered: "✅",
    Cancelled: "❌",
  };

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
            <span className="text-gray-800 font-medium">My Orders</span>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
            My Orders
          </h1>

          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-6xl mb-4">📦</p>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No orders yet
              </h2>
              <p className="text-gray-500 mb-6">
                You haven't placed any orders yet.
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors cursor-pointer">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Order Header */}
                  <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-mono text-gray-400">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.orderStatus]}`}>
                        {statusIcons[order.orderStatus]} {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="p-5">
                    <div className="divide-y divide-gray-100">
                      {order.orderItems?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 object-cover rounded-lg border border-gray-100"
                            />
                          )}
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

                    {/* Order Footer */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="text-sm text-gray-500">
                        <p>
                          Deliver to:{" "}
                          <span className="text-gray-700 font-medium">
                            {order.shippingAddress?.fullName}
                          </span>{" "}
                          - {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.state}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <div>
                          <p className="text-sm text-gray-500 text-right">
                            Total
                          </p>
                          <p className="text-lg font-bold text-amber-600">
                            ₹{order.totalAmount}
                          </p>
                        </div>
                        {order.orderStatus === "Processing" && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="text-xs text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition-colors font-medium">
                            Cancel Order
                          </button>
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

      <Footer />
    </>
  );
}
