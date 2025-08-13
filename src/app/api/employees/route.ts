import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const employees = await prisma.employee.findMany({
    include: { facility: true, manager: true },
  });
  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  const data = await req.json();
  if (data.managerId === "") delete data.managerId;
  const employee = await prisma.employee.create({ data });
  return NextResponse.json(employee, { status: 201 });
}
