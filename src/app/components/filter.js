"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function FilterUI({
  filters,
  setFilters,
  applyFilters,
  resetFilters,
}) {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/collection`,
        );
        if (res.data.success) {
          setCollections(res.data.collections || []);
        }
      } catch (err) {
        console.error("Failed to fetch collections:", err);
      }
    };
    fetchCollections();
  }, []);

  const tags = [
    { label: "All", value: "" },
    { label: "Bestseller", value: "bestseller" },
    { label: "New Arrival", value: "new" },
    { label: "Popular", value: "popular" },
    { label: "Herbal", value: "herbal" },
    { label: "Deal", value: "deal" },
  ];

  const sortOptions = [
    { label: "Default", value: "" },
    { label: "Price: Low to High", value: "price_low" },
    { label: "Price: High to Low", value: "price_high" },
    { label: "Newest First", value: "newest" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-xs text-amber-600 hover:text-amber-700 font-medium cursor-pointer transition-colors">
          Clear All
        </button>
      </div>

      <div className="w-full h-px bg-gray-200"></div>

      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Search
        </label>
        <input
          type="text"
          value={filters.search || ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search products..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
        />
      </div>

      {/* Collections */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Collection
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <label className="flex items-center gap-2.5 p-1.5 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="collection"
              checked={!filters.productCollection}
              onChange={() => setFilters({ ...filters, productCollection: "" })}
              className="w-4 h-4 accent-amber-600"
            />
            <span className="text-sm text-gray-600">All Collections</span>
          </label>
          {collections.map((col) => (
            <label
              key={col._id}
              className="flex items-center gap-2.5 p-1.5 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="collection"
                checked={filters.productCollection === col._id}
                onChange={() =>
                  setFilters({ ...filters, productCollection: col._id })
                }
                className="w-4 h-4 accent-amber-600"
              />
              <span className="text-sm text-gray-600">
                {col.collectionName}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.value}
              onClick={() => setFilters({ ...filters, productTag: tag.value })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                (filters.productTag || "") === tag.value
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={filters.sort || ""}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent cursor-pointer transition">
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Apply Button */}
      <button
        onClick={applyFilters}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm">
        Apply Filters
      </button>
    </div>
  );
}
