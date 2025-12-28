import response from "@/lib/Reaponse";
import GenerateOverviewWorkflow from "../../Workflow/GenrateOverview";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { topic, duration, current_level, goal, addition_info } = data;
        console.log(data);
        const res = await GenerateOverviewWorkflow({
            title: topic,
            timeline: duration,
            understanding: current_level,
            goal: goal,
            extraInfo: addition_info,
        });
        return response({ message: "Success", status: 200, data:{data, res} });
    } catch (error:any) {
        return response({ status: 500, error: error.message });
    }
}
