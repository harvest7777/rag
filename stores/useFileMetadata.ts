import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FileMetadataState {
  files: FileMetadata[] | null;
  hasHydrated: boolean;
}

interface FileMetadataActions {
  addFile: (file: FileMetadata) => void;
  removeFile: (file: FileMetadata) => void;
  setFiles: (files: FileMetadata[]) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

type FileMetadataStore = FileMetadataState & FileMetadataActions;
export const useFileMetadataStore = create<FileMetadataStore>()(
  persist(
    (set) => ({
      files: null,
      hasHydrated: false,
      addFile: (file: FileMetadata) =>
        set((state) => ({ files: [...(state.files || []), file] })),
      removeFile: (file: FileMetadata) =>
        set((state) => ({
          files: state.files?.filter((f) => f !== file) || null,
        })),
      setFiles: (files: FileMetadata[]) => set({ files }),
      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
    }),
    {
      name: "file-metadata-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
