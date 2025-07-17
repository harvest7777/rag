import SelectCongressDropdown from "./SelectCongressDropdown";
import SelectBillTypeDropdown from "./SelectBillTypeDropdown";
import InputBillNumber from "./InputBillNumber";
import {  BillSchema } from "@/app/api/bills/route";
import { Button } from "@/components/ui/button";
import { useBillStore } from "./useBillStore";

export default function SelectBillContainer() {
  const {billNumber, billType, congress} = useBillStore();
  const getBill = async() => {

    const data = {
      congress: congress, 
      billType: billType, 
      billNumber: billNumber
    }
    const parsed = BillSchema.safeParse(data)

    const res = await fetch("/api/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data), // or just data since TS ensures shape
    });

    if (!res.ok) {
      throw new Error("Failed to send data");
    }

    return res.json();
  }
  return (
    <div className="flex gap-5">
        <SelectCongressDropdown />
        <SelectBillTypeDropdown />
        <InputBillNumber />
        <Button onClick={()=>getBill()} variant={"special"}>Test</Button>
    </div>
  );
}
