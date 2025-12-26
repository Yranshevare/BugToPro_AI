"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

const signInSchema = z.object({
    email: z.string().email("provide a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export function SIgnInForm() {
    const {register, handleSubmit,formState: { errors, isSubmitting }} = useForm({ resolver: zodResolver(signInSchema) });

    const handleGoogleAuth = async (formData: { email: string; password: string }) => {
        const { email, password } = formData;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Sign in error:", error.message);
            alert(error.message);
        } else {
            console.log("Signed in:", data.user);
            // router.push("/dashboard");
        }
        console.log("Google OAuth initiated", formData);
    };
    return (
        <form onSubmit={handleSubmit(handleGoogleAuth)} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                    type="email"
                    {...register("email")}
                    className="w-full bg-gray-900  border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2  focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                    type="password"
                    {...register("password")}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="••••••••"
                />
                {errors.password && <p className="text-red-500 text-[12px] mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-400">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-2 focus:ring-blue-600" />
                    <span className="ml-2">Remember me</span>
                </label>
                <Link href={"Auth/ForgetPassword"} type="button" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot password?
                </Link>
            </div>

            <button
                disabled={isSubmitting}
                className={`${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                } w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-600/50`}
            >
                {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
        </form>
    );
}
