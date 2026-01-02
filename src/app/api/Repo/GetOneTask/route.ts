import prisma from "@/lib/prisma";
import response from "@/lib/Reaponse";
import { supabaseServer } from "@/lib/supabaseServer";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const repoId = req.nextUrl.searchParams.get("repoId");
        const taskNumber = req.nextUrl.searchParams.get("taskNumber");
        const token = req.nextUrl.searchParams.get("token");

        if (!repoId || !taskNumber) {
            return response({ message: "Missing repoId or taskNumber parameter", status: 400 });
        }

        if (!token) {
            return response({ message: "Unauthorized, token not found", status: 401 });
        }

        const { data: { user }, error } = await supabaseServer.auth.getUser(token);

        if (error || !user) {
            return response({ message: "Unauthorized, user not found", status: 401 });
        }

        const task = await prisma.repo.findFirst({
            where: {
                id: repoId,
            },
            select: {
                tasks: true,
            },
        });
        return response({ message: "Task fetched successfully", status: 200, data: task?.tasks[Number(taskNumber)-1] });
        
    } catch (error: any)  {
        return response({ message: "Internal Server Error", status: 500, error: error.message });
    }
}