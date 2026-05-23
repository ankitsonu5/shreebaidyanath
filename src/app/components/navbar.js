"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaUser, FaShoppingBag, FaFolder } from "react-icons/fa";
import { FaTruck } from "react-icons/fa6";
import { IoChevronDownOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";
import axios from "axios";
import MobileBottomNav from "./MobileBottomNav";
import { navigateTo } from "../lib/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [showCollections, setShowCollections] = useState(false);
  const [mobCollectionsOpen, setMobCollectionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState({ products: [], collections: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo(router, `/all-products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const getImgUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http")
      ? path
      : `${API}/${path}`;
  };

  // Debounced suggestions fetching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions({ products: [], collections: [] });
      setShowSuggestions(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoadingSuggestions(true);
      setShowSuggestions(true);
      try {
        const res = await axios.get(`${API}/search/suggest?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.data.success) {
          setSuggestions({
            products: res.data.products || [],
            collections: res.data.collections || [],
          });
        }
      } catch (err) {
        console.error("Suggestions fetch failed:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Click outside suggestions behavior
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (
        token &&
        storedUser &&
        storedUser !== "undefined" &&
        storedUser !== "null"
      ) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && typeof parsedUser === "object") {
            setUser(parsedUser);
            if (process.env.NODE_ENV === "development") {
              console.log("Navbar: Session loaded for", parsedUser.name);
            }
            return;
          }
        } catch (err) {
          console.error("Error parsing user data:", err);
        }
      }

      // Fallback: If we have a token but user object is missing,
      // we can at least show a generic profile if we want, but better to stay null
      setUser(null);
    } catch (err) {
      console.error("Error accessing session data:", err);
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setUser(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("userUpdated"));
    }
    navigateTo(router, "/signin");
  };

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

  const updateCartCount = () => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const total = storedCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    } catch (err) {
      console.error("Error updating cart count:", err);
      setCartCount(0);
    }
  };

  const handleUpdateEvents = () => {
    updateCartCount();
    updateUser();
  };

  useEffect(() => {
    updateCartCount();
    updateUser();
    
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("userUpdated", updateUser);
    window.addEventListener("storage", handleUpdateEvents);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("userUpdated", updateUser);
      window.removeEventListener("storage", handleUpdateEvents);
    };
  }, []);

  return (
    <>
      {/* Top Black Bar */}
      {/* <div className="bg-black text-white text-center text-xs sm:text-sm py-2 px-4">
        Extra 5% on prepaid orders. No coupon needed
      </div> */}

      {/* Main Navbar */}
      <nav className="bg-gray-100 px-4 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-4 flex items-center justify-between relative sticky top-0 z-50">
        {/* Logo */}
        <div
          onClick={() => navigateTo(router, "/")}
          className="flex items-center cursor-pointer"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={240}
            height={60}
            className="w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] h-auto rounded-lg shadow-sm"
            priority
          />
          {/* <h1 className="text-2xl font-bold text-red-600">Shree Baidyanath</h1> */}
        </div>

        {/* Center Menu - Desktop */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-6 text-[15px] font-medium text-black">
          <li
            className="relative"
            onMouseEnter={() => {
              setShowCollections(true);
              fetchCollections();
            }}
            onMouseLeave={() => setShowCollections(false)}
          >
            <Link
              href="/all-collections"
              className={`flex items-center gap-1 hover:text-red-600 transition-colors ${showCollections ? "text-red-600" : ""}`}
            >
              Shop by Collections{" "}
              <IoChevronDownOutline
                size={14}
                className={`transition-transform duration-300 ${showCollections ? "rotate-180" : ""}`}
              />
            </Link>

            {/* Dropdown Menu */}
            {showCollections && (
              <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-2xl py-4 border border-white/20 flex flex-col max-h-[400px] overflow-y-auto scrollbar-hide">
                  {collections.length > 0 ? (
                    collections.map((col) => (
                      <Link
                        key={col._id}
                        href={`/all-products?collection=${col._id}`}
                        onClick={() => setShowCollections(false)}
                        className="px-6 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 border-l-4 border-transparent hover:border-red-600 font-medium"
                      >
                        {col.collectionName}
                      </Link>
                    ))
                  ) : (
                    <div className="px-6 py-4 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <Link
                    href="/all-collections"
                    onClick={() => setShowCollections(false)}
                    className="mt-2 mx-6 py-2 text-xs text-center border-t border-gray-100 text-gray-400 hover:text-red-600 transition-colors uppercase tracking-wider font-bold"
                  >
                    View All Collections
                  </Link>
                </div>
              </div>
            )}
          </li>
          <li>
            <Link
              href="/shop-by-solutions"
              className="hover:text-red-600"
            >
              Shop by Solutions
            </Link>
          </li>
          <li>
            <Link href="/consultbyExpert" className="hover:text-red-600">
              Consult by Expert
            </Link>
          </li>
          <li>
            <Link href="/immunity-booster" className="hover:text-red-600">
              Immunity Booster
            </Link>
          </li>
          <li>
            <Link href="/all-products" className="hover:text-red-600">
              All Products
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-red-600">
              Contact Us
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-red-600">
              Blogs
            </Link>
          </li>
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-2 sm:gap-4 text-black text-lg">
          {/* <div className="hidden md:flex items-center gap-2 text-sm cursor-pointer hover:text-red-600">
            <FaTruck size={20} />
          </div> */}

          {/* Expandable Search Input */}
          <div ref={searchRef} className="relative flex items-center">
            {searchOpen ? (
              <form 
                onSubmit={handleSearchSubmit} 
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white px-3 py-2 shadow-xl border border-gray-200 rounded-xl z-50 flex items-center gap-2 w-48 sm:w-64 animate-in fade-in zoom-in-95 duration-200"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchQuery.trim()) setShowSuggestions(true); }}
                  className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full bg-white text-gray-800"
                  autoFocus
                />
                <button type="submit" className="text-gray-600 hover:text-red-600 cursor-pointer p-1">
                  <FaSearch size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 text-sm font-bold"
                >
                  ✕
                </button>

                {/* Auto Suggestions Dropdown */}
                {showSuggestions && (searchQuery.trim().length > 0) && (
                  <div className="absolute right-0 top-full mt-3 w-64 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {loadingSuggestions ? (
                      <div className="flex items-center justify-center py-8 gap-2">
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-gray-500 font-medium">Searching...</span>
                      </div>
                    ) : (
                      <div className="max-h-[380px] overflow-y-auto scrollbar-hide py-3 flex flex-col text-left">
                        {/* Collections Section */}
                        {suggestions.collections.length > 0 && (
                          <div className="mb-3">
                            <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                              <FaFolder className="text-gray-400" size={10} />
                              Collections
                            </div>
                            <div className="flex flex-col">
                              {suggestions.collections.map((col) => (
                                <div
                                  key={col._id}
                                  onClick={() => {
                                    navigateTo(router, `/all-products?collection=${col._id}`);
                                    setSearchOpen(false);
                                    setSearchQuery("");
                                    setShowSuggestions(false);
                                  }}
                                  className="px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer font-medium border-l-4 border-transparent hover:border-red-600 flex items-center justify-between"
                                >
                                  <span>{col.collectionName}</span>
                                  <span className="text-[10px] text-gray-400 font-normal">Collection</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Products Section */}
                        {suggestions.products.length > 0 && (
                          <div className="mb-2">
                            <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-t border-gray-50 pt-3">
                              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                              Products
                            </div>
                            <div className="flex flex-col">
                              {suggestions.products.map((prod) => (
                                <div
                                  key={prod._id}
                                  onClick={() => {
                                    navigateTo(router, `/product/${prod._id}`);
                                    setSearchOpen(false);
                                    setSearchQuery("");
                                    setShowSuggestions(false);
                                  }}
                                  className="px-4 py-2 flex items-center gap-3 hover:bg-red-50 transition-colors cursor-pointer group"
                                >
                                  <div className="w-9 h-9 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 p-1 flex-shrink-0 flex items-center justify-center">
                                    <img
                                      src={getImgUrl(prod.productImage && prod.productImage[0])}
                                      alt={prod.productName}
                                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs md:text-sm font-semibold text-gray-800 truncate group-hover:text-red-600 transition-colors">
                                      {prod.productName}
                                    </p>
                                    <p className="text-[10px] md:text-xs text-red-600 font-bold mt-0.5">
                                      ₹{prod.productSellingPrice || prod.productPrice}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* No matches */}
                        {suggestions.collections.length === 0 && suggestions.products.length === 0 && (
                          <div className="px-4 py-6 text-center text-xs md:text-sm text-gray-400 font-medium">
                            No matches found for "{searchQuery}"
                          </div>
                        )}

                        {/* View all search results */}
                        <div
                          onClick={(e) => {
                            handleSearchSubmit(e);
                            setShowSuggestions(false);
                          }}
                          className="mt-2 mx-4 py-2 border-t border-gray-100 text-center text-[10px] md:text-xs font-bold text-gray-400 hover:text-red-600 cursor-pointer uppercase tracking-wider transition-colors"
                        >
                          View all results for "{searchQuery}"
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form>
            ) : (
              <FaSearch
                onClick={() => setSearchOpen(true)}
                className="cursor-pointer hover:text-red-600 text-base sm:text-lg"
              />
            )}
          </div>
          {user ? (
            <div className="relative">
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1 cursor-pointer hover:text-red-600 text-sm font-medium"
              >
                <FaUser className="text-base sm:text-lg" />
                <span className="hidden sm:inline">Profile</span>
              </div>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {user.name}
                    </p>
                  </div>
                  <Link
                    href="/my-orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    My Orders
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admindashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <FaUser
              onClick={() => navigateTo(router, "/signin")}
              className="cursor-pointer hover:text-red-600 text-base sm:text-lg"
            />
          )}
          <div
            onClick={() => navigateTo(router, "/cart")}
            className="relative cursor-pointer"
          >
            <FaShoppingBag className="hover:text-red-600 text-base sm:text-lg" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-pulse">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </div>
        </div>
      </nav>

      <MobileBottomNav
        user={user}
        cartCount={cartCount}
        handleLogout={handleLogout}
      />
    </>
  );
}
