import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type User = {
    name: string;
    email: string;
};
export default function UserIcon({ user }: { user: User }) {
    const [pending, setPending] = useState(false);
    const router = useRouter();
    async function handleLogout() {
        setPending(true);
        const { error } = await supabase.auth.signOut({ scope: "local" });

        if (error) {
            console.error("Logout error:", error.message);
        } else {
            setPending(false);
            router.push("/");
        }
    }
    return (
        <Popover>
            <PopoverTrigger>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
                    {user?.name?.slice(0, 1).toLocaleUpperCase() || ""}
                </div>
            </PopoverTrigger>
            <PopoverContent className="bg-gray-800/50 border-gray-700 space-y-5 px-10">
                <div className="flex flex-col justify-center items-center space-y-3">
                    <div className="w-20 h-20 bg-gradient-to-br text-3xl from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
                        {user?.name?.slice(0, 1).toLocaleUpperCase() || ""}
                    </div>
                    <div className="text-center">
                        <p className="text-white font-semibold">{user?.name}</p>
                        <p className="text-gray-400">{user?.email}</p>
                    </div>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger className="w-full">
                        <div className="flex justify-center items-center">
                            <button
                                disabled={pending}
                                className=" text-white font-semibold bg-red-500/60 hover:bg-red-500 cursor-pointer w-full py-2 rounded-lg"
                            >
                                {pending ? "Logging out..." : "Logout"}
                            </button>
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-800 border-gray-700">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-white text-xl font-semibold">Confirm Logout</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                                Are you sure you want to log out? You will need to sign in again to access your account.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 border-0 text-white cursor-pointer">Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-500/60 hover:bg-red-500  border-0">
                                <button disabled={pending} onClick={handleLogout} className=" cursor-pointer">
                                    {pending ? "Logging out..." : "Logout"}
                                </button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </PopoverContent>
        </Popover>
    );
}
