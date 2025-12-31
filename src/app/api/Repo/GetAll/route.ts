import prisma from "@/lib/prisma";
import response from "@/lib/Reaponse";
import { supabaseServer } from "@/lib/supabaseServer";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
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

        const repos = await prisma.repo.findMany({
            where: {
                userId: user.id,
            },
            select: {
                id: true,
                title: true,
                noOfTasks: true,
                completedTasks: true,
                updatedAt: true,
            },
        });
        console.log("Repos fetched:", repos.length);
        return response({ message: "Repos fetched successfully", data: repos, status: 200 });
    } catch (error) {
        console.error("Error fetching repos:", error);
        return response({ message: "Internal Server Error", status: 500 });
    }
}
