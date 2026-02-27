"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaUser, FaShoppingBag } from "react-icons/fa";
import { FaTruck } from "react-icons/fa6";
import { IoChevronDownOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

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
          <li>
            <Link
              href="#"
              className="flex items-center gap-1 hover:text-red-600">
              Shop by Collections <IoChevronDownOutline size={14} />
            </Link>
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
              <Link
                href="#"
                className="flex items-center justify-between px-6 py-3 border-b border-gray-100 hover:bg-gray-50 hover:text-red-600"
                onClick={() => setMenuOpen(false)}>
                Shop by category <IoChevronDownOutline size={14} />
              </Link>
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
