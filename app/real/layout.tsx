"use client";

import { AuthProvider } from "../auth/AuthContext";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import NavBar from "../NavBar";
import { useFileMetadataStore } from "@/stores/useFileMetadataStore";
import { useEffect } from "react";
import { getFileMetadata, getFileTags, getTags } from "../(api)/file-services";
import { useTagStore } from "@/stores/useTagStore";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // nuance but we only rely on the file validation to revalidate the whole cache ( tag and file)
  const lastValidated = useFileMetadataStore((state) => state.lastValidated);
  const setLastValidated = useFileMetadataStore(
    (state) => state.setLastValidated
  );
  const setFiles = useFileMetadataStore((state) => state.setFiles);
  const setTags = useTagStore((state) => state.setTags);
  const setFileTags = useFileMetadataStore((state) => state.setFileTags);
  const hasHydrated = useFileMetadataStore((state) => state.hasHydrated);

  useEffect(() => {
    const initializeData = async () => {
      const fetchedFileMetadata = await getFileMetadata();
      setFiles(fetchedFileMetadata);
      const fetchedFileTags = await getFileTags();
      setFileTags(fetchedFileTags);
      const fetchedTags = await getTags();
      setTags(fetchedTags);
      setLastValidated(Date.now());
    };

    if (!lastValidated && hasHydrated === true) {
      initializeData();
    }
  }, [
    lastValidated,
    hasHydrated,
    setFiles,
    setFileTags,
    setTags,
    setLastValidated,
  ]);

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
