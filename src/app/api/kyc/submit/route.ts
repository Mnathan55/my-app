import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/authOptions";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { pan, adhar } = await request.json();

    if (!pan || !adhar) {
      return new NextResponse("PAN and Aadhaar are required", { status: 400 });
    }

    // Validate PAN format (5 letters, 4 numbers, 1 letter)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan)) {
      return new NextResponse("Invalid PAN format", { status: 400 });
    }

    // Validate Aadhaar format (12 digits)
    const adharRegex = /^\d{12}$/;
    if (!adharRegex.test(adhar)) {
      return new NextResponse("Invalid Aadhaar format", { status: 400 });
    }

    // Update user with KYC details
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        pan,
        adhar,
        kycStatus: "PENDING",
      },
    });

    return NextResponse.json({ message: "KYC submitted successfully", user: updatedUser });
  } catch (err) {
    console.error("POST /api/kyc/submit error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
