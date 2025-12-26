"use client";
import { Google } from "@/Components/Auth/Oauth";
import { SIgnInForm } from "@/Components/Auth/SIgnInForm";
import { SIgnUpForm } from "@/Components/Auth/SignUpForm";
import Link from "next/link";
import React, { useState } from "react";

export default function page() {
    const [isSignIn, setIsSignIn] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                        BugToPro AI
                    </h1>
                    <p className="text-gray-400">{isSignIn ? "Welcome back" : "Start your learning journey"}</p>
                </div>

                {/* Auth Card */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
                    {/* Tab Switcher */}
                    <div className="flex gap-2 bg-gray-900 rounded-lg p-1 mb-8">
                        <button
                            onClick={() => setIsSignIn(true)}
                            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                                isSignIn ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200"
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsSignIn(false)}
                            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                                !isSignIn ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Google OAuth Button */}
                    <Google />

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-800 text-gray-400">Or continue with email</span>
                        </div>
                    </div>

                    <div>{isSignIn ? <SIgnInForm /> : <SIgnUpForm />}</div>
                </div>

                {/* Additional Links */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-gray-400 hover:text-gray-200 transition-colors text-sm">← Back to home</Link>
                </div>
            </div>
        </div>
    );
}
