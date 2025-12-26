"use client";
import Link from "next/link";
import React from "react";

export default function SignInDashboardBut() {
    const user = localStorage.getItem(`sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_NAME}-auth-token`);
    return (
        <div>
            {
                !user ?
                <Link href={"/Auth"} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                    Sign In
                </Link>
                :
                <Link href={"/dashboard"} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                    Dashboard
                </Link>
            }
        </div>
    );
}
