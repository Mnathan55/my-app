import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "../../../../../../lib/prisma";
import { authOptions } from "../../../../../../lib/authOptions";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId } = await params;

    // Update KYC status to APPROVED
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: "APPROVED" },
    });

    return NextResponse.json({ message: "KYC approved", user: updatedUser });
  } catch (err) {
    console.error("PUT /api/admin/kyc/[userId]/approve error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
