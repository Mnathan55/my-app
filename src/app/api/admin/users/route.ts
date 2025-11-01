import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const users = await prisma.user.findMany({
      include: { wallets: true },
      orderBy: { createdAt: "desc" },
    });

    // Add kycStatus, adhar, and pan to each user
    const usersWithKyc = users.map(user => ({
      ...user,
      kycStatus: user.kycStatus,
      adhar: user.adhar,
      pan: user.pan,
    }));

    return NextResponse.json(usersWithKyc);
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}