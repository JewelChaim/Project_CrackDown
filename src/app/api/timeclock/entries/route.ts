import { NextResponse } from "next/server";
import { fetchTimeEntries } from "@/lib/hostedtime";

export async function GET() {
  const data = await fetchTimeEntries();
  return NextResponse.json(data);
}
