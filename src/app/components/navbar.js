"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaUser, FaShoppingBag } from "react-icons/fa";
import { FaTruck } from "react-icons/fa6";
import { IoChevronDownOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            {/* Top Black Bar */}
            <div className="bg-black text-white text-center text-xs sm:text-sm py-2 px-4">
                Extra 5% on prepaid orders. No coupon needed
            </div>

            {/* Main Navbar */}
            <nav className="bg-gray-100 px-4 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-4 flex items-center justify-between relative">

                {/* Logo */}
                <div className="flex items-center">
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
                <ul className="hidden lg:flex items-center gap-6 xl:gap-8 text-[15px] font-medium text-black">
                    <li>
                        <Link href="#" className="flex items-center gap-1 hover:text-red-600">
                            Shop by category <IoChevronDownOutline size={14} />
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="flex items-center gap-1 hover:text-red-600">
                            Shop by Solutions <IoChevronDownOutline size={14} />
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
                        <Link href="#" className="hover:text-red-600">
                            Blogs
                        </Link>
                    </li>
                </ul>

                {/* Right Icons */}
                <div className="flex items-center gap-4 sm:gap-6 text-black text-lg">

                    {/* Track Order - hidden on small screens */}
                    <div className="hidden md:flex items-center gap-2 text-sm cursor-pointer hover:text-red-600">
                        <FaTruck />
                        <span>Track Order</span>
                    </div>

                    <FaSearch className="cursor-pointer hover:text-red-600 text-base sm:text-lg" />
                    <FaUser className="cursor-pointer hover:text-red-600 text-base sm:text-lg" />
                    <FaShoppingBag className="cursor-pointer hover:text-red-600 text-base sm:text-lg" />

                    {/* Hamburger Menu - mobile/tablet only */}
                    <button
                        className="lg:hidden text-2xl cursor-pointer hover:text-red-600"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
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
                                onClick={() => setMenuOpen(false)}
                            >
                                Shop by category <IoChevronDownOutline size={14} />
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#"
                                className="flex items-center justify-between px-6 py-3 border-b border-gray-100 hover:bg-gray-50 hover:text-red-600"
                                onClick={() => setMenuOpen(false)}
                            >
                                Shop by Solutions <IoChevronDownOutline size={14} />
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#"
                                className="block px-6 py-3 border-b border-gray-100 hover:bg-gray-50 hover:text-red-600"
                                onClick={() => setMenuOpen(false)}
                            >
                                Immunity Booster
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#"
                                className="block px-6 py-3 border-b border-gray-100 hover:bg-gray-50 hover:text-red-600"
                                onClick={() => setMenuOpen(false)}
                            >
                                All Products
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#"
                                className="block px-6 py-3 border-b border-gray-100 hover:bg-gray-50 hover:text-red-600"
                                onClick={() => setMenuOpen(false)}
                            >
                                Blogs
                            </Link>
                        </li>
                        {/* Track Order for mobile */}
                        <li className="md:hidden">
                            <Link
                                href="#"
                                className="flex items-center gap-2 px-6 py-3 hover:bg-gray-50 hover:text-red-600"
                                onClick={() => setMenuOpen(false)}
                            >
                                <FaTruck /> Track Order
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
}
