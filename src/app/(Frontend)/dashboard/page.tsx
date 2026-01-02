"use client";
import TopicCard from "@/Components/Dashboard/TopicCard";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserIcon from "@/Components/Dashboard/UserIcon";
import getUserInfo from "@/lib/getuserInfo";
import secureReq from "@/lib/secureReq";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/Components/Loader";

interface Topic {
    id: string;
    name: string;
    status: "In Progress" | "Completed";
    progress: number;
    lastActivity: string;
}

export default function LearningDashboard() {
    const [userinfo, setUserInfo] = useState({ name: "", email: "" });
    const [activeTopics, setActiveTopics] = useState<Topic[]>([]);
    const [completedTopics, setCompletedTopics] = useState<Topic[]>([]);

    const router = useRouter();

    const { data, isLoading, isError, error, isSuccess } = useQuery({
        queryKey: ["repo"],
        queryFn: fetchRepo,
        staleTime: 1000 * 60 * 5, // (optional) how long data stays fresh
    });

    
    useEffect(() => {
        if(isSuccess){
            if (data) {
                const active = data.filter((repo: any) => repo.status !== "Completed");
                const completed = data.filter((repo: any) => repo.status === "Completed");
                setActiveTopics(active);
                setCompletedTopics(completed);
            }
        }
    }, [data]);

    async function fetchRepo() {
        const res = await secureReq({url:"/api/Repo/GetAll"});
        // console.log(res.data);
        const data = res.data.data;

        const Repos = data.map((repo: any) => ({
            id: repo.id,
            name: repo.title,
            status: repo.completedTasks === repo.noOfTasks ? "Completed" : "In Progress",
            progress: Math.floor((repo.completedTasks / repo.noOfTasks) * 100),
            lastActivity: `Last updated ${new Date(repo.updatedAt).toLocaleDateString()}`,
        }));
        return Repos;
    }
    useEffect(() => {
        (async function () {
            const user = await getUserInfo();
            if (user.error) {
                router.push("/Auth");
                return;
            }
            setUserInfo({ name: user.name, email: user.email });
        })();
    }, []);

    if (isLoading) return <Loader   />

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            {/* Top Navbar */}
            <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">BugToPro AI</div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/CreateRepo")}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Repo
                        </button>
                        {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
                            {userinfo.name?.slice(0, 1).toLocaleUpperCase() || ""}
                        </div> */}
                        <UserIcon user={userinfo} />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Page Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">Your Learning Dashboard</h1>
                    <p className="text-gray-400 text-lg">Manage your learning topics and track progress</p>
                </div>

                {/* Active Topics Section */}
                {activeTopics.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-6">Active Repo</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeTopics.map((topic) => (
                                <TopicCard key={topic.id} topic={topic} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed Topics Section */}
                {completedTopics.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-6">Completed Repo</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {completedTopics.map((topic) => (
                                <TopicCard key={topic.id} topic={topic} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {activeTopics.length === 0 && completedTopics.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">You haven't added any learning topics yet.</h3>
                        <p className="text-gray-400 mb-8">Start your coding journey by adding your first topic</p>
                        <button onClick={() => router.push("/CreateRepo")} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Your First Topic
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
