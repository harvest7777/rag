"use client";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBillStore } from "./useBillStore";

const getTotalCongressCount = (): number => {
  const startYear = 1935; // 74th Congress start year
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() is zero-based
  const day = now.getDate();

  // Calculate how many years since 1935
  let yearsSince = year - startYear;

  // Adjust if current date is before Jan 3 of an odd year
  if (year % 2 === 1 && (month < 1 || (month === 1 && day < 3))) {
    yearsSince -= 1;
  } else if (year % 2 === 0) {
    // For even years, the Congress number is based on previous odd year
    yearsSince -= 1;
  }

  // 74th Congress started in 1935
  return 74 + Math.floor(yearsSince / 2);
};

const totalCongressCount = getTotalCongressCount();
// eslint-disable-next-line react-hooks/rules-of-hooks
console.log(totalCongressCount);

export default function SelectCongressDropdown() {
  const {congress, setCongress} = useBillStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-40" variant="outline">{congress ? `Congress ${congress}` : "Select Congress"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 h-56" align="start">
        {Array.from({length: totalCongressCount}).map((_, index)=> 
        {
          const congress = totalCongressCount - index;
          return <DropdownMenuItem key={congress} onClick={()=>setCongress(congress)}>Congress {congress}</DropdownMenuItem>
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
