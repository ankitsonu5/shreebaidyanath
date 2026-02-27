"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API}/order/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        setOrders(
          orders.map((o) =>
            o._id === id
              ? { ...o, orderStatus: res.data.order.orderStatus }
              : o,
          ),
        );
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete(`${API}/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setOrders(orders.filter((o) => o._id !== id));
      }
    } catch (error) {
      alert("Failed to delete order");
    }
    setOpenMenu(null);
  };

  const statusColors = {
    Processing: "bg-yellow-100 text-yellow-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <span className="text-sm text-gray-500">
          {orders.length} total orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
          No orders found yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              {/* Top Row - Info + 3 Dot Menu on Right */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-sm font-mono text-gray-400">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {order.shippingAddress?.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.shippingAddress?.phone} •{" "}
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state} -{" "}
                      {order.shippingAddress?.pincode}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Amount + Status */}
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      <p>
                        {order.orderItems?.length || 0} items •{" "}
                        <span className="font-bold text-gray-800">
                          ₹{order.totalAmount}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {order.paymentMethod}
                      </p>
                    </div>

                    <select
                      value={order.orderStatus}
                      disabled={order.orderStatus === "Cancelled"}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={`text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${order.orderStatus === "Cancelled" ? "bg-gray-50 cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* 3 Dot Menu - Far Right */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === order._id ? null : order._id)
                    }
                    className="text-gray-400 hover:text-black p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-xl">
                    ⋮
                  </button>

                  {openMenu === order._id && (
                    <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow-xl z-50 py-1 border-gray-200">
                      <button
                        onClick={() => {
                          router.push(`/view-order/${order._id}`);
                          setOpenMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer">
                        👁 View Details
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-medium border-t border-gray-100 cursor-pointer">
                        🗑 Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-3">
                  {order.orderItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="text-xs font-medium text-gray-700 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
