import prisma from "@/lib/prisma";
import response from "@/lib/Reaponse";
import { supabaseServer } from "@/lib/supabaseServer";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = req.nextUrl.searchParams.get("token");
        const id = req.nextUrl.searchParams.get("id");

        if (!token) {
            return response({ message: "Unauthorized, token not found", status: 401 });
        }
        if (!id) {
            return response({ message: "Bad Request, id not found", status: 400 });
        }

        const { data: { user }, error } = await supabaseServer.auth.getUser(token);

        if (error || !user) {
            return response({ message: "Unauthorized, user not found", status: 401 });
        }

        const repo = await prisma.repo.findFirst({
            where: {
                id: id,
                userId: user.id,
            },
        });

        if (!repo) {
            return response({ message: "Repo not found", status: 404 });
        }
        return response({ message: "Repo fetched successfully", data: repo, status: 200 });
        
    } catch (error) {
        return response({ message: "Something went wrong", status: 500 });
    }
} 