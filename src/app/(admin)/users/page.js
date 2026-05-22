"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { navigateTo } from "../../lib/navigation";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing current user:", err);
      }
    }
  }, []);

  //Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
      const data = await res.data;
      setUsers(data.users || data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //DeleteUsers
  const deleteUser = async (id) => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
      fetchUsers();
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">All Users</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 sm:p-4 text-sm font-bold uppercase text-gray-600">
                  Name
                </th>
                <th className="hidden md:table-cell p-3 sm:p-4 text-sm font-bold uppercase text-gray-600">
                  Email
                </th>
                <th className="p-3 sm:p-4 text-sm font-bold uppercase text-gray-600">
                  Role
                </th>
                <th className="p-3 sm:p-4 text-sm font-bold uppercase text-gray-600 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isSelf = 
                  (currentUser?._id && user._id && currentUser._id === user._id) || 
                  (currentUser?.id && user._id && currentUser.id === user._id) ||
                  (currentUser?._id && user.id && currentUser._id === user.id) ||
                  (currentUser?.id && user.id && currentUser.id === user.id);

                return (
                  <tr
                    key={user._id}
                    className="border-b transition hover:bg-gray-50">
                    <td className="p-3 sm:p-4 text-sm font-medium">
                      {user.name}
                      {isSelf && (
                        <span className="ml-1 text-xs text-blue-600 font-bold">
                          (You)
                        </span>
                      )}
                    </td>
                    <td className="p-3 sm:p-4 text-sm break-all md:break-normal hidden md:table-cell">
                      {user.email}
                    </td>
                    <td className="p-3 sm:p-4 text-sm">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.role === "admin" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="p-3 sm:p-4 text-center flex flex-col sm:flex-row justify-center gap-2">
                      <button
                        onClick={() => {
                          try {
                            navigateTo(router, `/user/${user._id}`);
                          } catch (err) {
                            console.error("Navigation error:", err);
                            navigateTo(null, `/user/${user._id}`, {
                              forceWindowNavigation: true,
                            });
                          }
                        }}
                        className="px-3 py-1 rounded text-xs sm:text-sm shadow-sm transition bg-blue-600 text-white hover:bg-blue-700 active:scale-95 cursor-pointer">
                        View
                      </button>

                      <button
                        onClick={() => deleteUser(user._id)}
                        disabled={isSelf}
                        className={`px-3 py-1 rounded text-xs sm:text-sm shadow-sm transition ${isSelf ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700 active:scale-95 cursor-pointer"}`}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="p-6 text-center">No users found</p>
          )}
        </div>
      )}
    </div>
  );
}
