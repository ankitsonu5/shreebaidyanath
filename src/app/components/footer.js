"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const [user, setUser] = useState(null);

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
            return;
          }
        } catch (err) {
          console.error("Error parsing user data in footer:", err);
        }
      }
      setUser(null);
    } catch (err) {
      console.error("Error accessing session data in footer:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    updateUser();
    window.addEventListener("userUpdated", updateUser);
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("userUpdated", updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  return (
    <footer className="bg-gray-100 text-gray-800">
      {/* Top Newsletter Section */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 border-b">
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
      </div> */}

      {/* Footer Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact */}
          <div className="sm:text-left">
            <h3 className="font-semibold mb-3 sm:mb-4 text-lg">Contact Us</h3>
            <p className="text-sm leading-6">
              B.H.U, BLW Road, Sundarpur, Newada, Varanasi, Uttar Pradesh 221005
            </p>
            <p className="mt-3 text-sm break-all sm:break-normal">
              <a
                href="mailto:shreebaidyanathayurvedicclinic@gmail.com"
                className="hover:text-red-600 transition-colors"
              >
                shreebaidyanathayurvedicclinic@gmail.com
              </a>
            </p>
            <p className="text-sm">+91 94735 21779</p>
            <p className="text-sm">+91 93363 25001</p>
          </div>

          {/* About */}
          <div className="sm:text-left">
            <h3 className="font-semibold mb-3 sm:mb-4 text-lg">About Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-red-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-red-600">
                  Blogs
                </Link>
              </li>
              <li>
                {/* <Link href="#" className="hover:text-red-600">
                  Privacy
                </Link> */}
              </li>
              <li>
                {/* <Link href="#" className="hover:text-red-600">
                  Terms of Service
                </Link> */}
              </li>
              <li>
                {/* <Link href="#" className="hover:text-red-600">
                  Refund Policy
                </Link> */}
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-600">
                  Contact Us
                </Link>
              </li>
              <li>
                {/* <Link href="#" className="hover:text-red-600">
                  Sitemap
                </Link> */}
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="sm:text-left">
            <h3 className="font-semibold mb-3 sm:mb-4 text-lg">
              Customer Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/my-orders" className="hover:text-red-600">
                  Shipping Info
                </Link>
              </li>
              {/* <li>
                <Link href="#" className="hover:text-red-600">
                  Refunds &amp; Returns
                </Link>
              </li> */}
              {/* <li>
                <Link href="#" className="hover:text-red-600">
                  Terms &amp; Conditions
                </Link>
              </li> */}
              <li>
                <Link href="/consultbyExpert" className="hover:text-red-600">
                  Consultation by Expert
                </Link>
              </li>
              {/* <li>
                <Link href="#" className="hover:text-red-600">
                  Track Order
                </Link>
              </li> */}
              {user && (
                <li>
                  <Link href="/edit-user-info" className="hover:text-red-600">
                    My Account
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* App & Social */}
          <div className="sm:text-left">
            {/* <h3 className="font-semibold mb-3 sm:mb-4 text-lg">
              Download Our App
            </h3>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              className="w-36 sm:w-40 mb-4 sm:mx-0"
            /> */}

            <h4 className="font-semibold mb-3">Follow Us</h4>
            <div className="flex flex-wrap sm:justify-start gap-3 sm:gap-4">
              <Link
                href="https://www.instagram.com/shreebaidyanathayurveda/"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-all shadow-sm duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={30} />
              </Link>
              <Link
                href="https://www.facebook.com/people/Shree-Baidyanath-Ayurvedic-Clinic/61584680139773/"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-all shadow-sm duration-300"
                aria-label="Facebook"
              >
                <FaFacebook size={30} />
              </Link>
              <Link
                href="https://www.youtube.com/@ShreeBaidyanathAyurvedicClinic"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-all shadow-sm duration-300"
                aria-label="YouTube"
              >
                <FaYoutube size={30} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-300 py-4 text-center text-xs sm:text-sm text-gray-500 px-4">
        © 2026 Shree Baidyanath Ayurvedic Clinic & Retail Varanasi. All rights
        reserved.
      </div>
    </footer>
  );
}
