import { connectToDatabase } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

async function getSubjectsCollection() {
  const { db } = await connectToDatabase()
  return db.collection("curriculum_subjects")
}

export async function GET() {
  try {
    const subjectsCollection = await getSubjectsCollection()
    const subjects = await subjectsCollection.find({}).toArray()
    return NextResponse.json(subjects)
  } catch (error) {
    console.error("Error fetching subjects:", error)
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const subjectsCollection = await getSubjectsCollection()
    const body = await request.json()

    const subjectData = {
      subject: body.subject || "",
      grade: body.grade || "",
      totalUnits: 0,
      completedUnits: 0,
      overallProgress: 0,
      status: "todo",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await subjectsCollection.insertOne(subjectData)

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating subject:", error)
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const subjectsCollection = await getSubjectsCollection()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Subject ID is required" }, { status: 400 })
    }

    // Also delete all chapters and lessons for this subject
    const { db } = await connectToDatabase()
    const chaptersCollection = db.collection("curriculum_chapters")
    const lessonsCollection = db.collection("curriculum_lessons")

    // Delete all lessons first
    await lessonsCollection.deleteMany({ subjectId: id })
    // Delete all chapters
    await chaptersCollection.deleteMany({ subjectId: id })
    // Delete the subject
    const result = await subjectsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Subject deleted successfully" })
  } catch (error) {
    console.error("Error deleting subject:", error)
    return NextResponse.json({ error: "Failed to delete subject" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const subjectsCollection = await getSubjectsCollection()
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: "Subject ID is required" }, { status: 400 })
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (body.status) updateData.status = body.status
    if (body.subject) updateData.subject = body.subject
    if (body.grade) updateData.grade = body.grade

    const result = await subjectsCollection.updateOne({ _id: new ObjectId(body.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    // Return the updated subject
    const updatedSubject = await subjectsCollection.findOne({ _id: new ObjectId(body.id) })

    return NextResponse.json({ 
      success: true, 
      message: "Subject updated successfully",
      subject: updatedSubject 
    })
  } catch (error) {
    console.error("Error updating subject:", error)
    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 })
  }
}

