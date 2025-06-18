"use client";
import { Button } from "@/components/ui/button";
import { createTag } from "@/app/(api)/tag-services";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import ErrorMessage from "@/components/ui/error-message";
import { colorsToClass } from "../types";

type Props = {
  className?: string;
};
export default function CreateTag({ className }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<Colors>("gray");
  const auth = useAuth();

  const handleSubmit = async () => {
    if (!auth || !auth.session) throw new Error("User not authenticated");
    try {
      await createTag(auth.session.user.id, name, selectedColor);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }
      throw error;
    }
    setName("");
    setError("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form className="w-full">
        <DialogTrigger asChild>
          <Button className={`!w-full ${className}`} variant="sidebar">
            <FaPlus className="text-xl" />
            Create Tag
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create A Tag</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <div className="flex gap-x-2 items-center align-middle">
                <Label htmlFor="name-1">Name</Label>
                <ErrorMessage message={error} />
              </div>
              <Input
                id="name-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="name"
                placeholder="English 101 📚"
              />
            </div>

            <Label htmlFor="color-1">Pick a Color</Label>
            <div className="w-full md:flex grid grid-cols-4 gap-5 justify-between">
              {Object.entries(colorsToClass).map(
                ([name, { class: colorClass, ring }]) => (
                  <button
                    key={name}
                    onClick={() => setSelectedColor(name as Colors)}
                    className="w-fullflex items-center justify-center align-middle"
                  >
                    <div
                      className={`
            w-6 h-6 rounded-full click-animation
            ${selectedColor === name ? `ring-2 ${ring}` : ""}
            ${colorClass}
          `}
                    ></div>
                  </button>
                )
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="default">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit} variant={"special"}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
