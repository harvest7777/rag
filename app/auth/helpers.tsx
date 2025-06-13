import { supabase } from "@/lib/supabase/supabase";
import { redirect } from "next/navigation";

export const logout = async () => {
  await supabase.auth.signOut();
  redirect("/");
};

export const login = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) console.error(error.message);
};
