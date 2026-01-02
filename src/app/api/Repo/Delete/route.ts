import prisma from "@/lib/prisma";
import response from "@/lib/Reaponse";
import { supabaseServer } from "@/lib/supabaseServer";
import { NextRequest } from "next/server";

export async function DELETE(req:NextRequest){
    try {
        const token = req.nextUrl.searchParams.get("token");
        const repoId = req.nextUrl.searchParams.get("repoId");

        if (!token) {
            return response({ message: "Unauthorized, token not found", status: 401 });
        }
        if (!repoId) {
            return response({ message: "Bad Request, repoId not found", status: 400 });
        }

        const { data: { user }, error } = await supabaseServer.auth.getUser(token);

        if (error || !user) {
            return response({ message: "Unauthorized, user not found", status: 401 });
        }

        const repo = await prisma.repo.findFirst({
            where: {
                id: repoId,
                userId: user.id,
            },
        });

        if (!repo) {
            return response({ message: "Repo not found", status: 404 });
        }

        await prisma.repo.delete({
            where: {
                id: repoId,
            },
        })

        return response({ message: "Repo deleted successfully", status: 200 });
        
    } catch (error) {
        return response({message:"Internal Server Error",status:500, error: error instanceof Error ? error.message : "Unknown Error"});
    }
}