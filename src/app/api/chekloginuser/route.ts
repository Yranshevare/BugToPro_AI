// app/api/chekloginuser/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gzwhjsgdfirtdioswkng.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SECREAT_KEY as string; // Add to .env

console.log(supabaseServiceKey)

const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

export async function GET(request: NextRequest) {
    try {
        // Extract token from Authorization header
        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.replace("Bearer ", "");
        // console.log(token);
        if (!token) {
            return NextResponse.json({ error: "No token provided" }, { status: 401 });
        }

        // Verify token with Supabase → get verified user
        const {
            data: { user },
            error,
        } = await supabaseServer.auth.getUser(token);

        console.log(user);

        if (error || !user) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // ✅ User is authenticated! Fetch from your OTHER database
        const userData = await fetchUserDataFromOtherDB(user.id); // Your custom logic

        return NextResponse.json({
            supabaseUser: { id: user.id, email: user.email },
            customUserData: userData,
        });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Your function to query OTHER database (replace with real DB)
async function fetchUserDataFromOtherDB(supabaseUserId: string) {
    // Example: MongoDB, PostgreSQL, MySQL, etc.
    // const user = await yourOtherDB.users.findOne({ supabase_id: supabaseUserId });

    // Mock data for now
    return { name: "John Doe", profile: "Premium User", supabase_id: supabaseUserId };
}
