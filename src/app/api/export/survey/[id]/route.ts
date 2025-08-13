import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(_: NextRequest, { params }: any) {
  const rows = await prisma.surveyResponse.findMany({ where: { surveyId: params.id }, orderBy: { createdAt: "desc" } });

  const headers = ["createdAt", "payload"];
  const csv = [
    headers.join(","),
    ...rows.map(r => {
      const payload = JSON.stringify(r.payload ?? {}).replaceAll('"', '""');
      return `${r.createdAt.toISOString()},"${payload}"`;
    })
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="survey_${params.id}.csv"`
    }
  });
}

