import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FileMetadataState {
  files: FileMetadata[] | null;
  hasHydrated: boolean;
}

interface FileMetadataActions {
  addFile: (file: FileMetadata) => void;
  updateFile: (updatedFile: FileMetadata) => void;
  setFiles: (files: FileMetadata[]) => void;
  removeFile: (fileUUID: string) => void;
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
      updateFile: (updatedFile: FileMetadata) =>
        set((state) => ({
          files: state.files
            ? state.files.map((f) =>
                f.file_uuid === updatedFile.file_uuid ? updatedFile : f
              )
            : null,
        })),
      setFiles: (files: FileMetadata[]) => set({ files }),
      removeFile: (fileUUID: string) =>
        set((state) => ({
          files: state.files
            ? state.files.filter((f) => f.file_uuid !== fileUUID)
            : null,
        })),
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
