"use client";
import UserIcon from "@/Components/Dashboard/UserIcon";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { set } from "zod";
import Task from "@/Components/ViewRepo/Task";

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

// Mock data
const repo: Repo = {
    title: "Java Data Structures & Algorithms",
    noOfTasks: 8,
    completedTasks: 3,
    createdAt: new Date("2024-01-15"),
    tasks: [
        {
            taskNumber: 1,
            taskTitle: "Arrays and ArrayList Fundamentals",
            taskDescription: "Learn the basics of arrays and dynamic arrays in Java. Understand memory allocation, indexing, and common operations.",
            estimatedTime: "3 hours",
            completed: true,
            assignments: [
                {
                    question: "Implement a function to find the maximum element in an array",
                    answer: "public int findMax(int[] arr) { int max = arr[0]; for(int i = 1; i < arr.length; i++) { if(arr[i] > max) max = arr[i]; } return max; }",
                },
                {
                    question: "Write a method to reverse an array in-place",
                    answer: "public void reverseArray(int[] arr) { int left = 0, right = arr.length - 1; while(left < right) { int temp = arr[left]; arr[left] = arr[right]; arr[right] = temp; left++; right--; } }",
                },
            ],
        },
        {
            taskNumber: 2,
            taskTitle: "Linked Lists Implementation",
            taskDescription: "Build a singly linked list from scratch. Implement insertion, deletion, and traversal operations.",
            estimatedTime: "4 hours",
            completed: true,
            assignments: [
                {
                    question: "Create a Node class and LinkedList class with basic operations",
                    answer: "class Node { int data; Node next; Node(int data) { this.data = data; this.next = null; } }",
                },
                {
                    question: "Implement a method to detect a cycle in a linked list",
                    answer: null,
                },
            ],
        },
        {
            taskNumber: 3,
            taskTitle: "Stack and Queue Data Structures",
            taskDescription: "Implement stack and queue using arrays and linked lists. Learn LIFO and FIFO principles.",
            estimatedTime: "3.5 hours",
            completed: true,
            assignments: [
                {
                    question: "Implement a Stack using an array with push, pop, and peek operations",
                    answer: null,
                },
            ],
        },
        {
            taskNumber: 4,
            taskTitle: "Binary Trees and Traversals",
            taskDescription: "Understand tree structures and implement in-order, pre-order, and post-order traversals.",
            estimatedTime: "5 hours",
            completed: false,
            assignments: [
                {
                    question: "Create a binary tree node and implement in-order traversal",
                    answer: null,
                },
                {
                    question: "Write a function to find the height of a binary tree",
                    answer: null,
                },
            ],
        },
        {
            taskNumber: 5,
            taskTitle: "Hash Tables and HashMap",
            taskDescription: "Learn about hash functions, collision resolution, and implement a basic hash table.",
            estimatedTime: "4 hours",
            completed: false,
            assignments: [
                {
                    question: "Implement a simple hash table with linear probing",
                    answer: null,
                },
            ],
        },
        {
            taskNumber: 6,
            taskTitle: "Sorting Algorithms",
            taskDescription: "Master bubble sort, merge sort, quick sort, and understand time complexity analysis.",
            estimatedTime: "6 hours",
            completed: false,
            assignments: [
                {
                    question: "Implement merge sort algorithm",
                    answer: null,
                },
                {
                    question: "Implement quick sort with pivot selection",
                    answer: null,
                },
            ],
        },
        {
            taskNumber: 7,
            taskTitle: "Graph Algorithms - BFS and DFS",
            taskDescription: "Learn graph representations and implement breadth-first and depth-first search.",
            estimatedTime: "5 hours",
            completed: false,
            assignments: [
                {
                    question: "Implement BFS traversal for a graph",
                    answer: null,
                },
            ],
        },
        {
            taskNumber: 8,
            taskTitle: "Dynamic Programming Basics",
            taskDescription: "Introduction to dynamic programming with fibonacci, knapsack, and common DP patterns.",
            estimatedTime: "7 hours",
            completed: false,
            assignments: [
                {
                    question: "Solve fibonacci using memoization",
                    answer: null,
                },
                {
                    question: "Implement 0/1 knapsack problem",
                    answer: null,
                },
            ],
        },
    ],
};

export default function page({ params }: { params: Promise<{ id: string }> }) {
    
    const [userinfo, setUserInfo] = useState({ name: "", email: "" });
    const [repoData, setRepoData] = useState<Repo | null>(null);

    const router = useRouter();

    useEffect(() => {
        (async function () {
            const { id } = await params;
            console.log(id);

            const data = localStorage.getItem(`sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_NAME}-auth-token`);
            if (!data) {
                router.replace("/Auth");
                return;
            }

            const { name, email } = JSON.parse(data!).user.user_metadata;
            setUserInfo({ name: name, email: email });

            setRepoData(repo);
        })();
    }, []);

    const progressPercentage = (repo.completedTasks / repo.noOfTasks) * 100;

    

    if (!repoData) {
        return (
            <div>loading</div>
        )
    }

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
                        <div className="text-3xl font-bold text-white">{Math.round(progressPercentage)}%</div>
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
                                style={{ width: `${progressPercentage}%` }}
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
