import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import otpGenerator from 'otp-generator';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // Set expiry time (10 minutes from now)
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with reset token and expiry
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: otp,
        resetTokenExpiry: expiryTime,
      },
    });

    // Return OTP directly for direct password reset
    return NextResponse.json({
      message: 'Password reset initiated',
      otp: otp, // Return OTP directly for development/testing
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
