import { supabase } from "@/lib/supabaseClient";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const signInSchema = z.object({
    name: z.string("please enter your name"),
    email: z.string().email("provide a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export function SIgnUpForm() {
    const [isSignInComplete, setIsSignInComplete] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({ resolver: zodResolver(signInSchema) });

    const handleGoogleAuth = async (formData: { email: string; password: string; name: string; confirmPassword: string }) => {
        const { email, password, name, confirmPassword } = formData;
        if (password !== confirmPassword) {
            setError("confirmPassword", { message: "Password does not match" });
            return;
        }
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                },
            },
        });

        if (error) {
            console.error("Sign up error:", error.message);
            // alert(error.message);
            setError("root", { message: "error while signing up" });
        } else {
            console.log("Check email for confirmation:", data);
            // alert("Check your email to confirm!");
            setIsSignInComplete(true);
        }

        console.log("Google OAuth initiated", formData);
    };
    if(isSignInComplete){
        return(
             <p className="block text-lg font-medium text-gray-300 text-center">Check your email to confirm!</p>
        )
    }
    return (
        <form onSubmit={handleSubmit(handleGoogleAuth)} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                    type="text"
                    {...register("name")}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-[12px] mt-1">{errors.name.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                    type="email"
                    {...register("email")}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
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

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                    type="password"
                    {...register("confirmPassword")}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-red-500 text-[12px] mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button
                disabled={isSubmitting}
                className={`${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                } w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-600/50`}
            >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
            {errors.root && <p className="text-red-500 text-[12px] mt-1 text-center">{errors.root.message}</p>}

            <p className="mt-6 text-center text-xs text-gray-400">
                By creating an account, you agree to our{" "}
                <button className="text-blue-400 hover:text-blue-300 transition-colors">Terms of Service</button> and{" "}
                <button className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</button>
            </p>
        </form>
    );
}
