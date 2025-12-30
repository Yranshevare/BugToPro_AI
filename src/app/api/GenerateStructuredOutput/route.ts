import response from "@/lib/Reaponse";
import { NextRequest } from "next/server";
import GenerateStructuredOutputWorkflow from "../../Workflow/GenrateStructuredOutput";
import fs from "fs/promises";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
    try {
        const roadmap = await req.nextUrl.searchParams.get("roadmap");
        const token = await req.nextUrl.searchParams.get("token");

        if (!token) {
            console.log("No token provided in Authorization header");
            return response({ message: "Unauthorized, token not found", status: 401 });
        }

        const {
            data: { user },
            error,
        } = await supabaseServer.auth.getUser(token);

        if (error || !user) {
            console.log("Supabase Auth Error:", error);
            return response({ message: "Unauthorized, user not found", status: 401 });
        }

        if (!roadmap) {
            return response({ message: "Missing roadmap parameter", status: 400 });
        }

        const stream = new ReadableStream({
            async start(controller) {
                controller.enqueue(`data: {"message": "Stream started"}\n\n`);
                // const initialState = {
                //     input: roadmap,
                // }

                // const res = await GenerateStructuredOutputWorkflow.invoke(initialState);
                const data = await fs.readFile("src/app/api/GenerateStructuredOutput/response.json", "utf-8");
                const res = JSON.parse(data).data;

                await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate delay for llm call

                controller.enqueue(`data: {"message":"convert the data to json"}\n\n`);

                res.user = { name: user.user_metadata.name, email: user.user_metadata.email, id: user.id };

                await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate delay for db write
                controller.enqueue(`data: {"message": "Stream finished"}\n\n`);
                controller.close();
            },

            cancel() {
                console.log("SSE client disconnected");
            },
        });

        // res.user = user;

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        return response({ message: "Error in GenerateStructuredOutput API", status: 500, error: (error as Error).message });
    }
}
