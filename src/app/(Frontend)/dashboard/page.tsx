"use client";
import { supabase } from "@/lib/supabaseClient";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function page() {
    // const {data: { user },} = await supabase.auth.getUser();
    // console.log(user);
    const router = useRouter();

    const fetchData = async () => {
        const sessionStr = localStorage.getItem(`sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_NAME}-auth-token`);
        console.log("Stored session:", sessionStr); // Check if full session

        if (!sessionStr) return;

        const session = JSON.parse(sessionStr);
        console.log("Token being sent:", session.access_token); // Should be long JWT

        const res = await fetch("http://localhost:3000/api/chekloginuser", {
            headers: { Authorization: `Bearer ${session.access_token}` },
        });

        console.log("Full response:", await res.json());
    };
    useEffect(() => {
        fetchData();
    });
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Logout error:", error);
        } else {
            console.log("Logged out successfully");
            // Optional: manual redirect (onAuthStateChange will also handle)
            router.push("/");
            router.refresh();
        }
    };
    return (
        <div>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
                Logout
            </button>
        </div>
    );
}
