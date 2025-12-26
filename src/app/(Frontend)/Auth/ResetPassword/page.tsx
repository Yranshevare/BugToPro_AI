"use client";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export default function page() {
    const email = useSearchParams().get("email") || "";
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm({ resolver: zodResolver(resetPasswordSchema) });

    const router = useRouter();

    const handlePasswordReset = async (formData: { newPassword: string; confirmPassword: string }) => {
        setIsSubmitting(true);
        const { newPassword, confirmPassword } = formData;
        if(newPassword !== confirmPassword){ 
            setError("confirmPassword", { message: "Password does not match" });
            setIsSubmitting(false);
            return;
        }
        const { data, error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            alert("Error: " + error.message);
        } else {
            console.log(data);
            alert("✅ Password reset! Login with new password.");
            router.push("/Auth");
        }
        console.log("Password reset:", { newPassword });
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                        BugToPro AI
                    </h1>
                    <p className="text-gray-400">Create new password</p>
                </div>

                {/* Card */}
                <form onSubmit={handleSubmit(handlePasswordReset)} className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
                    {/* Reset Password Step */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
                        <p className="text-gray-400 text-sm">
                            We sent a verification code to <span className="text-blue-400">{email}</span>
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                            <input
                                type="password"
                                {...register("newPassword")}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                            {
                                errors.newPassword && (
                                    <p className="text-red-500 text-[12px] mt-1">{errors.newPassword.message}</p>
                                )
                            }
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                {...register("confirmPassword")}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                            {
                                errors.confirmPassword && (
                                    <p className="text-red-500 text-[12px] mt-1">{errors.confirmPassword.message}</p>
                                )
                            }
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`${
                                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            } w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-600/50`}
                        >
                            {isSubmitting ? "Resetting..." : "Reset Password"}
                        </button>

                        <button
                            type="button"
                            disabled={isSubmitting}
                            className="w-full text-gray-400 hover:text-gray-200 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to email
                        </button>
                    </div>
                </form>

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
