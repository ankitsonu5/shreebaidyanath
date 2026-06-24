"use client";

import React from "react";
import {
  FaHome,
  FaUser,
  FaShoppingCart,
  FaSignInAlt,
  FaShoppingBag,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";

// Premium inline SVG icons to replace emojis/generic icons
const getSvgIcon = (label) => {
  switch (label) {
    case "Shop by Collections":
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="3"
            width="7"
            height="7"
            rx="1.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="14"
            y="3"
            width="7"
            height="7"
            rx="1.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="3"
            y="14"
            width="7"
            height="7"
            rx="1.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="14"
            y="14"
            width="7"
            height="7"
            rx="1.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "Shop by Solutions":
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      );
    case "Consult by Expert":
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.5 5v5.5a6.5 6.5 0 0013 0V5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 12v5a3 3 0 006 0v-1"
          />
          <circle cx="17" cy="11" r="2.5" strokeWidth="2" fill="none" />
          <circle cx="4.5" cy="4" r="1" fill="currentColor" />
          <circle cx="17.5" cy="4" r="1" fill="currentColor" />
        </svg>
      );
    case "Immunity Booster":
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      );
    case "All Products":
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      );
    case "Blogs":
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      );
    case "Gallery":
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      );
    case "Track Order":
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      );
    default:
      return null;
  }
};
import { IoChevronDownOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { navigateTo } from "../lib/navigation";

export default function MobileBottomNav({ user, cartCount, handleLogout }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const [collections, setCollections] = React.useState([]);
  const [isCollectionsOpen, setIsCollectionsOpen] = React.useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL;

  const fetchCollections = async () => {
    if (collections.length > 0) return;
    try {
      const res = await axios.get(`${API}/collection`);
      if (res.data.success) {
        setCollections(res.data.collections);
      }
    } catch (err) {
      console.error("Collections fetch failed:", err);
    }
  };

  const navItems = [
    { label: "Home", icon: FaHome, path: "/" },
    { label: "Shop", icon: FaShoppingBag, path: "/all-products" },
    {
      label: "Menu",
      icon: HiMenu,
      onClick: () => {
        setIsMenuOpen(true);
        fetchCollections();
      },
      isActive: isMenuOpen,
    },
    {
      label: user ? "Account" : "Login",
      icon: user ? FaUser : FaSignInAlt,
      path: user ? null : "/signin",
      onClick: user ? () => setIsProfileMenuOpen(true) : null,
    },
    { label: "Cart", icon: FaShoppingCart, path: "/cart", showBadge: true },
  ];

  const profileOptions = [
    { label: "My Orders", icon: FaShoppingBag, path: "/my-orders" },
    { label: "Edit Profile", icon: FaUser, path: "/edit-user-info" },
  ];

  return (
    <>
      {/* Main Menu Bottom Sheet */}
      {isMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-[110] flex items-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative w-full bg-white rounded-t-[2.5rem] max-h-[90vh] overflow-y-auto transition-transform duration-500 shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white px-8 pt-8 pb-4 flex items-center justify-between z-20">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                  Explore
                </h3>
                <div className="h-1 w-10 bg-green-500 rounded-full mt-1"></div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            <div className="px-8 pb-12 space-y-6">
              {/* Collections Section */}
              <div className="bg-gray-50 rounded-3xl p-2 border border-gray-100">
                <button
                  onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                  className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 flex items-center justify-center rounded-2xl">
                      {getSvgIcon("Shop by Collections")}
                    </div>
                    <span className="font-bold text-gray-800 text-lg">
                      Shop by Collections
                    </span>
                  </div>
                  <IoChevronDownOutline
                    className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isCollectionsOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isCollectionsOpen && (
                  <div className="mt-2 grid grid-cols-1 gap-1 px-2 pb-2">
                    {collections.length > 0 ? (
                      collections.map((col) => (
                        <button
                          key={col._id}
                          onClick={() => {
                            try {
                              if (col._id) {
                                navigateTo(
                                  router,
                                  `/all-products?collection=${col._id}`,
                                );
                                setIsMenuOpen(false);
                              }
                            } catch (err) {
                              console.error("Navigation error:", err);
                            }
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white text-gray-600 font-medium transition-all group"
                        >
                          <span>{col.collectionName}</span>
                          <FaChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-400 text-sm italic">
                        Loading collections...
                      </div>
                    )}
                    <button
                      onClick={() => {
                        try {
                          navigateTo(router, "/all-collections");
                          setIsMenuOpen(false);
                        } catch (err) {
                          console.error("Navigation error:", err);
                        }
                      }}
                      className="w-full mt-2 p-3 text-center text-green-600 font-bold text-sm bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                    >
                      View All Collections
                    </button>
                  </div>
                )}
              </div>

              {/* Main Links */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    label: "Shop by Solutions",
                    path: "/shop-by-solutions",
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    label: "Consult by Expert",
                    path: "consultbyExpert",
                    color: "bg-purple-50 text-purple-600",
                  },
                  {
                    label: "Immunity Booster",
                    path: "/immunity-booster",
                    color: "bg-pink-50 text-pink-600",
                  },
                  {
                    label: "All Products",
                    path: "/all-products",
                    color: "bg-orange-50 text-orange-600",
                  },
                  {
                    label: "Blogs",
                    path: "/blog",
                    color: "bg-teal-50 text-teal-600",
                  },
                  {
                    label: "Gallery",
                    path: "/gallery",
                    color: "bg-yellow-50 text-yellow-600",
                  },
                  {
                    label: "Track Order",
                    path: "#",
                    color: "bg-indigo-50 text-indigo-600",
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      try {
                        if (item.path && item.path !== "#") {
                          navigateTo(router, item.path);
                          setIsMenuOpen(false);
                        }
                      } catch (err) {
                        console.error("Navigation error:", err);
                      }
                    }}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all group"
                  >
                    <div
                      className={`w-12 h-12 ${item.color} flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform`}
                    >
                      {getSvgIcon(item.label)}
                    </div>
                    <span className="font-bold text-gray-700 text-lg">
                      {item.label}
                    </span>
                    <FaChevronRight className="w-5 h-5 text-gray-300 ml-auto group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Menu Popup for Mobile */}
      {isProfileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-[110] flex items-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsProfileMenuOpen(false)}
          />
          <div className="relative w-full bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">My Account</h3>
              <button
                onClick={() => setIsProfileMenuOpen(false)}
                className="p-2 bg-gray-100 rounded-full text-gray-500"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {profileOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => {
                    try {
                      if (option.path) {
                        navigateTo(router, option.path);
                        setIsProfileMenuOpen(false);
                      }
                    } catch (err) {
                      console.error("Navigation error:", err);
                    }
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-green-50 text-gray-700 font-medium transition-colors border border-transparent hover:border-green-100"
                >
                  <div className="w-10 h-10 bg-green-50 text-green-600 flex items-center justify-center rounded-full">
                    <option.icon className="w-5 h-5" />
                  </div>
                  <span>{option.label}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setIsProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 text-red-500 font-medium transition-colors border border-transparent hover:border-red-100"
              >
                <div className="w-10 h-10 bg-red-50 text-red-500 flex items-center justify-center rounded-full">
                  <FaSignOutAlt className="w-5 h-5" />
                </div>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] h-14">
        <div className="flex justify-around items-center h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => {
                  try {
                    if (item.onClick) {
                      item.onClick();
                    } else if (item.path && item.path !== "#") {
                      navigateTo(router, item.path);
                    }
                  } catch (err) {
                    console.error("Navigation error:", err);
                  }
                }}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                  isActive || item.isActive
                    ? "text-green-600 scale-110"
                    : "text-gray-500 hover:text-green-500"
                }`}
              >
                <div className="relative">
                  <item.icon
                    className={`w-5 h-5 ${isActive ? "fill-green-50" : ""}`}
                  />
                  {item.showBadge && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
