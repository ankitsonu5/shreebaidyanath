"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";

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
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((f) => URL.createObjectURL(f));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      alert("Please select at least one image");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("productName", form.productName);
    formData.append("productDescription", form.productDescription);
    formData.append("productPrice", form.productPrice);
    formData.append("productStock", form.productStock);
    if (form.productCollection) {
      formData.append("productCollection", form.productCollection);
    }
    if (form.productTag) {
      formData.append("productTag", form.productTag);
    }
    imageFiles.forEach((file) => {
      formData.append("productImage", file);
    });

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
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8">
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

          {/* Collection Dropdown (Optional) */}
          <div>
            <label className="block mb-2 font-medium">Collection</label>
            <select
              name="productCollection"
              value={form.productCollection}
              onChange={handleChange}
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

          {/* Multiple Image Upload */}
          <div>
            <label className="block mb-2 font-medium">
              Product Images{" "}
              <span className="text-gray-400 text-sm font-normal">
                (first image = main image)
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer transition-all"
            />
            {previews.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className={`w-full h-24 object-cover rounded-lg border-2 ${
                        i === 0 ? "border-blue-500" : "border-gray-200"
                      }`}
                    />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <IoClose size={14} />
                    </button>
                  </div>
                ))}
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
