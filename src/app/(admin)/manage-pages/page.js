"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { navigateTo } from "../../lib/navigation";
import axios from "axios";

export default function ManagePagesCMS() {
  const router = useRouter();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // The predefined pages we allow admin to edit
  const PREDEFINED_PAGES = [
    { slug: "immunity-booster", defaultName: "Immunity Booster" },
    { slug: "contact", defaultName: "Contact Us" },
    { slug: "blog", defaultName: "Blogs" },
    { slug: "gallery", defaultName: "Gallery" },
    { slug: "consultations", defaultName: "Expert Consultations" },
  ];

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/page-cms`);
      if (res.data.success) {
        setPages(res.data.pages || []);
      }
    } catch (err) {
      console.error("Failed to fetch pages:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPageData = (slug) => {
    return pages.find((p) => p.slug === slug);
  };

  const getImgUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API}/${path}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Page Contents</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Banner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {PREDEFINED_PAGES.map((pageDef) => {
                const dbPage = getPageData(pageDef.slug);
                return (
                  <tr key={pageDef.slug} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {dbPage?.pageName || pageDef.defaultName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">/{pageDef.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {dbPage?.bannerImage ? (
                        <img
                          src={getImgUrl(dbPage.bannerImage)}
                          alt="Banner"
                          className="h-10 w-20 object-cover rounded border border-gray-200"
                        />
                      ) : (
                        <span className="text-xs text-gray-400 italic">No custom banner</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigateTo(router, `/manage-pages/edit/${pageDef.slug}`)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded transition-colors"
                      >
                        <FaEdit /> Edit Content
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
