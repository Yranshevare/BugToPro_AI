"use client";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

//   useEffect(() => {
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
//       if (event === "SIGNED_IN") {
//         router.push("/dashboard");
//       }
//       if (event === "SIGNED_OUT") {
//         router.push("/");
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [router]);

  return <>{children}</>;
}
