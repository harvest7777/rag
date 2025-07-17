"use client";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBillStore } from "./useBillStore";

const billTypes = [
  "hr",       // House Bill
  "s",        // Senate Bill
  "hjres",    // House Joint Resolution
  "sjres",    // Senate Joint Resolution
  "hconres",  // House Concurrent Resolution
  "sconres",  // Senate Concurrent Resolution
  "hres",     // House Resolution
  "sres"      // Senate Resolution
];

export default function SelectBillTypeDropdown() {
  const {billType, setBillType} = useBillStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-40" variant="outline">{billType ? `${billType}` : "Select Bill Type"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit h-56" align="start">
        {billTypes.map((type) => (
          <DropdownMenuItem key={type} onClick={() => setBillType(type)}>
            {type}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
