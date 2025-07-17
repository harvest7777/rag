import { Input } from "@/components/ui/input";
import { useBillStore } from "./useBillStore";

export default function InputBillNumber() {
    const { billNumber, setBillNumber } = useBillStore();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBillNumber(value ? Number(value) : undefined);
    };
    return (
        <Input type="number" className="w-40" value={billNumber?? ""} onChange={handleChange} placeholder="Bill Number" />
    )
}