// app/api/hello/route.ts
import { NextResponse } from "next/server";
import {z} from "zod";

const CONGRESS_GOV_API_KEY = process.env.CONGRESS_GOV_API_KEY;

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}

export const BillSchema = z.object({
    congress: z.number().positive(), 
    billType: z.string(),
    billNumber: z.number().positive()
})

export type BillDataPayload = z.infer<typeof BillSchema>;

export async function POST(req: Request) {
  const data = await req.json();
  const parsed = BillSchema.safeParse(data);
  const billData = parsed.data;
  const congressGovApiUrl = `https://api.congress.gov/v3/bill/${billData?.congress}/${billData?.billType}/${billData?.billNumber}/text?api_key=${CONGRESS_GOV_API_KEY}`

  fetch(congressGovApiUrl)
  .then(res => res.json())
  .then(data => {
    console.log(data)
  })
  console.log(parsed);

  return NextResponse.json({ received: data });
}
