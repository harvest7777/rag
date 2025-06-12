"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth/AuthContext";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function NavBar() {
  const auth = useAuth();
  if (!auth) {
    return null; // or a loading state
  }

  return (
    <div className="w-full h-16 shadow-sm flex justify-between items-center px-5  ">
      <p className="text-xl">evil pdf reader 😈</p>
      <div className="flex gap-x-5 items-center">
        <ThemeSwitcher />
        <p>silly bucks 💵</p>
        {auth.user ? (
          <Button variant={"secondary"} onClick={auth.logout}>
            Sign Out
          </Button>
        ) : (
          <Button variant={"secondary"} onClick={auth.login}>
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
}
