"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/supabase";

export default function Home() {
  const helloWorld = async () => {
    const { data, error } = await supabase.functions.invoke(
      "get-presigned-url",
      {
        body: {
          filename: "hello freaky",
          contentType: "text/plain",
        },
      }
    );
    console.log(data, error);
  };

  return (
    <main className="min-h-screen flex flex-col items-center">
      <p>hello world </p>
      <Button onClick={helloWorld}>Get Presigned URL</Button>
    </main>
  );
}
