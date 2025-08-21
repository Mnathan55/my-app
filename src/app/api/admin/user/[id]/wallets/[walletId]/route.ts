import { prisma } from "../../../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; walletId: string }> }
) {
  const { walletId } = await params;

  try {
    const body = await req.json();
    const { balance } = body;

    if (balance === undefined) {
      return new NextResponse("Missing balance", { status: 400 });
    }

    const updatedWallet = await prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: parseFloat(balance),
      },
    });

    return NextResponse.json(updatedWallet);
  } catch (err) {
    console.error("Error updating wallet:", err);

    if (err instanceof Error) {
      return new NextResponse(err.message || "Failed to update wallet", {
        status: 500,
      });
    }

    return new NextResponse("Failed to update wallet", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; walletId: string }> }
) {
  const { walletId } = await params;

  try {
    await prisma.wallet.delete({
      where: { id: walletId },
    });

    return NextResponse.json({ message: "Wallet deleted successfully" });
  } catch (error) {
    console.error("Delete Wallet Error:", error);
    return NextResponse.json(
      { error: "Failed to delete wallet" },
      { status: 500 }
    );
  }
}