"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEye, FaSearch, FaPhoneAlt, FaEnvelope, FaTimes, FaCalendarAlt, FaPaperPlane } from "react-icons/fa";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setContacts(res.data.contacts || []);
      }
    } catch (err) {
      console.error("Failed to fetch contact inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact message?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API}/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setContacts(contacts.filter(c => c._id !== id));
        alert("Contact message deleted successfully!");
        if (selectedContact?._id === id) {
          setSelectedContact(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete contact:", err);
      alert("Failed to delete contact message.");
    }
  };

  const filteredContacts = contacts.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.email && item.email.toLowerCase().includes(term)) ||
      (item.mobile && item.mobile.toLowerCase().includes(term)) ||
      (item.subject && item.subject.toLowerCase().includes(term)) ||
      (item.message && item.message.toLowerCase().includes(term))
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
          <h1 className="text-2xl font-bold text-gray-800">Customer Contact Inquiries</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage customer queries submitted through the Contact Us form
          </p>
        </div>
        
        {/* Search bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, email, subject..."
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
      ) : filteredContacts.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
            <FaEnvelope size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No messages found</h3>
          <p className="text-gray-500 text-sm">
            {searchTerm ? "Try searching for a different keyword." : "Any customer inquiries will appear here."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Brief Message</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredContacts.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5 text-sm text-gray-800 font-medium">
                          <FaPhoneAlt className="text-amber-600 text-[10px]" /> {item.mobile}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaEnvelope className="text-gray-400 text-[10px]" /> {item.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 max-w-[200px] truncate" title={item.subject}>
                        {item.subject}
                      </p>
                      <span className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                        <FaCalendarAlt /> {formatDate(item.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="truncate max-w-[280px] text-gray-500" title={item.message}>
                        {item.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedContact(item)}
                          title="View Details"
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer">
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
            <span>Showing {filteredContacts.length} inquiry/inquiries</span>
          </div>
        </div>
      )}

      {/* Inquiry Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-amber-600 text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Contact Inquiry Details</h3>
                <p className="text-xs text-amber-100 mt-0.5">Submitted on {formatDate(selectedContact.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-white/80 hover:text-white p-1 hover:bg-amber-700/50 rounded-full transition cursor-pointer">
                <FaTimes size={18} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Sender Info */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Sender Name</span>
                  <span className="text-gray-900 font-semibold">{selectedContact.name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Mobile Number</span>
                  <a href={`tel:${selectedContact.mobile}`} className="text-amber-600 font-semibold hover:underline flex items-center gap-1.5">
                    <FaPhoneAlt size={11} /> {selectedContact.mobile}
                  </a>
                </div>
                <div className="col-span-2 border-t border-gray-200/50 pt-2.5 mt-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Email Address</span>
                  <a href={`mailto:${selectedContact.email}`} className="text-amber-600 font-semibold hover:underline flex items-center gap-1.5">
                    <FaEnvelope size={11} /> {selectedContact.email}
                  </a>
                </div>
              </div>

              {/* Subject */}
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase block tracking-wider mb-1">Subject</span>
                <p className="text-gray-950 font-bold text-base leading-snug">
                  {selectedContact.subject}
                </p>
              </div>

              {/* Message Statement */}
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase block tracking-wider mb-2">Message Body</span>
                <div className="bg-amber-50/30 border border-amber-100/75 text-gray-800 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center gap-3">
              <button
                onClick={() => handleDelete(selectedContact._id)}
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2">
                <FaTrash size={13} /> Delete
              </button>
              
              <div className="flex gap-2">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-sm">
                  <FaPaperPlane size={11} /> Reply by Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
