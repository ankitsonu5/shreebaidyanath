"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { navigateTo } from "../../lib/navigation";

export default function AdminDashboard() {
  const router = useRouter();
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">
            Total Users
          </h3>
          <p className="text-3xl font-black mt-1 text-gray-900">
            {stats.totalUsers}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">
            Total Orders
          </h3>
          <p className="text-3xl font-black mt-1 text-gray-900">
            {stats.totalOrders}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">
            Total Revenue
          </h3>
          <p className="text-3xl font-black mt-1 text-green-600">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Recent Users</h3>
          <button
            onClick={() => {
              try {
                navigateTo(router, "/users");
              } catch (err) {
                console.error("Navigation error:", err);
                navigateTo(null, "/users", { forceWindowNavigation: true });
              }
            }}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-3 sm:p-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Name
                </th>
                <th className="hidden md:table-cell p-3 sm:p-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Email
                </th>
                <th className="p-3 sm:p-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length > 0 ? (
                users.slice(0, 5).map((user) => (
                  <tr key={user._id} className="transition hover:bg-gray-50/50">
                    <td className="p-3 sm:p-4 text-sm font-medium text-gray-800">
                      {user.name || "—"}
                    </td>
                    <td className="hidden md:table-cell p-3 sm:p-4 text-sm text-gray-500 break-all md:break-normal">
                      {user.email || "—"}
                    </td>
                    <td className="p-3 sm:p-4 text-sm">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.role === "admin" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}
                      >
                        {user.role || "User"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="p-6 text-center text-gray-400 italic text-sm"
                  >
                    No recent users
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
