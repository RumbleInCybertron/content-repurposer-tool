// frontend/app/api/profile/route.ts

import { prisma } from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("Full URL:", req.nextUrl.href);
  console.log("Search Params:", req.nextUrl.searchParams.toString());

  const email = req.nextUrl.searchParams.get("email");
  console.log("Email received in API:", email);
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, preferences } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate preferences structure if provided
    const validatedPreferences = preferences ? validatePreferences(preferences) : undefined;

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name,
        preferences: validatedPreferences,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

const validatePreferences = (preferences: Record<string, unknown>) => {
  // Add validation logic for preferences structure
  const defaultPreferences = {
    theme: "light",
    notifications: { email: true, push: false },
    integrations: { twitter: false, linkedin: false },
  };

  return { ...defaultPreferences, ...preferences };
}