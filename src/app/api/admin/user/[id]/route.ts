// src/app/api/admin/user/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "../../../../../lib/prisma";
import { authOptions } from "../../../../../lib/authOptions";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  // Still ensure request is authenticated
  if (!session || !session.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
   const { id } = await params;
  const userId = id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallets: {
          include: {
            transactions: true,
          },
        },
        accounts: true,
        sessions: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
