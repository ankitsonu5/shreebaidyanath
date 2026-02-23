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
  const router = useRouter();

  const updateCartCount = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = storedCart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  };

  useEffect(() => {
    updateCartCount();
    // Listen for custom cartUpdated event
    window.addEventListener("cartUpdated", updateCartCount);
    // Listen for storage changes from other tabs
    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <>
      {/* Top Black Bar */}
      <div className="bg-black text-white text-center text-xs sm:text-sm py-2 px-4">
        Extra 5% on prepaid orders. No coupon needed
      </div>

      {/* Main Navbar */}
      <nav className="bg-gray-100 px-4 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-4 flex items-center justify-between relative">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center cursor-pointer">
          <Image
            src="/logo.avif"
            alt="Logo"
            width={160}
            height={50}
            className="w-[120px] sm:w-[140px] md:w-[160px] h-auto"
            priority
          />
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
            <Link href="#" className="hover:text-red-600">
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
          <FaUser
            onClick={() => router.push("/register")}
            className="cursor-pointer hover:text-red-600 text-base sm:text-lg"
          />
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
