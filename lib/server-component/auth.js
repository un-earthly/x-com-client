import { supabase } from "@/api"


export const signIn = async (email, password) => await supabase.auth.signIn({
    email,
    password
})
export const signUp = async (data) => await supabase.auth.signIn({
    data
})

export async function signOut() {
    localStorage.removeItem("user");
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error(error.message);
    } else {
        window.location.href = "/login"

    }
}
