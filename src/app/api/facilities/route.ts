import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const facilities = await prisma.facility.findMany();
  return NextResponse.json(facilities);
}

export async function POST(req: Request) {
  const data = await req.json();
  if (data.capacity) data.capacity = Number(data.capacity);
  const facility = await prisma.facility.create({ data });
  return NextResponse.json(facility, { status: 201 });
}
