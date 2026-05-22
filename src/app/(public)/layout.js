"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { navigateTo } from "../lib/navigation";

export default function PublicLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is an admin
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (token && role === "admin") {
      // If admin is logged in, redirect them to the admin dashboard
      navigateTo(router, "/admindashboard", { replace: true });
    }
  }, [router]);

  return (
    <>
      <div>
        <main>{children}</main>
      </div>
    </>
  );
}
