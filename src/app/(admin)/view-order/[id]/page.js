"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function ViewOrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API}/order/${id}`);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    Processing: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Shipped: "bg-blue-100 text-blue-700 border-blue-200",
    Delivered: "bg-green-100 text-green-700 border-green-200",
    Cancelled: "bg-red-100 text-red-700 border-red-200",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 text-lg">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 text-lg">Order not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
          <p className="text-sm text-gray-400 font-mono mt-1">
            ID: {order._id}
          </p>
        </div>
        <span
          className={`text-sm font-semibold px-4 py-2 rounded-full border ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
          {order.orderStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Shipping Address
          </h2>
          <div className="space-y-3">
            <InfoRow label="Name" value={order.shippingAddress?.fullName} />
            <InfoRow label="Phone" value={order.shippingAddress?.phone} />
            <InfoRow
              label="Email"
              value={order.shippingAddress?.email || "N/A"}
            />
            <InfoRow label="Address" value={order.shippingAddress?.address} />
            <InfoRow label="City" value={order.shippingAddress?.city} />
            <InfoRow label="State" value={order.shippingAddress?.state} />
            <InfoRow label="Pincode" value={order.shippingAddress?.pincode} />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>
          <div className="space-y-3">
            <InfoRow
              label="Order Date"
              value={new Date(order.createdAt).toLocaleString()}
            />
            <InfoRow label="Payment Method" value={order.paymentMethod} />
            <InfoRow label="Status" value={order.orderStatus} />
            <InfoRow
              label="Total Items"
              value={`${order.orderItems?.length || 0} items`}
            />
            <div className="flex justify-between pt-3 border-t border-gray-100">
              <span className="font-bold text-gray-800">Total Amount</span>
              <span className="font-bold text-lg text-amber-600">
                ₹{order.totalAmount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Order Items ({order.orderItems?.length || 0})
        </h2>
        <div className="divide-y divide-gray-100">
          {order.orderItems?.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Qty: {item.quantity} × ₹{item.price}
                </p>
              </div>
              <p className="font-semibold text-gray-800">
                ₹{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Info (if user linked) */}
      {order.userId && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Customer Info
          </h2>
          <div className="space-y-3">
            <InfoRow label="Name" value={order.userId.name} />
            <InfoRow label="Email" value={order.userId.email} />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium text-right">{value}</span>
    </div>
  );
}
