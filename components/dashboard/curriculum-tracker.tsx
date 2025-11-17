"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { BookOpen, CheckCircle2, Clock, AlertCircle, Search, Filter, Calendar, Plus, Trash2, Edit } from "lucide-react"

interface Subject {
  _id: string
  subject: string
  grade: string
  totalUnits: number
  completedUnits: number
  overallProgress: number
  status?: string
  createdAt?: Date
  updatedAt?: Date
}

interface Chapter {
  _id: string
  subjectId: string
  name: string
  duration: string
  dueDate: string
  topics: number
  completedTopics: number
  status: string
  createdAt?: Date
  updatedAt?: Date
}

interface Lesson {
  _id: string
  chapterId: string
  subjectId: string
  name: string
  status: string
  createdAt?: Date
  updatedAt?: Date
}

export function CurriculumTracker() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedSubjectData, setSelectedSubjectData] = useState<Subject | null>(null)
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false)
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false)
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [formData, setFormData] = useState({
    subject: "",
    grade: "",
    chapterName: "",
    duration: "",
    dueDate: "",
    lessonName: "",
  })

  useEffect(() => {
    fetchData()
    // Listen for curriculum updates
    const handleUpdate = () => fetchData()
    window.addEventListener("curriculumUpdated", handleUpdate)
    return () => window.removeEventListener("curriculumUpdated", handleUpdate)
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [subjectsRes, chaptersRes, lessonsRes] = await Promise.all([
        fetch("/api/curriculum/subjects"),
        fetch("/api/curriculum/chapters"),
        fetch("/api/curriculum/lessons"),
      ])

      if (subjectsRes.ok) {
        const subjectsData = await subjectsRes.json()
        setSubjects(subjectsData)
      }

      if (chaptersRes.ok) {
        const chaptersData = await chaptersRes.json()
        setChapters(chaptersData)
      }

      if (lessonsRes.ok) {
        const lessonsData = await lessonsRes.json()
        setLessons(lessonsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/curriculum/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: formData.subject, grade: formData.grade }),
      })

      if (response.ok) {
        await fetchData()
        setIsAddSubjectOpen(false)
        setFormData({ ...formData, subject: "", grade: "" })
        window.dispatchEvent(new Event("curriculumUpdated"))
      }
    } catch (error) {
      console.error("Error adding subject:", error)
    }
  }

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubjectData) return

    try {
      const response = await fetch("/api/curriculum/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: selectedSubjectData._id,
          name: formData.chapterName,
          duration: formData.duration,
          dueDate: formData.dueDate,
          topics: 0,
        }),
      })

      if (response.ok) {
        await fetchData()
        setIsAddChapterOpen(false)
        setFormData({ ...formData, chapterName: "", duration: "", dueDate: "" })
        window.dispatchEvent(new Event("curriculumUpdated"))
      }
    } catch (error) {
      console.error("Error adding chapter:", error)
    }
  }

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChapter) return

    try {
      const response = await fetch("/api/curriculum/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId: selectedChapter._id,
          subjectId: selectedChapter.subjectId,
          name: formData.lessonName,
          status: "todo",
        }),
      })

      if (response.ok) {
        await fetchData()
        setIsAddLessonOpen(false)
        setFormData({ ...formData, lessonName: "" })
        window.dispatchEvent(new Event("curriculumUpdated"))
      }
    } catch (error) {
      console.error("Error adding lesson:", error)
    }
  }

  const handleDeleteSubject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject? All chapters and lessons will be deleted.")) {
      return
    }

    try {
      const response = await fetch(`/api/curriculum/subjects?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchData()
        if (selectedSubjectData?._id === id) {
          setSelectedSubjectData(null)
        }
        window.dispatchEvent(new Event("curriculumUpdated"))
      }
    } catch (error) {
      console.error("Error deleting subject:", error)
    }
  }

  const handleDeleteChapter = async (id: string) => {
    if (!confirm("Are you sure you want to delete this chapter? All lessons will be deleted.")) {
      return
    }

    try {
      const response = await fetch(`/api/curriculum/chapters?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchData()
        if (selectedChapter?._id === id) {
          setSelectedChapter(null)
        }
        window.dispatchEvent(new Event("curriculumUpdated"))
      }
    } catch (error) {
      console.error("Error deleting chapter:", error)
    }
  }

  const handleDeleteLesson = async (id: string) => {
    try {
      const response = await fetch(`/api/curriculum/lessons?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchData()
        window.dispatchEvent(new Event("curriculumUpdated"))
      }
    } catch (error) {
      console.error("Error deleting lesson:", error)
    }
  }

  const handleToggleLesson = async (lesson: Lesson) => {
    const newStatus = lesson.status === "completed" ? "todo" : "completed"
    try {
      const response = await fetch("/api/curriculum/lessons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lesson._id, status: newStatus }),
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        // Update lesson state immediately
        setLessons((prevLessons) =>
          prevLessons.map((l) =>
            l._id === lesson._id ? { ...l, status: newStatus } : l
          )
        )

        // Update chapter state if returned
        if (data.chapter) {
          setChapters((prevChapters) =>
            prevChapters.map((c) =>
              c._id === data.chapter._id ? { ...c, ...data.chapter } : c
            )
          )
        }

        // Update subject state if returned
        if (data.subject) {
          setSubjects((prevSubjects) =>
            prevSubjects.map((s) =>
              s._id === data.subject._id ? { ...s, ...data.subject } : s
            )
          )
          
          // Update selected subject data if it's the same
          if (selectedSubjectData && selectedSubjectData._id === data.subject._id) {
            setSelectedSubjectData({ ...selectedSubjectData, ...data.subject })
          }
        }

        // Fetch fresh data to ensure everything is in sync
        await fetchData()
        
        // Dispatch events to update dashboard
        window.dispatchEvent(new Event("curriculumUpdated"))
        window.dispatchEvent(new CustomEvent("curriculumProgressUpdated", { 
          detail: { lessonId: lesson._id, status: newStatus } 
        }))
      } else {
        console.error("Error updating lesson:", data.error)
        alert(`Failed to update lesson: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error updating lesson:", error)
      alert("Failed to update lesson. Please try again.")
    }
  }

  const handleUpdateChapterStatus = async (chapter: Chapter, status: string) => {
    try {
      const response = await fetch("/api/curriculum/chapters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: chapter._id, status }),
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        // Update state immediately with returned data or inferred status
        if (data.chapter) {
          setChapters((prevChapters) =>
            prevChapters.map((c) =>
              c._id === chapter._id ? { ...c, ...data.chapter } : c
            )
          )
        } else {
          setChapters((prevChapters) =>
            prevChapters.map((c) =>
              c._id === chapter._id ? { ...c, status } : c
            )
          )
        }
        
        // Fetch fresh data to ensure everything is in sync
        await fetchData()
        
        // Dispatch events to update dashboard and other components
        window.dispatchEvent(new Event("curriculumUpdated"))
        window.dispatchEvent(new CustomEvent("curriculumProgressUpdated", { 
          detail: { chapterId: chapter._id, status } 
        }))
      } else {
        console.error("Error updating chapter:", data.error)
        alert(`Failed to update chapter: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error updating chapter:", error)
      alert("Failed to update chapter. Please try again.")
    }
  }

  const handleUpdateSubjectStatus = async (subject: Subject, status: string) => {
    try {
      const response = await fetch("/api/curriculum/subjects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: subject._id, status }),
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        // Update state immediately with returned data or inferred status
        if (data.subject) {
          setSubjects((prevSubjects) =>
            prevSubjects.map((s) =>
              s._id === subject._id ? { ...s, ...data.subject } : s
            )
          )
        } else {
          setSubjects((prevSubjects) =>
            prevSubjects.map((s) =>
              s._id === subject._id ? { ...s, status } : s
            )
          )
        }
        
        // Fetch fresh data to ensure everything is in sync
        await fetchData()
        
        // Dispatch events to update dashboard and other components
        window.dispatchEvent(new Event("curriculumUpdated"))
        window.dispatchEvent(new CustomEvent("curriculumProgressUpdated", { 
          detail: { subjectId: subject._id, status } 
        }))
      } else {
        console.error("Error updating subject:", data.error)
        alert(`Failed to update subject: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error updating subject:", error)
      alert("Failed to update subject. Please try again.")
    }
  }

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.grade.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = selectedSubject === "all" || subject.subject === selectedSubject
    return matchesSearch && matchesSubject
  })

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "text-green-400"
    if (progress >= 75) return "text-blue-400"
    if (progress >= 50) return "text-amber-400"
    return "text-red-400"
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "in-progress":
        return "bg-blue-500/20 text-blue-400"
      default:
        return "bg-amber-500/20 text-amber-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />
      case "in-progress":
        return <Clock className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const totalUnits = subjects.reduce((sum, s) => sum + s.totalUnits, 0)
  const completedUnitsTotal = subjects.reduce((sum, s) => sum + s.completedUnits, 0)
  const overallProgress = totalUnits > 0 ? Math.round((completedUnitsTotal / totalUnits) * 100) : 0

  const subjectChapters = selectedSubjectData
    ? chapters.filter((c) => c.subjectId === selectedSubjectData._id)
    : []

  const curriculumProgressDist = [
    {
      name: "Completed",
      value: subjects.reduce((sum, s) => sum + s.completedUnits, 0),
      color: "#10b981",
    },
    {
      name: "In Progress",
      value: subjects.reduce(
        (sum, s) => sum + (s.totalUnits - s.completedUnits > 0 && s.completedUnits > 0 ? 1 : 0),
        0
      ),
      color: "#6366f1",
    },
    {
      name: "Planned",
      value: subjects.reduce((sum, s) => sum + (s.completedUnits === 0 ? s.totalUnits : 0), 0),
      color: "#f59e0b",
    },
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="units">Units & Lessons</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{subjects.length}</div>
                  <p className="text-sm text-muted-foreground mt-1">Subjects</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{totalUnits}</div>
                  <p className="text-sm text-muted-foreground mt-1">Total Units</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getProgressColor(overallProgress)}`}>{overallProgress}%</div>
                  <p className="text-sm text-muted-foreground mt-1">Overall Progress</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400">{completedUnitsTotal}</div>
                  <p className="text-sm text-muted-foreground mt-1">Completed Units</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search, Filters, and Add Button */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search curriculum..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border focus:border-primary"
                />
              </div>
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full md:w-40 bg-input border-border">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject._id} value={subject.subject}>
                    {subject.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => setIsAddSubjectOpen(true)}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </div>

          {/* Curriculum Cards */}
          {loading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : filteredSubjects.length === 0 ? (
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No subjects found. Click "Add Subject" to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSubjects.map((subject) => {
                // Determine status: use explicit status if set, otherwise infer from progress
                const subjectStatus = subject.status || 
                  (subject.completedUnits === subject.totalUnits && subject.totalUnits > 0 
                    ? "completed" 
                    : subject.completedUnits > 0 
                    ? "in-progress" 
                    : "todo")
                
                return (
                  <Card
                    key={subject._id}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary/50 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 cursor-pointer" onClick={() => setSelectedSubjectData(subject)}>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {getStatusIcon(subjectStatus)}
                            {subject.subject}
                          </CardTitle>
                          <CardDescription>{subject.grade}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusBadgeColor(subjectStatus)}>
                            {subject.completedUnits}/{subject.totalUnits}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteSubject(subject._id)
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs text-muted-foreground">Progress</span>
                          <span className={`text-sm font-semibold ${getProgressColor(subject.overallProgress)}`}>
                            {subject.overallProgress}%
                          </span>
                        </div>
                        <Progress value={subject.overallProgress} className="h-2" />
                      </div>
                      
                      {/* Subject Status Quick Update */}
                      <div className="flex gap-2 pt-2 border-t border-border/50">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUpdateSubjectStatus(subject, "in-progress")
                          }}
                          disabled={subjectStatus === "in-progress"}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          In Progress
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUpdateSubjectStatus(subject, "completed")
                          }}
                          disabled={subjectStatus === "completed"}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Complete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Units & Lessons Tab */}
        <TabsContent value="units" className="space-y-6">
          {selectedSubjectData ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setSelectedSubjectData(null)}>
                  ← Back to Overview
                </Button>
                <Button
                  onClick={() => setIsAddChapterOpen(true)}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Chapter
                </Button>
              </div>

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardHeader>
                  <CardTitle>{selectedSubjectData.subject}</CardTitle>
                  <CardDescription>{selectedSubjectData.grade}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold">Overall Progress</span>
                      <span className={`text-sm font-bold ${getProgressColor(selectedSubjectData.overallProgress)}`}>
                        {selectedSubjectData.overallProgress}%
                      </span>
                    </div>
                    <Progress value={selectedSubjectData.overallProgress} className="h-3" />
                    <div className="mt-2 text-xs text-muted-foreground">
                      {selectedSubjectData.completedUnits} of {selectedSubjectData.totalUnits} chapters completed
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chapters List */}
              <div className="space-y-4">
                {subjectChapters.map((chapter) => {
                  const chapterLessons = lessons.filter((l) => l.chapterId === chapter._id)
                  const completedLessons = chapterLessons.filter((l) => l.status === "completed").length
                  const totalLessons = chapterLessons.length || chapter.topics || 0
                  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
                  
                  // Auto-determine chapter status based on lesson completion
                  const actualChapterStatus = totalLessons > 0 && completedLessons === totalLessons 
                    ? "completed" 
                    : completedLessons > 0 
                    ? "in-progress" 
                    : "todo"
                  
                  // Use actual status if chapter status hasn't been explicitly set or if it differs
                  const displayStatus = chapter.status || actualChapterStatus
                  const isChapterComplete = completedLessons === totalLessons && totalLessons > 0

                  return (
                    <Card key={chapter._id} className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base flex items-center gap-2">
                              {getStatusIcon(displayStatus)}
                              {chapter.name}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {completedLessons}/{totalLessons} lessons completed
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getStatusBadgeColor(displayStatus)}>
                              {displayStatus === "completed" && "Completed"}
                              {displayStatus === "in-progress" && "In Progress"}
                              {displayStatus === "todo" && "Planned"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedChapter(chapter)
                                setIsAddLessonOpen(true)
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteChapter(chapter._id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Due: {chapter.dueDate || "Not set"}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            Duration: {chapter.duration || "Not set"}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-xs text-muted-foreground">Chapter Progress</span>
                            <span className="text-xs font-semibold">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        {/* Chapter Status Quick Update */}
                        <div className="flex gap-2 pt-2 border-t border-border/50">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUpdateChapterStatus(chapter, "in-progress")
                            }}
                            disabled={displayStatus === "in-progress" || isChapterComplete}
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            Mark In Progress
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUpdateChapterStatus(chapter, "completed")
                            }}
                            disabled={displayStatus === "completed"}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {isChapterComplete ? "All Lessons Complete" : "Mark Complete"}
                          </Button>
                        </div>

                        {/* Lessons */}
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-muted-foreground">Lessons:</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedChapter(chapter)
                                setIsAddLessonOpen(true)
                              }}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Lesson
                            </Button>
                          </div>
                          {chapterLessons.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No lessons added yet.</p>
                          ) : (
                            chapterLessons.map((lesson) => (
                              <div
                                key={lesson._id}
                                className="flex items-center gap-3 p-2 rounded bg-card/50 border border-border/50 hover:bg-card/70 transition-colors"
                              >
                                <Checkbox
                                  checked={lesson.status === "completed"}
                                  onCheckedChange={() => handleToggleLesson(lesson)}
                                />
                                <span
                                  className={`text-sm flex-1 ${
                                    lesson.status === "completed" ? "line-through text-muted-foreground" : ""
                                  }`}
                                >
                                  {lesson.name}
                                </span>
                                {lesson.status === "completed" && (
                                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                                )}
                                {lesson.status === "in-progress" && <Clock className="w-4 h-4 text-blue-400" />}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteLesson(lesson._id)}
                                >
                                  <Trash2 className="w-3 h-3 text-destructive" />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                {subjectChapters.length === 0 && (
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">
                        No chapters added yet. Click "Add Chapter" to get started.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Select a subject from the overview to view units and lessons
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress Distribution */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle>Unit Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={curriculumProgressDist}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {curriculumProgressDist.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Completion Summary */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle>Completion Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjects.map((subject) => (
                  <div key={subject._id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{subject.subject}</span>
                      <span className={`text-sm font-bold ${getProgressColor(subject.overallProgress)}`}>
                        {subject.overallProgress}%
                      </span>
                    </div>
                    <Progress value={subject.overallProgress} className="h-2" />
                  </div>
                ))}
                {subjects.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center">No subjects to display</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Subject Dialog */}
      <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Subject Name *</label>
              <Input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Mathematics"
                required
                className="bg-input border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Grade *</label>
              <Input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="e.g., Grade 10"
                required
                className="bg-input border-border"
              />
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddSubjectOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Add Subject
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Chapter Dialog */}
      <Dialog open={isAddChapterOpen} onOpenChange={setIsAddChapterOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Add New Chapter</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddChapter} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Chapter Name *</label>
              <Input
                type="text"
                value={formData.chapterName}
                onChange={(e) => setFormData({ ...formData, chapterName: e.target.value })}
                placeholder="e.g., Algebra Fundamentals"
                required
                className="bg-input border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Duration</label>
                <Input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 3 weeks"
                  className="bg-input border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="bg-input border-border"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddChapterOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Add Chapter
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Lesson Dialog */}
      <Dialog open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Add New Lesson</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddLesson} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Lesson Name *</label>
              <Input
                type="text"
                value={formData.lessonName}
                onChange={(e) => setFormData({ ...formData, lessonName: e.target.value })}
                placeholder="e.g., Linear Equations"
                required
                className="bg-input border-border"
              />
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddLessonOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Add Lesson
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
