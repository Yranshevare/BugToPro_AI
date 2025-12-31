"use client";

import UserIcon from "@/Components/Dashboard/UserIcon";
import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function page({ params }: { params: Promise<{ task: string }> }) {
    const [task, setTask] = React.useState<Task | null>(null);
    const [userinfo, setUserInfo] = useState({ name: "", email: "" });

    const router = useRouter();


    useEffect(() => {
        (async function () {
            const { task } = await params;
            // console.log(JSON.parse(decodeURIComponent(task)));
            setTask(JSON.parse(decodeURIComponent(task)));

            const data = localStorage.getItem(`sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_NAME}-auth-token`);
            if (!data) {
                router.replace("/Auth");
                return;
            }

            const { name, email } = JSON.parse(data!).user.user_metadata;
            setUserInfo({ name: name, email: email });


        })();
    }, [params]);

    if (!task) return <div>Loading...</div>;
    return (
        <div className="min-h-screen bg-gray-950">
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
                        <button onClick={()=>router.back()} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Repo
                        </button>
                        <UserIcon user={userinfo} />
                    </div>
                </div>
            </nav>
            <div className="relative max-w-7xl mx-auto px-6 py-8">
                <div
                    key={task.taskNumber}
                    className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
                >
                    {/* Task Header */}
                    <div className="p-6 cursor-pointer">
                        <div className="flex items-start gap-4">
                            {/* Task Number Circle */}
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                                    task.completed ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white" : "bg-gray-700/50 text-gray-400"
                                }`}
                            >
                                {task.completed ? (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    task.taskNumber
                                )}
                            </div>

                            {/* Task Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{task.taskTitle}</h3>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                task.completed
                                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                            }`}
                                        >
                                            {task.completed ? "Completed" : "In Progress"}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-400 mb-3">{task.taskDescription}</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        {task.estimatedTime}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        {task.assignments.length} assignment{task.assignments.length !== 1 ? "s" : ""}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <span className="text-green-400">{task.assignments.filter((a) => a.answer).length}</span>/{" "}
                                        {task.assignments.length} submitted
                                    </div>
                                </div>
                            </div>

                            {/* Expand Icon */}
                            <div className="flex-shrink-0">
                                <svg
                                    className={`w-6 h-6 text-gray-400 transition-transform duration-300 `}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-700/50 bg-gray-900/30 p-6 animate-in fade-in duration-300">
                        <h4 className="text-lg font-bold text-white mb-4">Assignments</h4>
                        <div className="space-y-4">
                            {task.assignments.map((assignment, idx) => (
                                <div key={idx} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                assignment.answer ? "bg-green-500/20 text-green-400" : "bg-gray-700/50 text-gray-400"
                                            }`}
                                        >
                                            {assignment.answer ? (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            ) : (
                                                idx + 1
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium mb-3">{assignment.question}</p>
                                            <div className="space-y-3">
                                                <textarea
                                                    defaultValue={assignment.answer || ""}
                                                    rows={8}
                                                    placeholder="Write your code here..."
                                                    className="w-full bg-gray-900/70 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 font-mono text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                                />
                                                <div className="flex gap-2">
                                                    {assignment.answer ? (
                                                        <div>
                                                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                                    />
                                                                </svg>
                                                                Update Answer
                                                            </button>
                                                            <span className="px-4 py-2.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg font-medium flex items-center gap-2">
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                                Submitted
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                            Submit Answer
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {!task.completed && (
                            <button className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-green-500/30">
                                Mark Task as Complete
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
