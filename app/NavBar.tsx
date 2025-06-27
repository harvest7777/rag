"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth/AuthContext";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useState, useEffect } from "react";
import { getSillyBucks } from "./(api)/user-services";
import Link from "next/link";

export default function NavBar() {
  const auth = useAuth();
  const [sillybucks, setSillyBucks] = useState<number | null>(null);

  const initializeUserData = async () => {
    const fetchedSillyBucks = await getSillyBucks();
    console.log("Fetched SillyBucks:", fetchedSillyBucks);
    setSillyBucks(fetchedSillyBucks);
  };
  useEffect(() => {
    initializeUserData();
  }, []);

  if (!auth) {
    return null; // or a loading state
  }

  return (
    <div className="w-full h-16 flex justify-between items-center px-5 ">
      <Link href="/real/chat" className="text-xl font-semibold">
        freaky pdf rag 🤤🤤
      </Link>
      <div className="flex gap-x-5 items-center">
        <ThemeSwitcher />
        <Button
          className="hover:!ring-blue-100 hover:ring-1 transition-all"
          variant={"ghost"}
          loading={sillybucks === null}
        >
          {sillybucks !== null && `🪙 ${sillybucks}`}
        </Button>
        {auth.user ? (
          <Button onClick={auth.logout}>Sign Out</Button>
        ) : (
          <Button onClick={auth.login}>Sign In</Button>
        )}
      </div>
    </div>
  );
}
