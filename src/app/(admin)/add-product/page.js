"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

export default function AddProduct() {
  const router = useRouter();
  const [collections, setCollections] = useState([]);
  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productStock: "",
    productCollection: "",
    productTag: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/signin");
      return;
    }
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collection`);
      const data = await res.json();
      if (data.success) {
        setCollections(data.collections);
      }
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("productName", form.productName);
    formData.append("productDescription", form.productDescription);
    formData.append("productPrice", form.productPrice);
    formData.append("productStock", form.productStock);
    formData.append("productCollection", form.productCollection);
    if (form.productTag) {
      formData.append("productTag", form.productTag);
    }
    if (imageFile) {
      formData.append("productImage", imageFile);
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/add-product`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res.data.success) {
        alert("Product added successfully");
        router.push("/products");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8">
        <button
          onClick={() => router.push("/products")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6 group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 border border-gray-200 transition-all">
            <IoIosArrowBack />
          </div>
          <span className="text-sm font-medium">Back to Products</span>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-2 font-medium">Product Name</label>
            <input
              type="text"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              required
              placeholder="e.g. Chyawanprash"
              className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              name="productDescription"
              rows="3"
              value={form.productDescription}
              onChange={handleChange}
              placeholder="Product description..."
              className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Price (₹)</label>
              <input
                type="number"
                name="productPrice"
                value={form.productPrice}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
                className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Stock</label>
              <input
                type="number"
                name="productStock"
                value={form.productStock}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
                className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Collection Dropdown (Dynamic) */}
          <div>
            <label className="block mb-2 font-medium">Collection</label>
            <select
              name="productCollection"
              value={form.productCollection}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
              <option value="">Select Collection</option>
              {collections.map((col) => (
                <option key={col._id} value={col._id}>
                  {col.collectionName}
                </option>
              ))}
            </select>
          </div>

          {/* Product Tag */}
          <div>
            <label className="block mb-2 font-medium">
              Homepage Section Tag
            </label>
            <select
              name="productTag"
              value={form.productTag}
              onChange={handleChange}
              className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
              <option value="">None</option>
              <option value="deal">Deals of the Day</option>
              <option value="bestseller">Best Seller</option>
              <option value="new">New Launch</option>
              <option value="popular">Popular Product</option>
              <option value="herbal">Herbal Juices</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 font-medium">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              required
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer transition-all"
            />
            {preview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-40 object-contain rounded-lg border border-gray-200 bg-gray-50"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed">
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
