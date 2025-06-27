import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FileMetadataState {
  files: FileMetadata[] | null;
  fileTags: FileTag[] | null;
  hasHydrated: boolean;
  lastValidated: number | null;
}

interface FileMetadataActions {
  addFile: (file: FileMetadata) => void;
  addTag: (fileUUID: string, tag: Tag) => void;
  updateFile: (updatedFile: FileMetadata) => void;
  setFiles: (files: FileMetadata[] | null) => void;
  removeFile: (fileUUID: string) => void;
  setFileTags: (fileTags: FileTag[] | null) => void;
  addFileTag: (fileTag: FileTag) => void; 
  removeFileTag: (fileUUID: string, tagID: number) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setLastValidated: (timestamp: number | null) => void;
}

type FileMetadataStore = FileMetadataState & FileMetadataActions;
export const useFileMetadataStore = create<FileMetadataStore>()(
  persist(
    (set) => ({
      files: null,
      fileTags: null,
      hasHydrated: false,
      lastValidated: null,
      setLastValidated: (timestamp: number | null) =>
        set({ lastValidated: timestamp }),
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
      setFiles: (files: FileMetadata[] | null) => set({ files }),
      setFileTags: (fileTags: FileTag[] | null) => set({ fileTags }),
      removeFile: (fileUUID: string) =>
        set((state) => ({
          files: state.files
            ? state.files.filter((f) => f.file_uuid !== fileUUID)
            : null,
        })),
      addFileTag: (fileTag: FileTag) =>
        set((state) => ({
          fileTags: [...(state.fileTags || []), fileTag],
        })),
        removeFileTag: (fileUUID: string, tagID: number) =>
        set((state) => ({
          fileTags: state.fileTags
            ? state.fileTags.filter((ft => !(ft.file_uuid === fileUUID && ft.tag_id === tagID)))
            : null,
        })),
      addTag: (fileUUID: string, tag: Tag) =>
        set((state) => ({
          files: state.files
            ? state.files.map((f) =>
                f.file_uuid === fileUUID
                  ? { ...f, tags: [...(f.tags || []), tag] }
                  : f
              )
            : null,
        })),
      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
    }),
    {
      name: "file-metadata-store",
      onRehydrateStorage: () => (state) => {
        const now = Date.now();
        const maxAge = 1000 * 60 * 60 * 24; // 24 hours
        // const maxAge = 1;
        if (!state?.lastValidated || now - state.lastValidated > maxAge) {
          console.log("Cache is stale, resetting store");
          // Cache is stale — clear all
          state?.setFiles(null);
          state?.setLastValidated(null);
        }
        state?.setHasHydrated(true);
      },
    }
  )
);
