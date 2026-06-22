"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaArrowLeft, FaSave, FaImage } from "react-icons/fa";
import { navigateTo } from "../../../../lib/navigation";
import Image from "next/image";

export default function EditPageCMS({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const [form, setForm] = useState({
    pageName: "",
    heroHeading: "",
    heroSubheading: "",
  });
  
  const [bannerImage, setBannerImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // Set default page names if starting fresh
  const defaultNames = {
    "immunity-booster": "Immunity Booster",
    "contact": "Contact Us",
    "blog": "Blogs",
    "gallery": "Gallery",
    "consultations": "Expert Consultations"
  };

  useEffect(() => {
    fetchPageData();
  }, [slug]);

  const fetchPageData = async () => {
    try {
      const res = await axios.get(`${API}/page-cms/${slug}`);
      if (res.data.success && res.data.page) {
        const p = res.data.page;
        setForm({
          pageName: p.pageName || defaultNames[slug] || slug,
          heroHeading: p.heroHeading || "",
          heroSubheading: p.heroSubheading || "",
        });
        if (p.bannerImage) {
          setPreview(p.bannerImage.startsWith("http") ? p.bannerImage : `${API}/${p.bannerImage}`);
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // Page doesn't exist yet, that's fine, we will create it on save
        setForm(prev => ({ ...prev, pageName: defaultNames[slug] || slug }));
      } else {
        console.error("Failed to fetch page data:", err);
      }
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("pageName", form.pageName);
    formData.append("heroHeading", form.heroHeading);
    formData.append("heroSubheading", form.heroSubheading);
    
    if (bannerImage) {
      formData.append("bannerImage", bannerImage);
    }

    try {
      const res = await axios.put(`${API}/page-cms/${slug}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        alert("Page content updated successfully!");
        navigateTo(router, "/manage-pages");
      }
    } catch (err) {
      console.error("Failed to update page:", err);
      alert(err.response?.data?.message || "Failed to update page");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
        <button
          onClick={() => navigateTo(router, "/manage-pages")}
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Content: {form.pageName}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Internal Page Name (Admin Only)
              </label>
              <input
                type="text"
                name="pageName"
                value={form.pageName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Heading (Title)
              </label>
              <input
                type="text"
                name="heroHeading"
                value={form.heroHeading}
                onChange={handleChange}
                placeholder="e.g. Shield Your Health with Ayurveda"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Subheading (Description)
              </label>
              <textarea
                name="heroSubheading"
                value={form.heroSubheading}
                onChange={handleChange}
                rows="4"
                placeholder="Brief description appearing under the main title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
              ></textarea>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Background Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors relative h-64 flex flex-col justify-center items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {preview ? (
                <div className="w-full h-full relative rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full">
                      <FaImage /> Change Image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <FaImage size={48} className="mb-2 text-gray-300" />
                  <p className="text-sm font-medium">Click or drag image here</p>
                  <p className="text-xs mt-1">Recommended: 1920x600 px</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaSave />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
