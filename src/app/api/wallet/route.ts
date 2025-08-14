import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession, Transaction, Wallet } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

  // Find the logged-in user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      wallets: { include: { transactions: true } },
    },
  });

  if (!user) return new NextResponse("User not found", { status: 404 });

  // Convert Decimal to string
  const formattedWallets = user.wallets.map((w: Wallet) => ({
    ...w,
    balance: w.balance.toString(),
    transactions: w.transactions.map((tx: Transaction) => ({ ...tx, amount: tx.amount.toString() })),
  }));

  return NextResponse.json(formattedWallets);
}
