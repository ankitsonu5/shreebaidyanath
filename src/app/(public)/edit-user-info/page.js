"use client";

import { useEffect, useState } from "react";

export default function EditProfile() {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/me`);
                const data = await res.data;

                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    city: data.city || "",
                    state: data.state || "",
                    pincode: data.pincode || "",
                });

                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    
}