"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>

                  <td className="p-4 text-center space-x-2">
                    <button
                      onClick={() => router.push(`/user/${user._id}`)}
                      className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer">
                      View
                    </button>

                    <button
                      onClick={() => deleteUser(user._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
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
