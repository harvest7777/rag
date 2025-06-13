"use client";

import { AuthProvider } from "../auth/AuthContext";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import NavBar from "../NavBar";
import { useFileMetadataStore } from "@/stores/useFileMetadata";
import { useEffect } from "react";
import { getFileMetadata } from "../(api)/file-services";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const files = useFileMetadataStore((state) => state.files);
  const setFiles = useFileMetadataStore((state) => state.setFiles);
  const hasHydrated = useFileMetadataStore((state) => state.hasHydrated);

  useEffect(() => {
    const initializeData = async () => {
      const fetchedFileMetadata = await getFileMetadata();
      setFiles(fetchedFileMetadata);
    };

    if (!files && hasHydrated === true) {
      initializeData();
    }
  }, [hasHydrated, files, setFiles]);

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
