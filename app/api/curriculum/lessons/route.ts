import { connectToDatabase } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

async function getLessonsCollection() {
  const { db } = await connectToDatabase()
  return db.collection("curriculum_lessons")
}

async function getChaptersCollection() {
  const { db } = await connectToDatabase()
  return db.collection("curriculum_chapters")
}

async function getSubjectsCollection() {
  const { db } = await connectToDatabase()
  return db.collection("curriculum_subjects")
}

export async function GET(request: NextRequest) {
  try {
    const lessonsCollection = await getLessonsCollection()
    const { searchParams } = new URL(request.url)
    const chapterId = searchParams.get("chapterId")
    const subjectId = searchParams.get("subjectId")

    let query: any = {}
    if (chapterId) {
      query.chapterId = chapterId
    }
    if (subjectId) {
      query.subjectId = subjectId
    }

    const lessons = await lessonsCollection.find(query).toArray()
    return NextResponse.json(lessons)
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const lessonsCollection = await getLessonsCollection()
    const chaptersCollection = await getChaptersCollection()
    const subjectsCollection = await getSubjectsCollection()
    const body = await request.json()

    const lessonData = {
      chapterId: body.chapterId || "",
      subjectId: body.subjectId || "",
      name: body.name || "",
      status: body.status || "todo",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await lessonsCollection.insertOne(lessonData)

    // Update chapter topics count
    if (body.chapterId) {
      const chapter = await chaptersCollection.findOne({ _id: new ObjectId(body.chapterId) })
      if (chapter) {
        await chaptersCollection.updateOne(
          { _id: new ObjectId(body.chapterId) },
          { $set: { topics: (chapter.topics || 0) + 1, updatedAt: new Date() } }
        )
      }
    }

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating lesson:", error)
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const lessonsCollection = await getLessonsCollection()
    const chaptersCollection = await getChaptersCollection()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 })
    }

    // Get lesson to find chapterId
    const lesson = await lessonsCollection.findOne({ _id: new ObjectId(id) })
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Delete the lesson
    const result = await lessonsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Update chapter topics count
    if (lesson.chapterId) {
      const chapter = await chaptersCollection.findOne({ _id: new ObjectId(lesson.chapterId) })
      if (chapter) {
        const newTopics = Math.max(0, (chapter.topics || 0) - 1)
        await chaptersCollection.updateOne(
          { _id: new ObjectId(lesson.chapterId) },
          { $set: { topics: newTopics, updatedAt: new Date() } }
        )
      }
    }

    return NextResponse.json({ success: true, message: "Lesson deleted successfully" })
  } catch (error) {
    console.error("Error deleting lesson:", error)
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const lessonsCollection = await getLessonsCollection()
    const chaptersCollection = await getChaptersCollection()
    const subjectsCollection = await getSubjectsCollection()
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 })
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (body.name) updateData.name = body.name
    if (body.status) updateData.status = body.status

    const oldLesson = await lessonsCollection.findOne({ _id: new ObjectId(body.id) })
    const result = await lessonsCollection.updateOne({ _id: new ObjectId(body.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Update chapter completed topics count
    if (oldLesson && oldLesson.chapterId) {
      const lessons = await lessonsCollection.find({ chapterId: oldLesson.chapterId }).toArray()
      const completedCount = lessons.filter((l) => l.status === "completed").length

      await chaptersCollection.updateOne(
        { _id: new ObjectId(oldLesson.chapterId) },
        { $set: { completedTopics: completedCount, updatedAt: new Date() } }
      )

      // Update chapter status
      const chapter = await chaptersCollection.findOne({ _id: new ObjectId(oldLesson.chapterId) })
      if (chapter) {
        // Get all lessons for this chapter to determine actual completion
        const allChapterLessons = await lessonsCollection.find({ chapterId: oldLesson.chapterId }).toArray()
        const actualCompletedCount = allChapterLessons.filter((l) => l.status === "completed").length
        const totalLessons = allChapterLessons.length
        
        let status = "todo"
        if (totalLessons > 0 && actualCompletedCount === totalLessons) {
          status = "completed"
        } else if (actualCompletedCount > 0) {
          status = "in-progress"
        }

        // Update chapter with actual completed count and status
        await chaptersCollection.updateOne(
          { _id: new ObjectId(oldLesson.chapterId) },
          { 
            $set: { 
              status, 
              completedTopics: actualCompletedCount,
              topics: totalLessons, // Update topics to match actual lesson count
              updatedAt: new Date() 
            } 
          }
        )

        // Update subject progress
        if (chapter.subjectId) {
          const allChapters = await chaptersCollection.find({ subjectId: chapter.subjectId }).toArray()
          const totalChapters = allChapters.length
          const completedChapters = allChapters.filter((c) => c.status === "completed").length
          const overallProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0

          await subjectsCollection.updateOne(
            { _id: new ObjectId(chapter.subjectId) },
            {
              $set: {
                completedUnits: completedChapters,
                overallProgress,
                updatedAt: new Date(),
              },
            }
          )
        }
      }
    }

    // Return the updated lesson and related data
    const updatedLesson = await lessonsCollection.findOne({ _id: new ObjectId(body.id) })
    const updatedChapter = oldLesson?.chapterId 
      ? await chaptersCollection.findOne({ _id: new ObjectId(oldLesson.chapterId) })
      : null
    const updatedSubject = updatedChapter?.subjectId
      ? await subjectsCollection.findOne({ _id: new ObjectId(updatedChapter.subjectId) })
      : null

    return NextResponse.json({ 
      success: true, 
      message: "Lesson updated successfully",
      lesson: updatedLesson,
      chapter: updatedChapter,
      subject: updatedSubject
    })
  } catch (error) {
    console.error("Error updating lesson:", error)
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 })
  }
}

