import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const {
      productId,
      warehouseId,
      quantity
    } = body;

    const result = await prisma.$transaction(async (tx) => {

      await tx.$queryRaw`
        SELECT * FROM "Inventory"
        WHERE "productId"=${productId}
        AND "warehouseId"=${warehouseId}
        FOR UPDATE
      `;

      const inventory = await tx.inventory.findFirst({
        where: {
          productId,
          warehouseId,
        },
      });

      if (!inventory) {
        throw new Error("NOT_FOUND");
      }

      const available =
        inventory.totalStock - inventory.reservedStock;

      if (available < quantity) {
        throw new Error("OUT_OF_STOCK");
      }

      await tx.inventory.update({
        where: {
          id: inventory.id,
        },
        data: {
          reservedStock: {
            increment: quantity,
          },
        },
      });

      const reservation = await tx.reservation.create({
        data: {
          productId,
          warehouseId,
          quantity,
          status: "PENDING",
          expiresAt: new Date(
            Date.now() + 10 * 60 * 1000
          ),
        },
      });

      return reservation;
    });

    return NextResponse.json(result);

  } catch (error: any) {

    if (error.message === "OUT_OF_STOCK") {
      return NextResponse.json(
        { error: "Not enough stock available" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}