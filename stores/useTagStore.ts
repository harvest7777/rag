import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TagState {
  tags: Tag[] | null;
  hasHydrated: boolean;
}

interface TagActions {
  addTag: (tag: Tag) => void;
  updateTag: (updatedTag: Tag) => void;
  setTags: (tags: Tag[]) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

type TagStore = TagState & TagActions;
export const useTagStore = create<TagStore>()(
  persist(
    (set) => ({
      tags: null,
      hasHydrated: false,
      addTag: (tag: Tag) =>
        set((state) => ({ tags: [...(state.tags || []), tag] })),
      //   might refactor this to use name later because tag x user have a uniqueness constraint
      updateTag: (updatedTag: Tag) =>
        set((state) => ({
          tags: state.tags
            ? state.tags.map((t) => (t.id === updatedTag.id ? updatedTag : t))
            : null,
        })),
      setTags: (tags: Tag[]) => set({ tags }),
      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
    }),
    {
      name: "tag-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
