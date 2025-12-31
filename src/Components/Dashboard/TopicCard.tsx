import React from "react";
import { useRouter } from "next/navigation";

interface Topic {
    id: string;
    name: string;
    status: "In Progress" | "Completed" ;
    progress: number;
    lastActivity: string;
}

export default function TopicCard({topic}: {topic: Topic}) {
    const router = useRouter();

    const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  
    return (
        <div key={topic.id} onClick={()=>router.push(`/viewRepo/${topic.id}`)} className={`${topic.status === 'Completed'? "bg-gray-800/50 hover:bg-gray-800/80" : "bg-gray-800 hover:border-blue-600"}  border border-gray-700 rounded-xl p-6  transition-all`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{topic.name}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(topic.status)}`}>{topic.status}</span>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-blue-400 font-semibold">{topic.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className={`${topic.status === 'Completed'? "bg-green-500/20" : "bg-gradient-to-r from-blue-500 to-purple-600"}  h-2 rounded-full transition-all`}
                        style={{ width: `${topic.progress}%` }}
                    ></div>
                </div>
            </div>

            <p className="text-xs text-gray-500 mb-4">{topic.lastActivity}</p>

            <div className="flex gap-2">
                <button className={`flex-1 ${topic.status === 'Completed'? "bg-gray-700 hover:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"}   text-white py-2 rounded-lg font-medium transition-colors`}>
                    {
                        topic.status === 'Completed'? "Review" : "Continue"
                    }
                </button>
                <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
