"use client";
import { useAuth } from "../auth/AuthContext";
import { Button } from "@/components/ui/button";

export default function RealPage() {
  const auth = useAuth();
  if (!auth) {
    return null; // or a loading state
  }
  return <Button onClick={() => auth.login()}>sign in</Button>;
}
