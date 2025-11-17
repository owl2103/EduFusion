import { connectToDatabase } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

async function getTeachersCollection() {
  const { db } = await connectToDatabase()
  return db.collection("teachers")
}

export async function GET() {
  try {
    const teachersCollection = await getTeachersCollection()
    const teachers = await teachersCollection.find({}).toArray()
    return NextResponse.json(teachers)
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const teachersCollection = await getTeachersCollection()
    const body = await request.json()

    const teacherData = {
      name: body.name || "",
      subject: body.subject || "",
      students: body.students || 0,
      attendance: body.attendance || 0,
      avgGrade: body.avgGrade || 0,
      engagement: body.engagement || 0,
      rating: body.rating || 0,
      status: body.status || "Excellent",
      email: body.email || "",
      department: body.department || "",
      experience: body.experience || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await teachersCollection.insertOne(teacherData)

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating teacher:", error)
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const teachersCollection = await getTeachersCollection()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
    }

    const result = await teachersCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Teacher deleted successfully" })
  } catch (error) {
    console.error("Error deleting teacher:", error)
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 })
  }
}
