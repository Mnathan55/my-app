// File: /api/admin/user/[id]/wallets/[walletId]/route.ts

import { prisma } from "../../../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; walletId: string }> }
) {
  const { walletId } = await params;

  const body = await req.json();
  const { balance } = body;

  if (balance === undefined) {
    return new NextResponse("Missing balance", { status: 400 });
  }

  try {
    const updatedWallet = await prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: parseFloat(balance),
      },
    });

    return NextResponse.json(updatedWallet);
  } catch (err: any) {
    console.error("Error updating wallet:", err);
    return new NextResponse(err.message || "Failed to update wallet", {
      status: 500,
    });
  }
}
