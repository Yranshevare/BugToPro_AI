
export default function getUserInfo() {
    const user = {name: "", email: "", error: ""};
    
    const data = localStorage.getItem(`sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_NAME}-auth-token`);
    if (!data) {
        user.error = "No user data found";
    }

    const { name, email } = JSON.parse(data!).user.user_metadata;
    user.name = name;
    user.email = email;

    return user
}
