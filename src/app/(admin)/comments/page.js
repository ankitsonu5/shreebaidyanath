"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTrash,
  FaEye,
  FaSearch,
  FaEnvelope,
  FaTimes,
  FaCalendarAlt,
  FaBlog,
  FaGlobe,
} from "react-icons/fa";

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/admin/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setComments(res.data.comments || []);
      }
    } catch (err) {
      console.error("Failed to fetch blog comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this comment?",
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API}/admin/comment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setComments(comments.filter((c) => c._id !== id));
        alert("Comment deleted successfully!");
        if (selectedComment?._id === id) {
          setSelectedComment(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment.");
    }
  };

  const filteredComments = comments.filter((item) => {
    const term = searchTerm.toLowerCase();
    const blogTitle = item.blogId?.title || "";
    return (
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.email && item.email.toLowerCase().includes(term)) ||
      (item.comment && item.comment.toLowerCase().includes(term)) ||
      blogTitle.toLowerCase().includes(term)
    );
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-2 sm:p-4">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Blog Comment Moderation
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review, inspect, and delete user replies posted on articles
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by article, author, text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition"
          />
          <FaSearch className="absolute left-3.5 top-3 text-gray-400 text-sm" />
        </div>
      </div>

      {/* Main List Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
            <FaBlog size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No comments found
          </h3>
          <p className="text-gray-500 text-sm">
            {searchTerm
              ? "Try searching for a different keyword."
              : "Any submitted blog replies will appear here."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">Article</th>
                  <th className="px-6 py-4">Commenter</th>
                  <th className="px-6 py-4">Comment Text</th>
                  <th className="px-6 py-4">Submitted On</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredComments.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      <div
                        className="max-w-[200px] truncate"
                        title={item.blogId?.title || "Deleted Article"}
                      >
                        {item.blogId?.title || (
                          <span className="text-red-500 italic">
                            Deleted Article
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 block font-normal mt-0.5 max-w-[200px] truncate">
                        {item.blogId?.slug || ""}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-gray-800">
                          {item.name}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <FaEnvelope className="text-gray-400 text-[10px]" />{" "}
                          {item.email}
                        </span>
                        {item.website && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <FaGlobe className="text-gray-400 text-[10px]" />{" "}
                            {item.website}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="truncate max-w-[300px] text-gray-600"
                        title={item.comment}
                      >
                        {item.comment}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <FaCalendarAlt /> {formatDate(item.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedComment(item)}
                          title="View Details"
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                        >
                          <FaEye size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          title="Delete Comment"
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer border-l border-gray-100"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50/50 px-6 py-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
            <span>Showing {filteredComments.length} comment(s)</span>
          </div>
        </div>
      )}

      {/* Comment Details Modal */}
      {selectedComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-amber-600 text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Comment Details</h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  Posted on {formatDate(selectedComment.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedComment(null)}
                className="text-white/80 hover:text-white p-1 hover:bg-amber-700/50 rounded-full transition cursor-pointer"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Blog Info */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider mb-1">
                  Article Context
                </span>
                <span className="text-gray-900 font-bold flex items-center gap-2">
                  <FaBlog className="text-amber-600 text-sm" />{" "}
                  {selectedComment.blogId?.title || "Deleted Article"}
                </span>
              </div>

              {/* Sender Info */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                    Commenter Name
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {selectedComment.name}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedComment.email}`}
                    className="text-amber-600 font-semibold hover:underline flex items-center gap-1.5 truncate"
                  >
                    <FaEnvelope size={11} /> {selectedComment.email}
                  </a>
                </div>
                {selectedComment.website && (
                  <div className="col-span-2 border-t border-gray-200/50 pt-2.5 mt-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                      Website
                    </span>
                    <a
                      href={
                        selectedComment.website.startsWith("http")
                          ? selectedComment.website
                          : `https://${selectedComment.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 font-semibold hover:underline flex items-center gap-1.5"
                    >
                      <FaGlobe size={11} /> {selectedComment.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Message Statement */}
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase block tracking-wider mb-2">
                  Comment Message
                </span>
                <div className="bg-amber-50/30 border border-amber-100/75 text-gray-800 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedComment.comment}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end items-center gap-3">
              <button
                onClick={() => handleDelete(selectedComment._id)}
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2"
              >
                <FaTrash size={13} /> Delete Comment
              </button>
              <button
                onClick={() => setSelectedComment(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
