import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const segments = req.nextUrl.pathname.split("/");
  const id = segments[segments.length - 1];
  const rows = await prisma.surveyResponse.findMany({ where: { surveyId: id }, orderBy: { createdAt: "desc" } });

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
      "Content-Disposition": `attachment; filename="survey_${id}.csv"`
    }
  });
}

