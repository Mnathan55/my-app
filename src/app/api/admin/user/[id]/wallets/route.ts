import { NextResponse } from "next/server";
import {prisma} from "../../../../../../lib/prisma";


export async function POST(req: Request, { params }: { params: Promise<{id: string}>}) {
    const { id } = await params;
  const userId = id;
  const body = await req.json();
  const { chain, address, balance } = body;

  if (!chain || !address || balance === undefined) {
    return new NextResponse("Missing wallet fields", { status: 400 });
  }

  try {
    const newWallet = await prisma.wallet.create({
      data: {
        chain,
        address,
        balance: parseFloat(balance), // convert string to Decimal
        userId,
      },
    });

    return NextResponse.json(newWallet);
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) {
      return new NextResponse(err.message || "Internal Server Error", {
        status: 500,
      });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
