import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const review = await prisma.review.update({ where: { id: params.id }, data });
  return NextResponse.json(review);
}
