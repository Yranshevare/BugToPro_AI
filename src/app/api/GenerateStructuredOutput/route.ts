import response from "@/lib/Reaponse";
import { NextRequest } from "next/server";
import GenerateStructuredOutputWorkflow from "../../Workflow/GenrateStructuredOutput";


export async function GET(req: NextRequest) {
    try {
        const roadmap = await req.nextUrl.searchParams.get("roadmap");

        if (!roadmap) {
            return response({ message: "Missing roadmap parameter", status: 400 });
        }

        const initialState = {
            input: roadmap,
        }

        const res = await GenerateStructuredOutputWorkflow.invoke(initialState);

        return response({ message: "Structured Output generated successfully", status: 200, data: res.output });
        
    } catch (error) {
        return  response({message:"Error in GenerateStructuredOutput API", status:500, error: (error as Error).message});
    }
}