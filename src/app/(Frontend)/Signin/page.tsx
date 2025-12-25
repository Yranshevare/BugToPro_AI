"use client";
import { useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/Signin`, // Works everywhere!
            },
        });

        if (error) console.error(error);
    };
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

    return <button onClick={signInWithGoogle}>Login with Google</button>;
}
