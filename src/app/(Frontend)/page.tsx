import SignInDashboardBut from "@/Components/landingPage/SignInDashboardBut";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";


export default async function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">BugToPro AI</div>
                    <SignInDashboardBut/>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        From Bugs to Pro —<br />
                        <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Learn Programming with AI Feedback
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Stop faking progress. Submit real code, get AI-powered analysis, and prove your skills through quality. Your learning path
                        adapts based on your actual code, not checkboxes.
                    </p>
                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-600/50">
                        Start Coding
                    </button>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-20 px-6 bg-gray-800/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Traditional Learning Is Broken</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8">
                            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Fake Progress</h3>
                            <p className="text-gray-400">
                                Marking tasks as complete without writing actual code teaches nothing. You need to build muscle memory.
                            </p>
                        </div>
                        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8">
                            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">🔇</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">No Real Feedback</h3>
                            <p className="text-gray-400">
                                Generic hints don't explain why your code fails. You need detailed analysis of your specific mistakes.
                            </p>
                        </div>
                        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8">
                            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">🔁</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Repeating Mistakes</h3>
                            <p className="text-gray-400">
                                Without understanding root causes, you'll make the same errors again. Learning paths must adapt to you.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Choose Topic</h3>
                            <p className="text-gray-400">Select from data structures, algorithms, OOP, or other programming fundamentals</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Solve Coding Tasks</h3>
                            <p className="text-gray-400">Write actual code to complete real programming challenges in your IDE or ours</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Submit Code</h3>
                            <p className="text-gray-400">Push your solution and let our AI analyze your implementation</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                4
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Get AI Feedback</h3>
                            <p className="text-gray-400">Receive detailed analysis, learn from mistakes, and advance when ready</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="py-20 px-6 bg-gray-800/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-600 transition-colors">
                            <div className="text-3xl mb-3">🤖</div>
                            <h3 className="text-xl font-semibold mb-2">AI Code Evaluation</h3>
                            <p className="text-gray-400">Advanced AI analyzes your code for correctness, style, and best practices</p>
                        </div>
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-600 transition-colors">
                            <div className="text-3xl mb-3">🎯</div>
                            <h3 className="text-xl font-semibold mb-2">Adaptive Learning Path</h3>
                            <p className="text-gray-400">Your curriculum adjusts based on strengths, weaknesses, and progress patterns</p>
                        </div>
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-600 transition-colors">
                            <div className="text-3xl mb-3">💡</div>
                            <h3 className="text-xl font-semibold mb-2">Mistake Explanation</h3>
                            <p className="text-gray-400">Understand why your code failed and how to fix it with detailed breakdowns</p>
                        </div>
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-600 transition-colors">
                            <div className="text-3xl mb-3">✅</div>
                            <h3 className="text-xl font-semibold mb-2">Proof-Based Progress</h3>
                            <p className="text-gray-400">Advance only when your code demonstrates real understanding and quality</p>
                        </div>
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-600 transition-colors">
                            <div className="text-3xl mb-3">👨‍💻</div>
                            <h3 className="text-xl font-semibold mb-2">Developer-Focused Feedback</h3>
                            <p className="text-gray-400">Technical, precise feedback that treats you like a professional developer</p>
                        </div>
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-600 transition-colors">
                            <div className="text-3xl mb-3">📊</div>
                            <h3 className="text-xl font-semibold mb-2">Performance Tracking</h3>
                            <p className="text-gray-400">Monitor your growth with metrics that matter: code quality and problem-solving</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Example Feedback Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">See AI Feedback in Action</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                            <div className="text-sm text-gray-400 mb-2">Your Code</div>
                            <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto">
                                <code className="text-sm font-mono text-gray-300">
                                    {`def binary_search(arr, target):
    left = 0
    right = len(arr)
    
    while left < right:
        mid = (left + right) / 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    
    return -1`}
                                </code>
                            </pre>
                        </div>
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                            <div className="text-sm text-gray-400 mb-2">AI Feedback</div>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="text-red-400 mt-1">✗</div>
                                    <div>
                                        <div className="font-semibold text-red-400">Correctness Issue</div>
                                        <p className="text-gray-400 text-sm">
                                            Line 7: Division operator returns float. Use integer division (//) to avoid IndexError
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="text-yellow-400 mt-1">⚠</div>
                                    <div>
                                        <div className="font-semibold text-yellow-400">Edge Case Missing</div>
                                        <p className="text-gray-400 text-sm">Empty array not handled. Add check before loop execution</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="text-green-400 mt-1">✓</div>
                                    <div>
                                        <div className="font-semibold text-green-400">Complexity Good</div>
                                        <p className="text-gray-400 text-sm">O(log n) time complexity correctly implemented</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="text-blue-400 mt-1">→</div>
                                    <div>
                                        <div className="font-semibold text-blue-400">Suggestion</div>
                                        <p className="text-gray-400 text-sm">Consider adding type hints for better code documentation</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who It's For */}
            <section className="py-20 px-6 bg-gray-800/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Who It's For</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center">
                            <div className="text-5xl mb-4">🎓</div>
                            <h3 className="text-2xl font-semibold mb-3">Students</h3>
                            <p className="text-gray-400">
                                Build a strong foundation in programming fundamentals through hands-on practice and instant feedback
                            </p>
                        </div>
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center">
                            <div className="text-5xl mb-4">💻</div>
                            <h3 className="text-2xl font-semibold mb-3">Beginner Developers</h3>
                            <p className="text-gray-400">
                                Level up your coding skills with real projects and professional-grade code reviews from AI
                            </p>
                        </div>
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center">
                            <div className="text-5xl mb-4">🎯</div>
                            <h3 className="text-2xl font-semibold mb-3">Interview Prep</h3>
                            <p className="text-gray-400">
                                Practice coding challenges with detailed feedback to ace technical interviews at top companies
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-bold mb-6">Ready to Prove Your Skills?</h2>
                    <p className="text-xl text-gray-400 mb-10">
                        Join thousands of developers who are learning programming the right way. No more fake progress. Just real code, real feedback,
                        real growth.
                    </p>
                    <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-xl font-semibold transition-all transform hover:scale-105 shadow-xl shadow-blue-600/50">
                        Join BugToPro AI
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 px-6">
                <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
                    <p>© 2024 BugToPro AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
