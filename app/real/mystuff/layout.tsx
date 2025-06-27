"use client";

import SideBar from "./_components/MyStuffSidebar";
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row  justify-center w-full">
      <SideBar className="px-2  min-w-fit w-1/5 h-screen" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
