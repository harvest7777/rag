import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserSettingsState {
  showSources: boolean;
}

interface UserSettingsActions {
  setShowSources: (showSources: boolean) => void;
}

type UserSettingsStore = UserSettingsState & UserSettingsActions;
export const useUserSettingsStore = create<UserSettingsStore>()(
  persist(
    (set) => ({
      showSources: false,
      setShowSources: (showSources: boolean) => set({ showSources }),
    }),
    {
      name: "user-settings-store",
    }
  )
);
