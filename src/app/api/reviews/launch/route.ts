import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { period } = await req.json();
  const employees = await prisma.employee.findMany({ include: { manager: true } });
  for (const e of employees) {
    await prisma.review.create({ data: { employeeId: e.id, reviewerId: e.id, period, feedback: "" } });
    if (e.managerId) {
      await prisma.review.create({ data: { employeeId: e.id, reviewerId: e.managerId, period, feedback: "" } });
    }
    const peer = employees.find((p) => p.id !== e.id && p.id !== e.managerId);
    if (peer) {
      await prisma.review.create({ data: { employeeId: e.id, reviewerId: peer.id, period, feedback: "" } });
    }
  }
  return NextResponse.json({ ok: true });
}
