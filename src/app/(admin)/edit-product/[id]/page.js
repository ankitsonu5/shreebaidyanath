"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";

export default function EditProduct() {
  const { id } = useParams();
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
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/signin");
      return;
    }
    fetchCollections();
    if (id) fetchProduct();
  }, [id]);

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

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`,
      );
      if (res.data.success) {
        const p = res.data.product;
        setForm({
          productName: p.productName || "",
          productDescription: p.productDescription || "",
          productPrice: p.productPrice || "",
          productStock: p.productStock || "",
          productCollection: p.productCollection || "",
          productTag: p.productTag || "",
        });
        if (p.productImage && p.productImage.length > 0) {
          const imgs = p.productImage.map((img) =>
            img.startsWith("http")
              ? img
              : `${process.env.NEXT_PUBLIC_API_URL}/${img}`,
          );
          setExistingImages(imgs);
        }
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewFiles((prev) => [...prev, ...files]);
      const previews = files.map((f) => URL.createObjectURL(f));
      setNewPreviews((prev) => [...prev, ...previews]);
    }
  };

  const removeExisting = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNew = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
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
    if (form.productCollection) {
      formData.append("productCollection", form.productCollection);
    }
    if (form.productTag) {
      formData.append("productTag", form.productTag);
    }
    newFiles.forEach((file) => {
      formData.append("productImage", file);
    });

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res.data.success) {
        alert("Product updated successfully");
        router.push("/products");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const allImages = [
    ...existingImages.map((src) => ({ type: "existing", src })),
    ...newPreviews.map((src) => ({ type: "new", src })),
  ];

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

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h2>

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

          {/* Images */}
          <div>
            <label className="block mb-2 font-medium">
              Product Images{" "}
              <span className="text-gray-400 text-sm font-normal">
                (first image = main image)
              </span>
            </label>

            {/* Preview Grid */}
            {allImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {allImages.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img.src}
                      alt={`Image ${i + 1}`}
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
                      onClick={() => {
                        if (img.type === "existing") {
                          removeExisting(existingImages.indexOf(img.src));
                        } else {
                          removeNew(newPreviews.indexOf(img.src));
                        }
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <IoClose size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed">
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
