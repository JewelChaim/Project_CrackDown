import { NextResponse } from "next/server";
import { fetchApploiJobs } from "@/lib/apploi";

export async function GET() {
  const data = await fetchApploiJobs();
  return NextResponse.json(data);
}
