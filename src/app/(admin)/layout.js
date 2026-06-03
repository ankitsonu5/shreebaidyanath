"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import { navigateTo } from "../lib/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      navigateTo(router, "/signin", { replace: true });
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

  const handleNavigation = (path) => {
    try {
      if (path === pathname) {
        setIsSidebarOpen(false);
        return;
      }

      // Close sidebar first on mobile to avoid layout shifts during navigation
      if (isSidebarOpen) {
        setIsSidebarOpen(false);
      }

      navigateTo(router, path);
    } catch (error) {
      console.error("Admin navigation error:", error);
      // Fallback for critical failure
      navigateTo(null, path, { forceWindowNavigation: true });
    }
  };

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
    if (
      pathname.startsWith("/blogs") ||
      pathname.startsWith("/add-blog") ||
      pathname.startsWith("/edit-blog")
    )
      return "Blogs";
    if (pathname.startsWith("/consultations")) return "Expert Consultations";
    if (pathname.startsWith("/contacts")) return "Contact Inquiries";
    if (pathname.startsWith("/comments")) return "Blog Comments";
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
          className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded shadow-lg focus:outline-none transition-transform active:scale-90"
        >
          <FaBars size={20} />
        </button>
      )}

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-blue-700 text-white p-5 transform transition-transform duration-300 ease-in-out z-40 flex-shrink-0 overflow-y-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center mb-8 border-b border-blue-600 pb-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white p-2 hover:bg-blue-800 rounded transition-colors focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <ul className="space-y-2">
          <li
            className={navItemClass(isActive("/admindashboard"))}
            onClick={() => handleNavigation("/admindashboard")}
          >
            Dashboard
          </li>
          <li
            className={navItemClass(isActive("/users"))}
            onClick={() => handleNavigation("/users")}
          >
            Users
          </li>
          <li
            className={navItemClass(
              isActiveGroup(["/products", "/add-product", "/edit-product"]),
            )}
            onClick={() => handleNavigation("/products")}
          >
            Products
          </li>
          <li
            className={navItemClass(isActiveGroup(["/orders"]))}
            onClick={() => handleNavigation("/orders")}
          >
            Orders
          </li>
          <li
            className={navItemClass(
              isActiveGroup(["/blogs", "/add-blog", "/edit-blog"]),
            )}
            onClick={() => handleNavigation("/blogs")}
          >
            Blogs
          </li>
          <li
            className={navItemClass(isActiveGroup(["/consultations"]))}
            onClick={() => handleNavigation("/consultations")}
          >
            Consultations
          </li>
          <li
            className={navItemClass(isActiveGroup(["/contacts"]))}
            onClick={() => handleNavigation("/contacts")}
          >
            Contact Inquiries
          </li>
          <li
            className={navItemClass(isActiveGroup(["/comments"]))}
            onClick={() => handleNavigation("/comments")}
          >
            Blog Comments
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
              }`}
            >
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
                  onClick={() => handleNavigation("/collections")}
                >
                  Collections
                </p>
                <p
                  className={`p-1.5 rounded cursor-pointer text-sm transition-colors ${
                    isActiveGroup(["/banners", "/add-banner", "/edit-banner"])
                      ? "bg-blue-800 font-semibold"
                      : "hover:bg-blue-600"
                  }`}
                  onClick={() => handleNavigation("/banners")}
                >
                  Banners
                </p>
              </div>
            )}
          </li>
          <li
            className={navItemClass(false)}
            onClick={() => setIsSidebarOpen(false)}
          >
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
              navigateTo(router, "/signin");
            }}
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar */}
        <div className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-20">
          <h2 className="text-lg md:text-xl font-semibold pl-12 md:pl-0 truncate pr-4">
            {getPageTitle()}
          </h2>
          <div className="flex items-center gap-3">
            <span className="font-medium hidden sm:block">Admin</span>
          </div>
        </div>
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
