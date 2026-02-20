"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

export default function AdminDashboard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
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
            <li
              className="hover:bg-blue-600 p-1 rounded cursor-pointer"
              onClick={() => router.push("/admindashboard")}>
              Dashboard
            </li>
            <li className="hover:bg-blue-600 p-1 rounded cursor-pointer">
              Users
            </li>
            <li
              className="hover:bg-blue-600 p-1 rounded cursor-pointer"
              onClick={() => router.push("/products")}>
              Products
            </li>
            <li className="hover:bg-blue-600 p-1 rounded cursor-pointer">
              Orders
            </li>
            <li className="hover:bg-blue-600 p-1 rounded">
              <button
                onClick={() => setOpen(!open)}
                className="cursor-pointer w-full text-left">
                <div className="flex items-center justify-between">
                  Masters
                  <MdArrowDropDown
                    size={25}
                    style={{
                      transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </div>
              </button>
              {open && (
                <div className="p-2 ml-2 border-l border-blue-400 mt-2 space-y-2">
                  <p
                    className="p-1 hover:bg-blue-600 rounded cursor-pointer text-sm"
                    onClick={() => router.push("/collections")}>
                    Collections
                  </p>
                  <p
                    className="p-1 hover:bg-blue-600 rounded cursor-pointer text-sm"
                    onClick={() => router.push("/banners")}>
                    Banners
                  </p>
                </div>
              )}
            </li>
            <li className="hover:bg-blue-600 p-1 rounded cursor-pointer">
              Settings
            </li>
            <li
              className="hover:bg-red-500 p-1 rounded cursor-pointer"
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
            </div>
          </div>
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-5 rounded-xl shadow border-b-4 border-blue-500">
                <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider">
                  Total Users
                </h3>
                <p className="text-3xl font-extrabold mt-2 text-gray-800">
                  1,240
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow border-b-4 border-green-500">
                <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider">
                  Orders
                </h3>
                <p className="text-3xl font-extrabold mt-2 text-gray-800">
                  320
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow border-b-4 border-purple-500">
                <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider">
                  Revenue
                </h3>
                <p className="text-3xl font-extrabold mt-2 text-gray-800">
                  ₹45,000
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow p-6 overflow-hidden border border-gray-100">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Recent Users
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-y border-gray-100">
                      <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="transition hover:bg-gray-50">
                      <td className="p-4 text-sm font-medium text-gray-800">
                        Rahul
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        rahul@gmail.com
                      </td>
                      <td className="p-4 text-sm">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">
                          User
                        </span>
                      </td>
                    </tr>
                    <tr className="transition hover:bg-gray-50">
                      <td className="p-4 text-sm font-medium text-gray-800">
                        Amit
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        amit@gmail.com
                      </td>
                      <td className="p-4 text-sm">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">
                          Admin
                        </span>
                      </td>
                    </tr>
                    <tr className="transition hover:bg-gray-50">
                      <td className="p-4 text-sm font-medium text-gray-800">
                        Neha
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        neha@gmail.com
                      </td>
                      <td className="p-4 text-sm">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">
                          User
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
