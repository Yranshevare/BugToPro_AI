"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function page() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = async () => {
        setLoading(true);
        if(!email) return;
        
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/Auth/ResetPassword?email=${email}`, // Reset page
        });

        if (error) {
            alert("Error: " + error.message);
        } else {
            alert("Check your email for password reset link!");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                        BugToPro AI
                    </h1>
                    <p className="text-gray-400">Reset your password</p>
                </div>

                {/* Card */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
                    <>
                        {/* Email Step */}
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
                            <p className="text-gray-400 text-sm">No worries, we'll send you reset instructions</p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <button
                                disabled={loading}
                                onClick={handleEmailSubmit}
                                className={`${loading ? "opacity-50 cursor-not-allowed" : ""} w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-600/50`}
                            >
                                Send Reset Link
                            </button>

                            <button
                                disabled={loading}
                                onClick={() => window.history.back()}
                                className={`w-full text-gray-400 hover:text-gray-200 transition-colors text-sm flex items-center justify-center gap-2`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to sign in
                            </button>
                        </div>
                    </>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Need help? <button className="text-blue-400 hover:text-blue-300 transition-colors">Contact Support</button>
                    </p>
                </div>
            </div>
        </div>
    );
}
