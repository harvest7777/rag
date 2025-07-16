"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { LuTag } from "react-icons/lu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTagStore } from "@/stores/useTagStore";
import TagDisplay from "./TagDisplay";

type Props = {
  className?: string;
};
export default function ManageTags({ className }: Props) {
  const [open, setOpen] = useState(false);
  const tags = useTagStore((state) => state.tags);

  if (!tags) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={` ${className}`} variant="sidebar">
          <LuTag />
          Manage Tags
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>Edit your tags here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 grid-cols-2">
          {tags?.map((tag) => (
            <div key={tag.id}>
              <TagDisplay tag={tag} />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
