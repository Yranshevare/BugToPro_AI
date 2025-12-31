import axios from "axios";
import { supabase } from "./supabaseClient";

export default async function secureReq(url: string) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
        throw new Error("No auth token found");
    }

    const res = await axios.get(`${url}?token=${token}`);

    return res;
}