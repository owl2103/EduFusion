import { type NextRequest, NextResponse } from "next/server"
import { getUsersCollection } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const usersCollection = await getUsersCollection()
    const existingUser = await usersCollection.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      name: name || "User",
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      user: {
        id: result.insertedId,
        email,
        name: name || "User",
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
