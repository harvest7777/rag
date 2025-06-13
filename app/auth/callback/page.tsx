"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase";
import SpinnerPage from "@/components/ui/spinner-page";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/real/evil");
      } else {
        router.replace("/");
      }
    });
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <SpinnerPage />
    </div>
  );
}
