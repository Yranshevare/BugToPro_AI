"use client";
import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CheckCircle, LoaderCircle } from "lucide-react";
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
} from "@/Components/ui/alert-dialog";
import message from "./response";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const schema = z.object({
    topic: z.string().min(1, "please provide a topic"),
    duration: z.string("please provide a duration"),
    current_level: z.string("please provide a current level of understanding"),
    goal: z.string("please provide your desired goal"),
    addition_info: z.string().optional(),
});

export default function CreateRepo() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [topic, setTopic] = useState("");
    const [timeline, setTimeline] = useState("");
    const [understanding, setUnderstanding] = useState("");
    const [goal, setGoal] = useState("");
    const [extraInfo, setExtraInfo] = useState("");
    const [changes, setChanges] = useState("");
    const [aiRoadmap, setAiRoadmap] = useState<null | string>(null);
    const [RepoStatus, setRepoStatus] = useState<number | null>(null);
    const [repoInitializedText, setRepoInitializedText] = useState<string>("Initializing the repository");

    const router = useRouter();

    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) });

    const Submit = async (data: any) => {
        console.log(data);

        setTopic(data.topic);
        setTimeline(data.duration);
        setUnderstanding(data.current_level);
        setGoal(data.goal);
        setExtraInfo(data.addition_info);

        setIsFormSubmitted(true);
        try {
            const prams = new URLSearchParams({
                topic: data.topic,
                duration: data.duration,
                current_level: data.current_level,
                goal: data.goal,
                addition_info: data.addition_info,
            });
            const eventSource = new EventSource(`/api/GetOverview?${prams}`);
            eventSource.onmessage = (event) => {
                if (JSON.parse(event.data).message === "Stream finished") {
                    console.log("Stream finished");
                    eventSource.close();
                }
                if (!JSON.parse(event.data).message) {
                    console.log(JSON.parse(event.data));
                    setAiRoadmap((prev) => {
                        const text = JSON.parse(event.data)[0]?.kwargs?.content || "";
                        return (prev ? prev : "") + text.split("*").join("") || "";
                    });
                }
            };
            // setAiRoadmap(message.split("*").join("") || "");
        } catch (error) {
            console.log(error);
        }
    };

    function OnError(errors: any) {
        if (errors.topic || errors.duration) {
            setCurrentStep(1);
            return;
        }
        if (errors.current_level || errors.goal) {
            setCurrentStep(2);
        }
    }

    function handleEditInput() {
        setCurrentStep(1);
        setIsFormSubmitted(false);
        setAiRoadmap(null);
    }

    async function InitializeRepo() {
        try {
            setRepoStatus(1);

            setTimeout(() => {
                setRepoInitializedText("This process may take a few minutes");
            }, 7000);

            const {
                data: { session },
            } = await supabase.auth.getSession();

            const eventSource = new EventSource(`/api/GenerateStructuredOutput?roadmap=${aiRoadmap}&token=${session?.access_token}&title=${topic}`);

            eventSource.onmessage = (event) => {
                console.log("Message from server:", event.data);
                if (JSON.parse(event.data).message === "convert the data to json") {
                    setRepoStatus(2);
                }
                if (JSON.parse(event.data).message === "Stream finished") {
                    console.log("Stream finished");
                    eventSource.close();
                    setRepoStatus(3);
                    router.push(`/viewRepo/${JSON.parse(event.data).id}`);
                }
            };
            eventSource.onerror = (error) => {
                console.error("EventSource failed:", error);
                eventSource.close();
            };
        } catch (error) {
            console.log(error);
        }
    }

    async function MakeChanges() {
        if (changes.trim() === "") return;
        if (!aiRoadmap) return;
        // setAiRoadmap(null);
        const data = {
            topic,
            timeline,
            understanding,
            goal,
            addition_info: extraInfo,
            aiRoadmap,
            changesToMake: changes,
        };
        console.log("Making Changes", data);
        try {
            setAiRoadmap(null);
            const prams = new URLSearchParams({
                topic,
                duration: timeline,
                current_level: understanding,
                goal,
                addition_info: extraInfo,
                changesToMake: changes,
                currentResponse: aiRoadmap || "",
            });
            const eventSource = new EventSource(`/api/ChangeOverview?${prams}`);
            eventSource.onmessage = (event) => {
                if (JSON.parse(event.data).message === "Stream finished") {
                    console.log("Stream finished");
                    eventSource.close();
                }
                if (!JSON.parse(event.data).message) {
                    console.log(JSON.parse(event.data));
                    setAiRoadmap((prev) => {
                        const text = JSON.parse(event.data)[0]?.kwargs?.content || "";
                        return (prev ? prev : "") + text.split("*").join("") || "";
                    });
                }
            };
            setChanges("");
        } catch (error) {
            console.log(error);
        }
    }

    const steps = [
        { number: 1, title: "Topic Details", icon: "📚" },
        { number: 2, title: "Learning Path", icon: "🎯" },
        { number: 3, title: "Customization", icon: "⚙️" },
    ];


    if (RepoStatus) {
        return (
            <div className="min-h-screen bg-gray-950 flex  justify-center items-center">
                <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-gray-950 to-purple-950/20 pointer-events-none">
                    <div className="flex justify-center items-center flex-col h-full">
                        <div className="space-y-5">
                            <div className="flex gap-2  items-center">
                                {RepoStatus >= 2 ? (
                                    <div className={`${RepoStatus !== 1 && "opacity-50"} flex gap-2`}>
                                        <CheckCircle className="text-green-500" />
                                        <p className="text-white">Repository Successfully Initialized</p>
                                    </div>
                                ) : (
                                    <>
                                        <LoaderCircle className="animate-spin text-white" />
                                        <div className="flex">
                                            <p className="text-white">{repoInitializedText}</p>
                                            <div className="flex font-bold ml-1 space-x-1">
                                                <span className="dot animate-dot delay-0 text-white">.</span>
                                                <span className="dot animate-dot delay-300 text-white">.</span>
                                                <span className="dot animate-dot delay-600 text-white">.</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="flex gap-2  items-center">
                                {RepoStatus >= 3 ? (
                                    <div className={`${RepoStatus !== 2 && "opacity-50"} flex gap-2`}>
                                        <CheckCircle className="text-green-500" />
                                        <p className="text-white">Repository Successfully Saved</p>
                                    </div>
                                ) : (
                                    <div className={` ${RepoStatus !== 2 && "opacity-50"} flex gap-2`}>
                                        <LoaderCircle className="animate-spin text-white" />
                                        <div className="flex">
                                            <p className="text-white">Saving Repository</p>
                                            <div className="flex font-bold ml-1 space-x-1">
                                                <span className="dot animate-dot delay-0 text-white">.</span>
                                                <span className="dot animate-dot delay-300 text-white">.</span>
                                                <span className="dot animate-dot delay-600 text-white">.</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2  items-center">
                                {RepoStatus === 3 ? (
                                    <div className={`${RepoStatus !== 3 && "opacity-50"} flex gap-2`}>
                                        <CheckCircle className="text-green-500" />
                                        <div className="flex">
                                            <p className="text-white">Redirecting to Repository</p>
                                            <div className="flex font-bold ml-1 space-x-1">
                                                <span className="dot animate-dot delay-0 text-white">.</span>
                                                <span className="dot animate-dot delay-300 text-white">.</span>
                                                <span className="dot animate-dot delay-600 text-white">.</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="opacity-40 flex gap-2">
                                        <LoaderCircle className="animate-spin text-white" />
                                        <p className="text-white">Repo is ready</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
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
                    <Link href={"/dashboard"} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className="relative max-w-5xl mx-auto px-6 py-12">
                {!isFormSubmitted ? (
                    <>
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                                Create Your Learning Path
                            </h1>
                            <p className="text-gray-400 text-lg">Let's build a personalized roadmap tailored to your goals</p>
                        </div>

                        {/* Progress Steps */}
                        <div className="mb-12">
                            <div className="flex items-center justify-center gap-4 mb-8">
                                {steps.map((step, index) => (
                                    <React.Fragment key={step.number}>
                                        <div onClick={() => setCurrentStep(index + 1)} className="flex flex-col items-center cursor-pointer">
                                            <div
                                                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
                                                    currentStep >= step.number
                                                        ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50"
                                                        : "bg-gray-800 border border-gray-700"
                                                }`}
                                            >
                                                {step.icon}
                                            </div>
                                            <div className="mt-2 text-center">
                                                <div
                                                    className={`text-sm font-semibold ${
                                                        currentStep >= step.number ? "text-blue-400" : "text-gray-500"
                                                    }`}
                                                >
                                                    {step.title}
                                                </div>
                                            </div>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div
                                                className={`w-20 h-1 rounded-full transition-all duration-300 ${
                                                    currentStep > step.number ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-gray-800"
                                                }`}
                                            ></div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Form Card */}
                        <form
                            onSubmit={handleSubmit(Submit, OnError)}
                            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 md:p-12 shadow-2xl"
                        >
                            {/* Step 1: Topic Details */}
                            {currentStep === 1 && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div>
                                        <label className="block text-lg font-bold text-white mb-3 flex items-center gap-2">
                                            <span className="text-2xl">📝</span>
                                            What do you want to learn?
                                        </label>
                                        <input
                                            type="text"
                                            {...register("topic")}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-5 py-4 text-gray-100 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="e.g., Java Data Structures & Algorithms"
                                        />
                                        {errors.topic ? (
                                            <p className="text-sm text-red-500 mt-2">{errors.topic.message}</p>
                                        ) : (
                                            <p className="text-sm text-gray-500 mt-2">Be specific about what you want to master</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-lg font-bold text-white mb-3 flex items-center gap-2">
                                            <span className="text-2xl">⏱️</span>
                                            How much time can you dedicate?
                                        </label>
                                        <Controller
                                            name="duration"
                                            control={control}
                                            render={({ field }) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-5 py-4 text-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                                        <SelectValue placeholder="Select a duration" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                                        <SelectItem value="2-weeks" className="hover:bg-gray-700! hover:text-white! cursor-pointer">
                                                            2 Weeks - Sprint Learning
                                                        </SelectItem>
                                                        <SelectItem value="1-month" className="hover:bg-gray-700! hover:text-white! cursor-pointer">
                                                            1 Month - Fast Track
                                                        </SelectItem>
                                                        <SelectItem value="2-month" className="hover:bg-gray-700! hover:text-white! cursor-pointer">
                                                            2 Months - Balanced Pace
                                                        </SelectItem>
                                                        <SelectItem value="3-month" className="hover:bg-gray-700! hover:text-white! cursor-pointer">
                                                            3 Months - Deep Dive
                                                        </SelectItem>
                                                        <SelectItem value="6-month" className="hover:bg-gray-700! hover:text-white! cursor-pointer">
                                                            6 Months - Comprehensive
                                                        </SelectItem>
                                                        <SelectItem value="flexible" className="hover:bg-gray-700! hover:text-white! cursor-pointer">
                                                            Flexible - Learn at my pace
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.duration ? (
                                            <p className="text-sm text-red-500 mt-2">{errors.duration.message}</p>
                                        ) : (
                                            <p className="text-sm text-gray-500 mt-2">Choose a realistic timeframe for your learning journey</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Learning Path */}
                            {currentStep === 2 && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div>
                                        <label className="block text-lg font-bold text-white mb-3 flex items-center gap-2">
                                            <span className="text-2xl">🎓</span>
                                            Current Understanding Level
                                        </label>
                                        <Controller
                                            name="current_level"
                                            control={control}
                                            render={({ field }) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-5 py-4 text-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                                        <SelectValue placeholder="Select your current level" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                                        <SelectItem
                                                            value="complete-beginner"
                                                            className="hover:bg-gray-700! hover:text-white! cursor-pointer"
                                                        >
                                                            Complete Beginner - Never coded before
                                                        </SelectItem>
                                                        <SelectItem value="beginner" className="hover:bg-gray-700! hover:text-white! cursor-pointer">
                                                            Beginner - Basic syntax knowledge
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="intermediate"
                                                            className="hover:bg-gray-700! hover:text-white! cursor-pointer"
                                                        >
                                                            Intermediate - Built small projects
                                                        </SelectItem>
                                                        <SelectItem value="advanced" className="hover:bg-gray-700! hover:text-white! cursor-pointer">
                                                            Advanced - Strong fundamentals
                                                        </SelectItem>
                                                        <SelectItem value="expert" className="hover:bg-gray-700! hover:text-white! cursor-pointer">
                                                            Expert - Production experience
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.current_level ? (
                                            <p className="text-sm text-red-500 mt-2">{errors.current_level.message}</p>
                                        ) : (
                                            <p className="text-sm text-gray-500 mt-2">Select your current level of understanding</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-lg font-bold text-white mb-3 flex items-center gap-2">
                                            <span className="text-2xl">🎯</span>
                                            What's your primary goal?
                                        </label>
                                        <Controller
                                            name="goal"
                                            control={control}
                                            render={({ field }) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-5 py-4 text-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                                        <SelectValue placeholder="Select your goal" />
                                                    </SelectTrigger>

                                                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                                        <SelectItem value="job-prep" className="hover:bg-gray-700! hover:text-white! cursor-pointer">
                                                            Job Interview Preparation
                                                        </SelectItem>

                                                        <SelectItem
                                                            value="career-switch"
                                                            className="hover:bg-gray-700! hover:text-white! cursor-pointer"
                                                        >
                                                            Career Switch to Tech
                                                        </SelectItem>

                                                        <SelectItem
                                                            value="skill-upgrade"
                                                            className="hover:bg-gray-700! hover:text-white! cursor-pointer"
                                                        >
                                                            Upgrade Current Skills
                                                        </SelectItem>

                                                        <SelectItem
                                                            value="college-project"
                                                            className="hover:bg-gray-700! hover:text-white! cursor-pointer"
                                                        >
                                                            College / University Project
                                                        </SelectItem>

                                                        <SelectItem
                                                            value="personal-project"
                                                            className="hover:bg-gray-700! hover:text-white! cursor-pointer"
                                                        >
                                                            Build Personal Projects
                                                        </SelectItem>

                                                        <SelectItem
                                                            value="competitive"
                                                            className="hover:bg-gray-700! hover:text-white! cursor-pointer"
                                                        >
                                                            Competitive Programming
                                                        </SelectItem>

                                                        <SelectItem
                                                            value="general-learning"
                                                            className="hover:bg-gray-700! hover:text-white! cursor-pointer"
                                                        >
                                                            General Learning & Exploration
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.goal ? (
                                            <p className="text-sm text-red-500 mt-2">{errors.goal.message}</p>
                                        ) : (
                                            <p className="text-sm text-gray-500 mt-2">This helps us focus on what matters most to you</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Customization */}
                            {currentStep === 3 && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div>
                                        <label className="block text-lg font-bold text-white mb-3 flex items-center gap-2">
                                            <span className="text-2xl">💡</span>
                                            Additional Information (Optional)
                                        </label>
                                        <textarea
                                            {...register("addition_info")}
                                            rows={8}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-5 py-4 text-gray-100 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                            placeholder={`Tell us more about:\n• Specific topics you want to focus on\n• Areas you struggle with\n• Your preferred learning style\n• Any constraints or preferences\n• Specific companies/roles you're targeting`}
                                        ></textarea>
                                        {errors.addition_info ? (
                                            <p className="text-sm text-red-500 mt-2">{errors.addition_info.message}</p>
                                        ) : (
                                            <p className="text-sm text-gray-500 mt-2">
                                                The more details you provide, the better we can customize your learning path
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex gap-4 mt-10">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(currentStep - 1)}
                                        className="flex-1 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Previous
                                    </button>
                                )}
                                {currentStep < 3 && (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(currentStep + 1)}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold transition-all shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        Continue
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                )}
                                {currentStep === 3 && (
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold transition-all shadow-xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Generate My Roadmap
                                    </button>
                                )}
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* Header */}
                            <div className="text-center mb-8">
                                {aiRoadmap ? (
                                    <>
                                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-500/30">
                                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent">
                                            Your Roadmap is Ready!
                                        </h1>
                                        <p className="text-gray-400 text-lg">AI has generated a personalized learning path just for you</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-500/30">
                                            <LoaderCircle className="animate-spin text-white w-10 h-10" />
                                        </div>
                                        <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent">
                                            This might take a few seconds
                                        </h1>
                                        <p className="text-gray-400 text-lg"> wait your roadmap is being generated </p>
                                    </>
                                )}
                            </div>

                            {/* User Input Summary */}
                            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="text-2xl">📋</span>
                                    Your Inputs
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1">Topic</div>
                                        <div className="text-white font-semibold">{topic}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1">Timeline</div>
                                        <div className="text-white font-semibold">{timeline}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1">Current Level</div>
                                        <div className="text-white font-semibold">{understanding}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1">Primary Goal</div>
                                        <div className="text-white font-semibold">{goal}</div>
                                    </div>
                                    {extraInfo && (
                                        <div className="md:col-span-2">
                                            <div className="text-sm text-gray-400 mb-1">Additional Info</div>
                                            <div className="text-white font-semibold text-sm">{extraInfo}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* AI Roadmap Response */}
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="text-3xl">🤖</span>
                                    Roadmap Overview
                                </h2>
                                <div className="prose prose-invert max-w-none">
                                    {aiRoadmap ? (
                                        <pre className="text-gray-300 leading-relaxed whitespace-pre-line">{aiRoadmap}</pre>
                                    ) : (
                                        <div className="text-gray-300 leading-relaxed whitespace-pre-line flex gap-2 items-center ">
                                            <LoaderCircle className="animate-spin text-white " />
                                            <div className="flex">
                                                <p className="text-white">Thinking </p>
                                                <div className="flex font-bold ml-1 space-x-1">
                                                    <span className="dot animate-dot delay-0 text-white">.</span>
                                                    <span className="dot animate-dot delay-300 text-white">.</span>
                                                    <span className="dot animate-dot delay-600 text-white">.</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {aiRoadmap && (
                                <>
                                    {/* Modifications Section */}
                                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <span className="text-2xl">✏️</span>
                                            Want to Make Changes?
                                        </h3>
                                        <p className="text-gray-400 mb-4">Tell us what you'd like to modify in your learning path</p>
                                        <textarea
                                            rows={5}
                                            value={changes}
                                            onChange={(e) => setChanges(e.target.value)}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-5 py-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                            placeholder={`Example:\n• Focus more on system design\n• Add more practical projects\n• Skip the basics and start from advanced topics\n• Include mock interview sessions`}
                                        ></textarea>
                                        <button
                                            onClick={MakeChanges}
                                            className="mt-2 text-white w-full bg-gray-700 py-2 rounded-lg cursor-pointer hover:bg-gray-600 transition-all font-semibold"
                                        >
                                            Apply Changes
                                        </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4">
                                        <AlertDialog>
                                            <AlertDialogTrigger className="flex-1 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                Edit Inputs
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-gray-800 border-gray-700">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-white text-xl font-semibold">Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-gray-400">
                                                        Once you leave this page, the current response will be permanently lost and cannot be
                                                        recovered.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 border-0 text-white cursor-pointer">
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction className="bg-red-500/60 hover:bg-red-500  border-0">
                                                        <button onClick={handleEditInput} className=" cursor-pointer">
                                                            Continue
                                                        </button>
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <button
                                            onClick={InitializeRepo}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold transition-all shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                />
                                            </svg>
                                            Initialize Repository
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}

                {/* Help Section */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Need help? <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium">View our guide</button> or{" "}
                        <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium">contact support</button>
                    </p>
                </div>
            </div>
        </div>
    );
}
