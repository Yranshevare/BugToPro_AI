"use client";
import UserIcon from "@/Components/Dashboard/UserIcon";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { set } from "zod";
import Task from "@/Components/ViewRepo/Task";
import getUserInfo from "@/lib/getuserInfo";
import { useQuery } from "@tanstack/react-query";
import secureReq from "@/lib/secureReq";
import Loader from "@/Components/Loader";

interface Assignment {
    question: string;
    answer?: string | null;
}

interface Task {
    taskNumber: number;
    taskTitle: string;
    taskDescription: string;
    estimatedTime: string;
    assignments: Assignment[];
    completed: boolean;
}

interface Repo {
    title: string;
    tasks: Task[];
    createdAt: Date;
    noOfTasks: number;
    completedTasks: number;
}

export default function page({ params }: { params: Promise<{ id: string }> }) {
    const [userinfo, setUserInfo] = useState({ name: "", email: "" });
    const [repoData, setRepoData] = useState<Repo | null>(null);
    const [id, setId] = useState<string | null>(null);

    const router = useRouter();

    const { data, isLoading, isError, error, isSuccess } = useQuery({
        queryKey: [`task-${id}`],
        queryFn: fetchRepo,
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // (optional) how long data stays fresh
    });

    async function fetchRepo() {
        const res = await secureReq({ url: "/api/Repo/GetOne", params: `id=${(await params).id}` });
        console.log(res.data.data);
        return res.data.data;
    }

    useEffect(() => {
        if (isSuccess) {
            if (data) {
                setRepoData({ ...data, createdAt: new Date(data.createdAt) });
            }
        }
    }, [data]);

    useEffect(() => {
        (async function () {
            setId((await params).id);
            const user = await getUserInfo();
            if (user.error) {
                router.push("/Auth");
                return;
            }
            setUserInfo({ name: user.name, email: user.email });
        })();
    }, []);

    if (!repoData) return <Loader/>

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Animated Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-gray-950 to-purple-950/20 pointer-events-none"></div>

            {/* Top Navbar */}
            <nav className="relative bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            BugToPro AI
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <Link href={"/dashboard"} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </Link>
                        <UserIcon user={userinfo} />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-6 py-8">
                {/* Repository Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                            {repoData.title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            Created {repoData.createdAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </div>
                        <span className="text-gray-600">•</span>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            {repoData.noOfTasks} tasks
                        </div>
                    </div>
                </div>

                {/* Progress Overview */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-5">
                        <div className="text-blue-400 text-sm font-medium mb-1">Total Tasks</div>
                        <div className="text-3xl font-bold text-white">{repoData.noOfTasks}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-5">
                        <div className="text-green-400 text-sm font-medium mb-1">Completed</div>
                        <div className="text-3xl font-bold text-white">{repoData.completedTasks}</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-5">
                        <div className="text-orange-400 text-sm font-medium mb-1">In Progress</div>
                        <div className="text-3xl font-bold text-white">{repoData.noOfTasks - repoData.completedTasks}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-5">
                        <div className="text-purple-400 text-sm font-medium mb-1">Progress</div>
                        <div className="text-3xl font-bold text-white">{Math.round((repoData.completedTasks / repoData.noOfTasks) * 100)}%</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-white font-semibold">Overall Progress</span>
                            <span className="text-blue-400 font-bold">
                                {repoData.completedTasks} / {repoData.noOfTasks} Tasks
                            </span>
                        </div>
                        <div className="relative w-full bg-gray-700/50 rounded-full h-4 overflow-hidden">
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                style={{ width: `${(repoData.completedTasks / repoData.noOfTasks) * 100}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks List */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                        Learning Tasks
                    </h2>
                    <div className="space-y-4">
                        {repoData.tasks.map((task) => (
                            <Task key={task.taskNumber} task={task} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
