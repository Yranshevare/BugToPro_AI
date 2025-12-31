import { LoaderCircle } from "lucide-react";
import React from "react";

export default function Loader() {
    return (
        <div className="min-h-screen bg-gray-950">
            <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-gray-950 to-purple-950/20 pointer-events-none">
                <div className="text-white flex justify-center h-screen items-center gap-3 ">
                    <LoaderCircle className="animate-spin text-white" />
                    <div className="flex">
                        <p className="text-white">Loading</p>
                        <div className="flex font-bold ml-1 space-x-1">
                            <span className="dot animate-dot delay-0 text-white">.</span>
                            <span className="dot animate-dot delay-300 text-white">.</span>
                            <span className="dot animate-dot delay-600 text-white">.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
