"use client";
import { Button } from "@/components/ui/button";
import { supabaseDelete } from "@/app/(api)/ai-services";
import { useAuth } from "@/app/auth/AuthContext";

export default function ChatPage() {
  const auth = useAuth();
  if (!auth || !auth.session) return null;
  return (
    <div className="flex flex-col items-center justify-center">
      {/* <Button onClick={() => testAPI(auth.session!.access_token)}>Embed</Button> */}

      {/* <Button onClick={() => testQuery(auth.session!.access_token)}>
        Embed
      </Button> */}

      <Button
        onClick={() => supabaseDelete(auth.session!.access_token, "thank")}
      >
        Embed
      </Button>
    </div>
  );
}
