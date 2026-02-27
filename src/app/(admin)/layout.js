"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { MdArrowDropDown } from "react-icons/md";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/signin");
    }
  }, []);

  // Auto-open Masters submenu if on a masters sub-page
  useEffect(() => {
    if (
      pathname.startsWith("/collections") ||
      pathname.startsWith("/add-collections") ||
      pathname.startsWith("/edit-collections") ||
      pathname.startsWith("/banners") ||
      pathname.startsWith("/add-banner") ||
      pathname.startsWith("/edit-banner")
    ) {
      setOpen(true);
    }
  }, [pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const isActive = (path) => pathname === path;
  const isActiveGroup = (paths) => paths.some((p) => pathname.startsWith(p));

  // Get page title from pathname
  const getPageTitle = () => {
    if (pathname === "/admindashboard") return "Dashboard";
    if (
      pathname.startsWith("/products") ||
      pathname.startsWith("/add-product") ||
      pathname.startsWith("/edit-product")
    )
      return "Products";
    if (pathname.startsWith("/orders")) return "Orders";
    if (
      pathname.startsWith("/collections") ||
      pathname.startsWith("/add-collections") ||
      pathname.startsWith("/edit-collections")
    )
      return "Collections";
    if (
      pathname.startsWith("/banners") ||
      pathname.startsWith("/add-banner") ||
      pathname.startsWith("/edit-banner")
    )
      return "Banners";
    return "Admin";
  };

  const navItemClass = (active) =>
    `p-2 rounded cursor-pointer transition-colors ${active ? "bg-blue-800 font-semibold" : "hover:bg-blue-600"}`;

  return (
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
        className={`fixed md:static top-0 left-0 h-full w-64 bg-blue-700 text-white p-5 transform transition-transform duration-300 ease-in-out z-40 flex-shrink-0 overflow-y-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white p-1 rounded focus:outline-none">
            ✕
          </button>
        </div>
        <ul className="space-y-2">
          <li
            className={navItemClass(isActive("/admindashboard"))}
            onClick={() => {
              router.push("/admindashboard");
              setIsSidebarOpen(false);
            }}>
            Dashboard
          </li>
          <li
            className={navItemClass(false)}
            onClick={() => {
              router.push("/users");
              setIsSidebarOpen(false);
            }}>
            Users
          </li>
          <li
            className={navItemClass(
              isActiveGroup(["/products", "/add-product", "/edit-product"]),
            )}
            onClick={() => {
              router.push("/products");
              setIsSidebarOpen(false);
            }}>
            Products
          </li>
          <li
            className={navItemClass(isActiveGroup(["/orders"]))}
            onClick={() => {
              router.push("/orders");
              setIsSidebarOpen(false);
            }}>
            Orders
          </li>
          <li className="rounded">
            <button
              onClick={() => setOpen(!open)}
              className={`cursor-pointer w-full text-left p-2 rounded transition-colors ${
                isActiveGroup([
                  "/collections",
                  "/add-collections",
                  "/edit-collections",
                  "/banners",
                  "/add-banner",
                  "/edit-banner",
                ])
                  ? "bg-blue-800 font-semibold"
                  : "hover:bg-blue-600"
              }`}>
              <div className="flex items-center justify-between">
                Masters
                <MdArrowDropDown
                  size={25}
                  style={{
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </div>
            </button>
            {open && (
              <div className="p-2 ml-2 border-l border-blue-400 mt-2 space-y-1">
                <p
                  className={`p-1.5 rounded cursor-pointer text-sm transition-colors ${
                    isActiveGroup([
                      "/collections",
                      "/add-collections",
                      "/edit-collections",
                    ])
                      ? "bg-blue-800 font-semibold"
                      : "hover:bg-blue-600"
                  }`}
                  onClick={() => {
                    router.push("/collections");
                    setIsSidebarOpen(false);
                  }}>
                  Collections
                </p>
                <p
                  className={`p-1.5 rounded cursor-pointer text-sm transition-colors ${
                    isActiveGroup(["/banners", "/add-banner", "/edit-banner"])
                      ? "bg-blue-800 font-semibold"
                      : "hover:bg-blue-600"
                  }`}
                  onClick={() => {
                    router.push("/banners");
                    setIsSidebarOpen(false);
                  }}>
                  Banners
                </p>
              </div>
            )}
          </li>
          <li
            className={navItemClass(false)}
            onClick={() => setIsSidebarOpen(false)}>
            Settings
          </li>
          <li
            className="hover:bg-red-500 p-2 rounded cursor-pointer transition-colors"
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
        {/* Topbar */}
        <div className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-20">
          <h2 className="text-lg md:text-xl font-semibold pl-10 md:pl-0">
            {getPageTitle()}
          </h2>
          <div className="flex items-center gap-3">
            <span className="font-medium hidden sm:block">Admin</span>
          </div>
        </div>
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
