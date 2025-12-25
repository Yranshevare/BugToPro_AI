"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
    const router = useRouter();
    
    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN") {
                // console.log("User logged in", session);
                // localStorage.setItem("supabase_session", JSON.stringify(session));
                router.push("/dashboard");
            }

            if (event === "SIGNED_OUT") {
                console.log("User logged out");
            }
        });
    });
  return (
    <div>
        {children}
    </div>
  );
}