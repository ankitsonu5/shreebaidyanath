"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEye, FaSearch, FaPhoneAlt, FaEnvelope, FaTimes, FaCalendarAlt } from "react-icons/fa";

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConsult, setSelectedConsult] = useState(null);
  
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/consultations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setConsultations(res.data.consultations || []);
      }
    } catch (err) {
      console.error("Failed to fetch consultations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this consultation request?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API}/consultation/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setConsultations(consultations.filter(c => c._id !== id));
        alert("Consultation request deleted successfully!");
        if (selectedConsult?._id === id) {
          setSelectedConsult(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete consultation:", err);
      alert("Failed to delete consultation request.");
    }
  };

  const filteredConsultations = consultations.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.email && item.email.toLowerCase().includes(term)) ||
      (item.mobile && item.mobile.toLowerCase().includes(term)) ||
      (item.problem && item.problem.toLowerCase().includes(term))
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
      minute: "2-digit"
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-2 sm:p-4">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ayurvedic Expert Consultations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage incoming health consultation requests from patients
          </p>
        </div>
        
        {/* Search bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, email, mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
          />
          <FaSearch className="absolute left-3.5 top-3 text-gray-400 text-sm" />
        </div>
      </div>

      {/* Main List Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredConsultations.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
            <FaSearch size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No consultations found</h3>
          <p className="text-gray-500 text-sm">
            {searchTerm ? "Try searching for a different keyword." : "Any patient consultation requests will appear here."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Brief Problem</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredConsultations.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5 text-sm text-gray-800 font-medium">
                          <FaPhoneAlt className="text-blue-500 text-[10px]" /> {item.mobile}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaEnvelope className="text-gray-400 text-[10px]" /> {item.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="truncate max-w-[240px] text-gray-500" title={item.problem}>
                        {item.problem}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      <span className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-gray-400" /> {formatDate(item.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedConsult(item)}
                          title="View Details"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer">
                          <FaEye size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          title="Delete Request"
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer border-l border-gray-100">
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
            <span>Showing {filteredConsultations.length} request(s)</span>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedConsult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-blue-600 text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Consultation Details</h3>
                <p className="text-xs text-blue-100 mt-0.5">Submitted on {formatDate(selectedConsult.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedConsult(null)}
                className="text-white/80 hover:text-white p-1 hover:bg-blue-700/50 rounded-full transition cursor-pointer">
                <FaTimes size={18} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Patient Name</span>
                  <span className="text-gray-900 font-semibold">{selectedConsult.name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Mobile Number</span>
                  <a href={`tel:${selectedConsult.mobile}`} className="text-blue-600 font-semibold hover:underline flex items-center gap-1.5">
                    <FaPhoneAlt size={11} /> {selectedConsult.mobile}
                  </a>
                </div>
                <div className="col-span-2 border-t border-gray-200/50 pt-2.5 mt-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Email Address</span>
                  <a href={`mailto:${selectedConsult.email}`} className="text-blue-600 hover:underline flex items-center gap-1.5">
                    <FaEnvelope size={11} /> {selectedConsult.email}
                  </a>
                </div>
              </div>

              {/* Problem Statement */}
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase block tracking-wider mb-2">Described Problem / Symptoms</span>
                <div className="bg-amber-50/50 border border-amber-100 text-gray-800 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedConsult.problem}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center gap-3">
              <button
                onClick={() => handleDelete(selectedConsult._id)}
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2">
                <FaTrash size={13} /> Delete Request
              </button>
              
              <div className="flex gap-2">
                <a
                  href={`tel:${selectedConsult.mobile}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-sm">
                  <FaPhoneAlt size={12} /> Call Patient
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
