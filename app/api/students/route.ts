import { connectToDatabase } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

async function getStudentsCollection() {
  const { db } = await connectToDatabase()
  return db.collection("students")
}

export async function GET() {
  try {
    const studentsCollection = await getStudentsCollection()
    const students = await studentsCollection.find({}).toArray()
    return NextResponse.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const studentsCollection = await getStudentsCollection()
    const body = await request.json()

    const studentData = {
      name: body.name || "",
      email: body.email || "",
      grade: body.grade || "",
      department: body.department || "",
      gpa: body.gpa || 0,
      attendance: body.attendance || 0,
      status: body.status || "Active",
      courses: body.courses || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await studentsCollection.insertOne(studentData)

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const studentsCollection = await getStudentsCollection()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    const result = await studentsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Student deleted successfully" })
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 })
  }
}
