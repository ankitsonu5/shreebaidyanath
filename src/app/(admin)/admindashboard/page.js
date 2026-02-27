"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`);
      if (res.data.users) {
        setUsers(res.data.users);
        setStats((prev) => ({ ...prev, totalUsers: res.data.users.length }));
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`);
      if (res.data.orders) {
        const activeOrders = res.data.orders.filter(
          (order) => order.orderStatus !== "Cancelled",
        );
        setOrders(res.data.orders);
        const totalRevenue = activeOrders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0,
        );
        setStats((prev) => ({
          ...prev,
          totalOrders: activeOrders.length,
          totalRevenue: totalRevenue,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow border-b-4 border-blue-500">
          <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider">
            Total Users
          </h3>
          <p className="text-3xl font-extrabold mt-2 text-gray-800">
            {stats.totalUsers}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow border-b-4 border-green-500">
          <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider">
            Orders
          </h3>
          <p className="text-3xl font-extrabold mt-2 text-gray-800">
            {stats.totalOrders}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow border-b-4 border-purple-500">
          <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider">
            Revenue
          </h3>
          <p className="text-3xl font-extrabold mt-2 text-gray-800">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-hidden border border-gray-100">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Recent Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-100">
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider">
                  Name
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider">
                  Email
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length > 0 ? (
                users.slice(0, 10).map((user) => (
                  <tr key={user._id} className="transition hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium text-gray-800">
                      {user.name || user.username || "—"}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {user.email || "—"}
                    </td>
                    <td className="p-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          user.role === "admin"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                        {user.role || "User"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
