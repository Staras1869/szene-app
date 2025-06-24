import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, username } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.user
      .findUnique({
        where: { email },
      })
      .catch(() => null)

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user
      .create({
        data: {
          email,
          fullName,
          username,
          password: hashedPassword, // Add password field
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          username: true,
          avatarUrl: true,
          city: true,
          isVerified: true,
          isPremium: true,
          createdAt: true,
        },
      })
      .catch((error) => {
        console.error("User creation error:", error)
        return null
      })

    if (!user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "fallback-secret-change-me", {
      expiresIn: "7d",
    })

    return NextResponse.json({
      user,
      token,
      message: "User created successfully",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
