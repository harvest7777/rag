"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth/AuthContext";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  const auth = useAuth();

  if (!auth) return null;

  const handleLogin = async () => {
    await auth.login();
  };

  return (
    <main className="min-h-screen flex flex-col items-center">
      <ThemeSwitcher />
      <Button variant={"secondary"} onClick={handleLogin}>
        Sign In With Google
      </Button>
      <p>{auth.user?.email}</p>
    </main>
  );
}
