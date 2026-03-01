"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaUser, FaShoppingBag } from "react-icons/fa";
import { FaTruck } from "react-icons/fa6";
import { IoChevronDownOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";
import axios from "axios";
// import ShopbyCollections from "./ShopbyCollections";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [showCollections, setShowCollections] = useState(false);
  const [mobCollectionsOpen, setMobCollectionsOpen] = useState(false);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

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
    window.dispatchEvent(new Event("userUpdated"));
    router.push("/signin");
  };

  const updateCartCount = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = storedCart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
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

  useEffect(() => {
    updateCartCount();
    updateUser();
    // Listen for custom cartUpdated event
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("userUpdated", updateUser);
    // Listen for storage changes from other tabs
    window.addEventListener("storage", () => {
      updateCartCount();
      updateUser();
    });
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("userUpdated", updateUser);
      window.removeEventListener("storage", () => {
        updateCartCount();
        updateUser();
      });
    };
  }, []);

  return (
    <>
      {/* Top Black Bar */}
      {/* <div className="bg-black text-white text-center text-xs sm:text-sm py-2 px-4">
        Extra 5% on prepaid orders. No coupon needed
      </div> */}

      {/* Main Navbar */}
      <nav className="bg-gray-100 px-4 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-4 flex items-center justify-between relative">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center cursor-pointer">
          {/* <Image
            src=""
            alt="Logo"
            width={160}
            height={50}
            className="w-[120px] sm:w-[140px] md:w-[160px] h-auto"
            priority
          /> */}
          <h1 className="text-2xl font-bold text-red-600">Shree Baidyanath</h1>
        </div>

        {/* Center Menu - Desktop */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-6 text-[15px] font-medium text-black">
          <li
            className="relative"
            onMouseEnter={() => {
              setShowCollections(true);
              fetchCollections();
            }}
            onMouseLeave={() => setShowCollections(false)}>
            <Link
              href="/all-collections"
              className={`flex items-center gap-1 hover:text-red-600 transition-colors ${showCollections ? "text-red-600" : ""}`}>
              Shop by Collections{" "}
              <IoChevronDownOutline
                size={14}
                className={`transition-transform duration-300 ${showCollections ? "rotate-180" : ""}`}
              />
            </Link>

            {/* Dropdown Menu */}
            {showCollections && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white/80 backdrop-blur-md rounded-xl shadow-2xl py-4 z-50 border border-white/20 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col max-h-[400px] overflow-y-auto scrollbar-hide">
                  {collections.length > 0 ? (
                    collections.map((col) => (
                      <Link
                        key={col._id}
                        href={`/all-products?collection=${col._id}`}
                        onClick={() => setShowCollections(false)}
                        className="px-6 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 border-l-4 border-transparent hover:border-red-600 font-medium">
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
                    className="mt-2 mx-6 py-2 text-xs text-center border-t border-gray-100 text-gray-400 hover:text-red-600 transition-colors uppercase tracking-wider font-bold">
                    View All Collections
                  </Link>
                </div>
              </div>
            )}
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center gap-1 hover:text-red-600">
              Shop by Solutions <IoChevronDownOutline size={14} />
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-red-600">
              Consult by Expert
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-red-600">
              Immunity Booster
            </Link>
          </li>
          <li>
            <Link href="/all-products" className="hover:text-red-600">
              All Products
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
          {/* Track Order - hidden on small screens */}
          <div className="hidden md:flex items-center gap-2 text-sm cursor-pointer hover:text-red-600">
            <FaTruck size={20} />
          </div>

          <FaSearch className="cursor-pointer hover:text-red-600 text-base sm:text-lg" />
          {user ? (
            <div className="relative">
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1 cursor-pointer hover:text-red-600 text-sm font-medium">
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
                    onClick={() => setProfileOpen(false)}>
                    My Orders
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admindashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setProfileOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1 cursor-pointer">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <FaUser
              onClick={() => router.push("/signin")}
              className="cursor-pointer hover:text-red-600 text-base sm:text-lg"
            />
          )}
          <div
            onClick={() => router.push("/cart")}
            className="relative cursor-pointer">
            <FaShoppingBag className="hover:text-red-600 text-base sm:text-lg" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-pulse">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </div>

          {/* Hamburger Menu - mobile/tablet only */}
          <button
            className="lg:hidden text-2xl cursor-pointer hover:text-red-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu">
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <ul className="flex flex-col text-[15px] font-medium text-black">
            <li>
              <button
                onClick={() => {
                  setMobCollectionsOpen(!mobCollectionsOpen);
                  fetchCollections();
                }}
                className="w-full flex items-center justify-between px-6 py-3 border-b border-gray-100 hover:bg-gray-50 hover:text-red-600 transition-colors">
                <span className="font-medium text-[15px]">
                  Shop by Collections
                </span>
                <IoChevronDownOutline
                  size={16}
                  className={`transition-transform duration-300 ${mobCollectionsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Mobile Collections List */}
              {mobCollectionsOpen && (
                <div className="bg-gray-50 border-b border-gray-100 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-col py-2">
                    {collections.length > 0 ? (
                      collections.map((col) => (
                        <Link
                          key={col._id}
                          href={`/all-products?collection=${col._id}`}
                          onClick={() => {
                            setMenuOpen(false);
                            setMobCollectionsOpen(false);
                          }}
                          className="px-10 py-2.5 text-sm text-gray-600 hover:text-red-600 transition-colors border-l-4 border-transparent hover:border-red-600">
                          {col.collectionName}
                        </Link>
                      ))
                    ) : (
                      <div className="px-10 py-4 flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-400">
                          Loading collections...
                        </span>
                      </div>
                    )}
                    <Link
                      href="/all-collections"
                      onClick={() => setMenuOpen(false)}
                      className="px-10 py-3 text-xs font-bold text-red-600 hover:bg-red-50 uppercase tracking-wider border-t border-gray-100 mt-2">
                      View All Collections →
                    </Link>
                  </div>
                </div>
              )}
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center justify-between px-6 py-3 border-b border-gray-100 hover:bg-gray-50 hover:text-red-600"
                onClick={() => setMenuOpen(false)}>
                Shop by Solutions <IoChevronDownOutline size={14} />
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block px-6 py-3 border-b border-gray-100 hover:bg-gray-50 hover:text-red-600"
                onClick={() => setMenuOpen(false)}>
                Immunity Booster
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block px-6 py-3 border-b border-gray-100 hover:bg-gray-50 hover:text-red-600"
                onClick={() => setMenuOpen(false)}>
                All Products
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block px-6 py-3 border-b border-gray-100 hover:bg-gray-50 hover:text-red-600"
                onClick={() => setMenuOpen(false)}>
                Blogs
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    href="/my-orders"
                    className="block px-6 py-3 border-b border-gray-100 hover:bg-gray-50 hover:text-red-600"
                    onClick={() => setMenuOpen(false)}>
                    My Orders
                  </Link>
                </li>
                {user.role === "admin" && (
                  <li>
                    <Link
                      href="/admindashboard"
                      className="block px-6 py-3 border-b border-gray-100 hover:bg-gray-50 hover:text-red-600"
                      onClick={() => setMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-6 py-3 border-b border-gray-100 hover:bg-red-50 text-red-600 font-medium cursor-pointer">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/signin"
                  className="block px-6 py-3 border-b border-gray-100 hover:bg-gray-50 hover:text-red-600"
                  onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
              </li>
            )}
            {/* Track Order for mobile */}
            <li className="md:hidden">
              <Link
                href="#"
                className="flex items-center gap-2 px-6 py-3 hover:bg-gray-50 hover:text-red-600"
                onClick={() => setMenuOpen(false)}>
                <FaTruck />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
