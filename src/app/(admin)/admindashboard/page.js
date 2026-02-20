"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.push("/signin");
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-gray-100">
        {/* Mobile menu button */}
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded shadow-lg focus:outline-none">
            ☰
          </button>
        )}

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
            onClick={toggleSidebar}></div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed md:static top-0 left-0 h-full w-64 bg-blue-700 text-white p-5 transform transition-transform duration-300 ease-in-out z-40 ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <button
              onClick={toggleSidebar}
              className="md:hidden text-white p-1 rounded focus:outline-none">
              ✕
            </button>
          </div>
          <ul className="space-y-4">
            <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
              Dashboard
            </li>
            <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
              Users
            </li>
            <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
              Products
            </li>
            <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
              Orders
            </li>
            <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
              Settings
            </li>
            <li
              className="hover:bg-red-500 p-2 rounded cursor-pointer"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                document.cookie =
                  "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                document.cookie =
                  "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                router.push("/signin");
              }}>
              Logout
            </li>
          </ul>
        </div>
        {/* Main content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Navbar */}
          <div className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-20">
            <h2 className="text-lg md:text-xl font-semibold pl-10 md:pl-0">
              Dashboard
            </h2>
            <div className="flex items-center gap-3">
              <span className="font-medium hidden sm:block">Admin</span>
              <img
                src="https://i.pravatar.cc/40"
                className="rounded-full w-8 h-8"
              />
            </div>
          </div>
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="text-gray-500">Total Users</h3>
                <p className="text-2xl font-bold mt-2">1,240</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="text-gray-500">Orders</h3>
                <p className="text-2xl font-bold mt-2">320</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="text-gray-500">Revenue</h3>
                <p className="text-2xl font-bold mt-2">₹45,000</p>
              </div>
            </div>
            {/* Table */}
            <div className="bg-white rounded-xl shadow p-4 overflow-hidden">
              <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Name
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Email
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b transition hover:bg-gray-50">
                      <td className="p-3 text-sm">Rahul</td>
                      <td className="p-3 text-sm">rahul@gmail.com</td>
                      <td className="p-3 text-sm">User</td>
                    </tr>
                    <tr className="border-b transition hover:bg-gray-50">
                      <td className="p-3 text-sm">Amit</td>
                      <td className="p-3 text-sm">amit@gmail.com</td>
                      <td className="p-3 text-sm">Admin</td>
                    </tr>
                    <tr className="transition hover:bg-gray-50">
                      <td className="p-3 text-sm">Neha</td>
                      <td className="p-3 text-sm">neha@gmail.com</td>
                      <td className="p-3 text-sm">User</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* JS for mobile sidebar */}
    </>
  );
}
