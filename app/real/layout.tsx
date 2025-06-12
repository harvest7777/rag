"use client";

import { AuthProvider } from "../auth/AuthContext";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import NavBar from "../NavBar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system">
        <NavBar />
        <Toaster
          toastOptions={{
            className:
              "dark:!bg-secondary bg-background !text-secondary-foreground",
          }}
        />
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}
