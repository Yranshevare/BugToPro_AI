import response from "@/lib/Reaponse";
import GenerateOverviewWorkflow from "../../Workflow/GenrateOverview";
import { humanMessage, systemMessage } from "@/app/Workflow/prompts/GenerateOverview";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    try {
        const topic = await req.nextUrl.searchParams.get("topic");
        const duration = await req.nextUrl.searchParams.get("duration");
        const current_level = await req.nextUrl.searchParams.get("current_level");
        const goal = await req.nextUrl.searchParams.get("goal");
        const addition_info = await req.nextUrl.searchParams.get("addition_info");

        const humanPrompt = await humanMessage.format({
            title: topic,
            timeline: duration,
            understanding: current_level,
            goal,
            extraInfo: addition_info,
        });

        const messages = [new SystemMessage(systemMessage), new HumanMessage(humanPrompt)];

        let isClosed = false;

        const stream = new ReadableStream({
            async start(controller) {
                controller.enqueue(`data: {"message": "Stream started"}\n\n`);

                try {
                    for await (const chunk of await GenerateOverviewWorkflow.stream({ messages }, { streamMode: "messages" })) {
                        if (isClosed) break;
                        // console.log(chunk);
                        controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`);
                    }
                    
                } catch (err) {
                    if (!isClosed) {
                        controller.enqueue(`data: {"message": "${err}"}\n\n`);
                    }
                    controller.close();
                }finally{
                    controller.enqueue(`data: {"message": "Stream finished"}\n\n`);
                    console.log("Stream finished");
                    controller.close();
                }
            },

            // 🔥 Express equivalent of req.on("close")
            cancel() {
                isClosed = true;
                console.log("SSE client disconnected");
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error: any) {
        return response({ status: 500, error: error.message });
    }
}
