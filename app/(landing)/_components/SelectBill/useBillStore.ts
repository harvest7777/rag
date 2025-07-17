import { create } from "zustand";

interface BillState {
    congress: number | undefined;
    billType: string | undefined;
    billNumber: number | undefined;
}

interface BillActions {
    setCongress: (congress: number) => void;
    setBillType: (billType: string) => void;
    setBillNumber: (billNumber: number | undefined) => void;
}

type BillStore = BillState & BillActions;

export const useBillStore = create<BillStore>()(
    (set) => ({
        congress: undefined,
        billType: undefined,
        billNumber: undefined,
        setCongress: (congress: number) => set({ congress }),
        setBillType: (billType: string) => set({ billType }),
        setBillNumber: (billNumber: number | undefined) => set({ billNumber }),
    }),
  )

