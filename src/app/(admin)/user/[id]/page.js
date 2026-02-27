"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function ViewUser() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${id}`,
      );
      const data = await res.data;
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8">User not found</div>;
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <div className="flex items-center space-x-6 mb-6">
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full">
              {user.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem label="User ID" value={user._id} />
          <DetailItem label="Phone" value={user.phone || "N/A"} />
          <DetailItem label="Address" value={user.address || "N/A"} />
          <DetailItem label="City" value={user.city || "N/A"} />
          <DetailItem label="State" value={user.state || "N/A"} />
          <DetailItem label="Pincode" value={user.pincode || "N/A"} />
          <DetailItem
            label="Created At"
            value={new Date(user.createdAt).toLocaleString()}
          />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold break-all">{value}</p>
    </div>
  );
}
