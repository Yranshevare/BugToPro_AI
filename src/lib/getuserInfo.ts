import { supabase } from "./supabaseClient";

export default async function getUserInfo() {
    const user = { name: "", email: "", error: "" };

    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
        user.error = "No user data found";
    }
    if (session) {
        const { name, email } = session.user.user_metadata;
        user.name = name;
        user.email = email;
    }

    return user;
}
