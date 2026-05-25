import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  const products = await prisma.inventory.findMany({
    include: {
      product: true,
      warehouse: true,
    },
  });

  return NextResponse.json(products);
}