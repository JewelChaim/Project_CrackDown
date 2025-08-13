import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const reviews = await prisma.review.findMany({ include: { employee: true, reviewer: true } });
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const data = await req.json();
  const review = await prisma.review.create({ data });
  return NextResponse.json(review, { status: 201 });
}
