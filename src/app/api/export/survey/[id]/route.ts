import { NextResponse, type NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop() || "";
  const prisma = new PrismaClient();
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

