"use client";

import ManageFiles from "./_components/ManageFiles";

export default function MyStuffPage() {
  return (
    <div className="flex-1 flex flex-col gap-y-2 px-5">
      <div className="h-10 w-full rounded-md bg-muted flex items-center align-middle p-2">
        Search
      </div>
      <ManageFiles className="bg-muted rounded-xl p-2" />
    </div>
  );
}
