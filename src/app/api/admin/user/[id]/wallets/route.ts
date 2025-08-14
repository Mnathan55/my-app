import { NextResponse } from "next/server";
import {prisma} from "../../../../../../lib/prisma";

interface Params {
  params: { id: string };
}

export async function POST(req: Request, { params }: Params) {
  const userId = params.id;
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
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err.message || "Internal Server Error", {
      status: 500,
    });
  }
}
