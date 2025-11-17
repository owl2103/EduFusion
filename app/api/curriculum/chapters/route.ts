import { connectToDatabase } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

async function getChaptersCollection() {
  const { db } = await connectToDatabase()
  return db.collection("curriculum_chapters")
}

async function getLessonsCollection() {
  const { db } = await connectToDatabase()
  return db.collection("curriculum_lessons")
}

async function getSubjectsCollection() {
  const { db } = await connectToDatabase()
  return db.collection("curriculum_subjects")
}

export async function GET(request: NextRequest) {
  try {
    const chaptersCollection = await getChaptersCollection()
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get("subjectId")

    let query = {}
    if (subjectId) {
      query = { subjectId }
    }

    const chapters = await chaptersCollection.find(query).toArray()
    return NextResponse.json(chapters)
  } catch (error) {
    console.error("Error fetching chapters:", error)
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const chaptersCollection = await getChaptersCollection()
    const lessonsCollection = await getLessonsCollection()
    const subjectsCollection = await getSubjectsCollection()
    const body = await request.json()

    const chapterData = {
      subjectId: body.subjectId || "",
      name: body.name || "",
      duration: body.duration || "",
      dueDate: body.dueDate || "",
      topics: body.topics || 0,
      completedTopics: 0,
      status: "todo",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await chaptersCollection.insertOne(chapterData)

    // Update subject total units
    if (body.subjectId) {
      await subjectsCollection.updateOne(
        { _id: new ObjectId(body.subjectId) },
        { $inc: { totalUnits: 1 }, $set: { updatedAt: new Date() } }
      )
    }

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating chapter:", error)
    return NextResponse.json({ error: "Failed to create chapter" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const chaptersCollection = await getChaptersCollection()
    const lessonsCollection = await getLessonsCollection()
    const subjectsCollection = await getSubjectsCollection()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Chapter ID is required" }, { status: 400 })
    }

    // Get chapter to find subjectId
    const chapter = await chaptersCollection.findOne({ _id: new ObjectId(id) })
    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 })
    }

    // Delete all lessons for this chapter
    await lessonsCollection.deleteMany({ chapterId: id })

    // Delete the chapter
    const result = await chaptersCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 })
    }

    // Update subject total units
    if (chapter.subjectId) {
      await subjectsCollection.updateOne(
        { _id: new ObjectId(chapter.subjectId) },
        { $inc: { totalUnits: -1 }, $set: { updatedAt: new Date() } }
      )
    }

    return NextResponse.json({ success: true, message: "Chapter deleted successfully" })
  } catch (error) {
    console.error("Error deleting chapter:", error)
    return NextResponse.json({ error: "Failed to delete chapter" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const chaptersCollection = await getChaptersCollection()
    const subjectsCollection = await getSubjectsCollection()
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: "Chapter ID is required" }, { status: 400 })
    }

    // Get the current chapter to find subjectId
    const currentChapter = await chaptersCollection.findOne({ _id: new ObjectId(body.id) })
    if (!currentChapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 })
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (body.name) updateData.name = body.name
    if (body.duration) updateData.duration = body.duration
    if (body.dueDate) updateData.dueDate = body.dueDate
    if (body.topics !== undefined) updateData.topics = body.topics
    if (body.completedTopics !== undefined) updateData.completedTopics = body.completedTopics
    if (body.status) updateData.status = body.status

    const result = await chaptersCollection.updateOne({ _id: new ObjectId(body.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 })
    }

    // Update subject progress if status changed
    if (body.status && currentChapter.subjectId) {
      const allChapters = await chaptersCollection.find({ subjectId: currentChapter.subjectId }).toArray()
      const totalChapters = allChapters.length
      const completedChapters = allChapters.filter((c) => c.status === "completed").length
      const overallProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0

      await subjectsCollection.updateOne(
        { _id: new ObjectId(currentChapter.subjectId) },
        {
          $set: {
            completedUnits: completedChapters,
            overallProgress,
            updatedAt: new Date(),
          },
        }
      )
    }

    // Return the updated chapter
    const updatedChapter = await chaptersCollection.findOne({ _id: new ObjectId(body.id) })

    return NextResponse.json({ 
      success: true, 
      message: "Chapter updated successfully",
      chapter: updatedChapter 
    })
  } catch (error) {
    console.error("Error updating chapter:", error)
    return NextResponse.json({ error: "Failed to update chapter" }, { status: 500 })
  }
}

