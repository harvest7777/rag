"use client";

import ManageFiles from "./_components/ManageFiles";
import SideBar from "./_components/SideBar";
import { useTagStore } from "@/stores/useTagStore";
import { getTags } from "@/app/(api)/tag-services";
import { useEffect } from "react";
import { useAuth } from "@/app/auth/AuthContext";

export default function MyStuffPage() {
  const auth = useAuth();
  const tags: Tag[] | null = useTagStore((state) => state.tags);
  const setTags: (tags: Tag[]) => void = useTagStore((state) => state.setTags);
  const hasHydrated: boolean = useTagStore((state) => state.hasHydrated);
  useEffect(() => {
    console.log(tags);
    const initializeData = async () => {
      if (!auth || !auth.session) throw new Error("User not authenticated");
      const tags = await getTags(auth.session.user.id);
      setTags(tags);
    };
    if (hasHydrated && !tags) {
      initializeData();
    }
  }, []);

  return (
    <div className="flex flex-row  justify-center w-full">
      <SideBar className="px-2  min-w-fit w-1/5 h-screen" />
      <div className="flex-1 flex flex-col gap-y-2 px-5">
        <div className="h-10 w-full rounded-md bg-muted flex items-center align-middle p-2">
          Search
        </div>
        <ManageFiles className="bg-muted rounded-xl p-2" />
      </div>
    </div>
  );
}
