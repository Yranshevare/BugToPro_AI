"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserIcon from "@/Components/Dashboard/UserIcon";
import getUserInfo from "@/lib/getuserInfo";
import Loader from "@/Components/Loader";

interface Assignment {
    question: string;
    answer?: string | null;
    explanation?: string | null;
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
    const [currentAssignment, setCurrentAssignment] = useState(0);
    const [userinfo, setUserInfo] = useState({ name: "", email: "" });
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [task, setTask] = useState<Task | null>();

    const router = useRouter();

    useEffect(() => {
        // Fetch task data based on params.task if needed
        (async function () {
            const user = await getUserInfo();
            if (user.error) {
                router.push("/Auth");
                return;
            }
            setUserInfo({ name: user.name, email: user.email });
            const { task } = await params;
            // console.log(JSON.parse(decodeURIComponent(task)));
            setTask(JSON.parse(decodeURIComponent(task)));
        })();
    }, [params]);

    if (!task) return <Loader/>
    

    const handleAnswerChange = (value: string) => {
        setAnswers({
            ...answers,
            [currentAssignment]: value,
        });
    };

    const handleSubmit = () => {
        console.log("Submitting answer:", answers);
        // Here you would send the answer to your backend
    };

    const handleNext = () => {
        if (currentAssignment < task.assignments.length - 1) {
            setCurrentAssignment(currentAssignment + 1);
        }
    };

    const handlePrevious = () => {
        if (currentAssignment > 0) {
            setCurrentAssignment(currentAssignment - 1);
        }
    };

    const currentAsg = task.assignments[currentAssignment];
    const completedCount = task.assignments.filter((a) => a.answer).length;

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
                        <button onClick={()=>router.back()} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Repository
                        </button>
                        <UserIcon user={userinfo} />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-6 py-8">
                {/* Task Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {task.taskNumber}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-white mb-1">{task.taskTitle}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
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
                                <span className="text-gray-600">•</span>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    {completedCount} / {task.assignments.length} completed
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-400 text-lg">{task.taskDescription}</p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-white font-semibold">Assignment Progress</span>
                            <span className="text-blue-400 font-bold">
                                {completedCount} / {task.assignments.length}
                            </span>
                        </div>
                        <div className="relative w-full bg-gray-700/50 rounded-full h-3 overflow-hidden mb-4">
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                style={{ width: `${(completedCount / task.assignments.length) * 100}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                            </div>
                        </div>
                        {/* Assignment Pills */}
                        <div className="flex gap-2 flex-wrap">
                            {task.assignments.map((asg, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentAssignment(idx)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        idx === currentAssignment
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                            : asg.answer
                                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                            : "bg-gray-700/50 text-gray-400 border border-gray-600/30 hover:border-gray-500"
                                    }`}
                                >
                                    Question {idx + 1}
                                    {asg.answer && idx !== currentAssignment && (
                                        <svg className="w-4 h-4 inline ml-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Assignment Detail */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left Column - Question & Answer */}
                    <div className="space-y-6">
                        {/* Question Card */}
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                                    {currentAssignment + 1}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-white mb-2">Assignment Question</h2>
                                    <p className="text-gray-300 text-lg leading-relaxed">{currentAsg.question}</p>
                                </div>
                            </div>
                        </div>

                        {/* Answer Input */}
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                        />
                                    </svg>
                                    Your Answer
                                </h3>
                                {currentAsg.answer && (
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-semibold flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Submitted
                                    </span>
                                )}
                            </div>
                            <textarea
                                value={answers[currentAssignment] || currentAsg.answer || ""}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                                rows={16}
                                placeholder="// Write your code here...
// Example:
class Solution {
    public void solve() {
        // Your implementation
    }
}"
                                className="w-full bg-gray-900/70 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 font-mono text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none mb-4"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {currentAsg.answer ? "Update Answer" : "Submit Answer"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - AI Feedback */}
                    <div className="space-y-6">
                        {currentAsg.explanation ? (
                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">AI Feedback</h3>
                                        <p className="text-sm text-green-400">Your code has been analyzed</p>
                                    </div>
                                </div>
                                <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5">
                                    <div className="text-gray-300 leading-relaxed whitespace-pre-line">{currentAsg.explanation}</div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button className="flex-1 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Ask AI for Help
                                    </button>
                                    <button className="px-4 py-2.5 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-gray-300 hover:text-white rounded-lg transition-all">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8 text-center">
                                <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-400 mb-2">No Feedback Yet</h3>
                                <p className="text-gray-500 mb-4">Submit your answer to receive AI-powered feedback and suggestions</p>
                            </div>
                        )}

                        {/* Hints Section */}
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                                Need a Hint?
                            </h3>
                            <button className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                                Show Hint
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex gap-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentAssignment === 0}
                        className="flex-1 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous Question
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentAssignment === task.assignments.length - 1}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Next Question
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Complete Task Button */}
                {completedCount === task.assignments.length && (
                    <div className="mt-6">
                        <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold transition-all shadow-xl shadow-green-500/30 hover:shadow-green-500/50 flex items-center justify-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Mark Task as Complete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
