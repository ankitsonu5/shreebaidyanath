"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-800">
            {/* Top Newsletter Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 border-b">
                <div className="flex flex-col sm:flex-row items-center justify-start gap-4 sm:gap-8">
                    <p className="text-base sm:text-lg text-center sm:text-left sm:ml-0 md:ml-12">
                        Signup today and get 10% off on your first purchase
                    </p>

                    <div className="flex w-full sm:w-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full sm:w-48 md:w-64 px-3 sm:px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none text-sm sm:text-base"
                        />
                        <button className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-r-md hover:bg-red-700 text-sm sm:text-base whitespace-nowrap">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Links Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Contact */}
                    <div className="text-center sm:text-left">
                        <h3 className="font-semibold mb-3 sm:mb-4 text-lg">Contact Us</h3>
                        <p className="text-sm leading-6">
                            D-21, Site-B, Ind Area, Surajpur<br />
                            Greater Noida, G.B. Nagar<br />
                            (U.P.) - 201306
                        </p>
                        <p className="mt-3 text-sm break-all sm:break-normal">support@baidyanathayurved.com</p>
                        <p className="text-sm">+91-8822-011-011</p>
                    </div>

                    {/* About */}
                    <div className="text-center sm:text-left">
                        <h3 className="font-semibold mb-3 sm:mb-4 text-lg">About Us</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-red-600">Our Story</Link></li>
                            <li><Link href="#" className="hover:text-red-600">Blogs</Link></li>
                            <li><Link href="#" className="hover:text-red-600">Privacy</Link></li>
                            <li><Link href="#" className="hover:text-red-600">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-red-600">Refund Policy</Link></li>
                            <li><Link href="#" className="hover:text-red-600">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-red-600">Sitemap</Link></li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div className="text-center sm:text-left">
                        <h3 className="font-semibold mb-3 sm:mb-4 text-lg">Customer Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-red-600">Shipping Info</Link></li>
                            <li><Link href="#" className="hover:text-red-600">Refunds &amp; Returns</Link></li>
                            <li><Link href="#" className="hover:text-red-600">Terms &amp; Conditions</Link></li>
                            <li><Link href="#" className="hover:text-red-600">Free Doctor Consultation</Link></li>
                            <li><Link href="#" className="hover:text-red-600">Track Order</Link></li>
                            <li><Link href="#" className="hover:text-red-600">My Account</Link></li>
                        </ul>
                    </div>

                    {/* App & Social */}
                    <div className="text-center sm:text-left">
                        <h3 className="font-semibold mb-3 sm:mb-4 text-lg">Download Our App</h3>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                            alt="Google Play"
                            className="w-36 sm:w-40 mb-4 mx-auto sm:mx-0"
                        />

                        <h4 className="font-semibold mb-2">Follow Us</h4>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
                            <Link href="#" className="hover:text-red-600">Instagram</Link>
                            <Link href="#" className="hover:text-red-600">Facebook</Link>
                            <Link href="#" className="hover:text-red-600">YouTube</Link>
                            <Link href="#" className="hover:text-red-600">LinkedIn</Link>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Copyright */}
            <div className="border-t border-gray-300 py-4 text-center text-xs sm:text-sm text-gray-500 px-4">
                © 2026 Shree Baidyanath. All rights reserved.
            </div>
        </footer>
    );
}
