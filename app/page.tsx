"use client";

import { Button } from "@/components/ui/button";
import { login } from "./auth/helpers";

export default function Home() {
  return (
    <div>
      <Button onClick={login}>Log In</Button>
    </div>
  );
}
