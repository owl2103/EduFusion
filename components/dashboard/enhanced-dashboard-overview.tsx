"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, BookOpen, BarChart3 } from "lucide-react"

interface Teacher {
  _id: string
  name: string
  subject: string
  students: number
  attendance: number
  avgGrade: number
  engagement: number
  rating: number
  status: string
}

interface Student {
  _id: string
  name: string
  grade: string
  department: string
  gpa: number
  attendance: number
  status: string
  courses: number
}

interface Subject {
  _id: string
  subject: string
  grade: string
  totalUnits: number
  completedUnits: number
  overallProgress: number
}

interface Chapter {
  _id: string
  subjectId: string
  name: string
  status: string
  topics: number
  completedTopics: number
}

export function EnhancedDashboardOverview() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    // Refresh every 30 seconds to get updated data
    const interval = setInterval(fetchData, 30000)
    
    // Listen for custom events when teachers/students/curriculum are updated
    const handleTeachersUpdate = () => {
      fetchTeachers()
    }
    const handleStudentsUpdate = () => {
      fetchStudents()
    }
    const handleCurriculumUpdate = () => {
      fetchCurriculum()
    }
    window.addEventListener("teachersUpdated", handleTeachersUpdate)
    window.addEventListener("studentsUpdated", handleStudentsUpdate)
    window.addEventListener("curriculumUpdated", handleCurriculumUpdate)
    window.addEventListener("curriculumProgressUpdated", handleCurriculumUpdate)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener("teachersUpdated", handleTeachersUpdate)
      window.removeEventListener("studentsUpdated", handleStudentsUpdate)
      window.removeEventListener("curriculumUpdated", handleCurriculumUpdate)
      window.removeEventListener("curriculumProgressUpdated", handleCurriculumUpdate)
    }
  }, [])

  const fetchData = async () => {
    await Promise.all([fetchTeachers(), fetchStudents(), fetchCurriculum()])
  }

  const fetchCurriculum = async () => {
    try {
      const [subjectsRes, chaptersRes] = await Promise.all([
        fetch("/api/curriculum/subjects"),
        fetch("/api/curriculum/chapters"),
      ])

      if (subjectsRes.ok) {
        const subjectsData = await subjectsRes.json()
        setSubjects(subjectsData)
      }

      if (chaptersRes.ok) {
        const chaptersData = await chaptersRes.json()
        setChapters(chaptersData)
      }
    } catch (error) {
      console.error("Error fetching curriculum:", error)
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await fetch("/api/teachers")
      if (response.ok) {
        const data = await response.json()
        setTeachers(data)
      }
    } catch (error) {
      console.error("Error fetching teachers:", error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics from real teacher data
  const totalTeachers = teachers.length
  const teacherStudents = teachers.reduce((sum, teacher) => sum + (teacher.students || 0), 0)
  const avgAttendance = teachers.length > 0
    ? Math.round(teachers.reduce((sum, teacher) => sum + (teacher.attendance || 0), 0) / teachers.length * 10) / 10
    : 0
  const avgPerformance = teachers.length > 0
    ? Math.round(teachers.reduce((sum, teacher) => sum + (teacher.avgGrade || 0), 0) / teachers.length * 10) / 10
    : 0
  const avgRating = teachers.length > 0
    ? Math.round(teachers.reduce((sum, teacher) => sum + (teacher.rating || 0), 0) / teachers.length * 10) / 10
    : 0

  // Calculate statistics from real student data
  const totalStudents = students.length > 0 ? students.length : teacherStudents
  const avgStudentAttendance = students.length > 0
    ? Math.round(students.reduce((sum, student) => sum + (student.attendance || 0), 0) / students.length * 10) / 10
    : avgAttendance
  const avgStudentGPA = students.length > 0
    ? Math.round(students.reduce((sum, student) => sum + (student.gpa || 0), 0) / students.length * 10) / 10
    : 0
  const scoreAttendanceData = [
    { attendance: 92, score: 72, student: "Batch A", month: "Jan" },
    { attendance: 93, score: 74, student: "Batch B", month: "Feb" },
    { attendance: 94, score: 76, student: "Batch A", month: "Mar" },
    { attendance: 93, score: 75, student: "Batch C", month: "Apr" },
    { attendance: 95, score: 78, student: "Batch B", month: "May" },
    { attendance: 94.2, score: 78.5, student: "Batch A", month: "Jun" },
  ]

  const departmentPerformanceData = [
    { name: "Science", value: 82, students: 234, teachers: 12 },
    { name: "Math", value: 76, students: 201, teachers: 10 },
    { name: "English", value: 79, students: 218, teachers: 9 },
    { name: "History", value: 81, students: 189, teachers: 8 },
    { name: "Languages", value: 75, students: 176, teachers: 7 },
  ]

  // Calculate curriculum statistics from real data
  const totalSubjects = subjects.length
  const totalUnits = subjects.reduce((sum, s) => sum + s.totalUnits, 0)
  const completedUnits = subjects.reduce((sum, s) => sum + s.completedUnits, 0)
  const overallCurriculumProgress = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0
  
  const completedChapters = chapters.filter((c) => c.status === "completed").length
  const inProgressChapters = chapters.filter((c) => c.status === "in-progress").length
  const plannedChapters = chapters.filter((c) => c.status === "todo").length

  // Generate curriculum completion data for last 4 months (simulated based on current progress)
  const getCurriculumCompletionData = () => {
    const currentMonth = new Date().getMonth()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const months = []
    
    for (let i = 3; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      const progressFactor = (4 - i) / 4 // Gradually increase progress
      months.push({
        month: monthNames[monthIndex],
        completed: Math.round(completedChapters * progressFactor),
        inProgress: Math.round(inProgressChapters * progressFactor),
        planned: Math.round(plannedChapters * (1 - progressFactor)),
      })
    }
    return months
  }

  const curriculumCompletionData = getCurriculumCompletionData()

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-blue-400">
                  {loading ? "..." : totalStudents.toLocaleString()}
                </p>
                <p className="text-xs text-green-400 mt-1">
                  {loading ? "Loading..." : students.length > 0 ? "From database" : "From teachers"}
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Performance</p>
                <p className="text-3xl font-bold text-purple-400">
                  {loading ? "..." : `${avgPerformance}`}
                </p>
                <p className="text-xs text-green-400 mt-1">
                  {loading ? "Loading..." : `Avg Grade: ${avgRating}/5.0`}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Teachers Active</p>
                <p className="text-3xl font-bold text-cyan-400">
                  {loading ? "..." : totalTeachers}
                </p>
                <p className="text-xs text-green-400 mt-1">
                  {loading ? "Loading..." : "All departments"}
                </p>
              </div>
              <BookOpen className="w-12 h-12 text-cyan-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Attendance</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {loading ? "..." : `${students.length > 0 ? avgStudentAttendance : avgAttendance}%`}
                </p>
                <p className="text-xs text-green-400 mt-1">
                  {loading ? "Loading..." : students.length > 0 ? "From students" : "From teachers"}
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-emerald-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Curriculum Progress</p>
                <p className="text-3xl font-bold text-pink-400">
                  {loading ? "..." : `${overallCurriculumProgress}%`}
                </p>
                <p className="text-xs text-green-400 mt-1">
                  {loading ? "Loading..." : `${completedUnits}/${totalUnits} units`}
                </p>
              </div>
              <BookOpen className="w-12 h-12 text-pink-400/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score vs Attendance - Simple Bar Visualization */}
      <Card className="border border-white/10 backdrop-blur-xl bg-white/5 hover:border-white/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Score vs Attendance Trend - Analysis
          </CardTitle>
          <CardDescription>Real-time correlation between attendance and academic performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scoreAttendanceData.map((item) => (
              <div key={item.month} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {item.month} - {item.student}
                  </span>
                  <span className="text-foreground font-medium">
                    Attendance: {item.attendance}% | Score: {item.score}%
                  </span>
                </div>
                <div className="flex gap-2 h-6 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all"
                    style={{ width: `${item.attendance}%` }}
                    title="Attendance"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Performance & Curriculum - Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-white/10 backdrop-blur-xl bg-white/5 hover:border-white/20 transition-all duration-300">
          <CardHeader>
            <CardTitle>Department Performance Excellence</CardTitle>
            <CardDescription>Average performance scores by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentPerformanceData.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground font-medium">{dept.name}</span>
                    <span className="text-muted-foreground">
                      {dept.value}% • {dept.students} students • {dept.teachers} teachers
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                      style={{ width: `${dept.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Curriculum Completion - Real Data */}
        <Card className="border border-white/10 backdrop-blur-xl bg-white/5 hover:border-white/20 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              Curriculum Completion Progression
            </CardTitle>
            <CardDescription>
              {totalSubjects} Subjects • {totalUnits} Units • {overallCurriculumProgress}% Complete
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Overall Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-foreground font-medium">Overall Progress</span>
                  <span className="text-xs font-semibold text-purple-400">{overallCurriculumProgress}%</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
                    style={{ width: `${overallCurriculumProgress}%` }}
                  />
                </div>
              </div>

              {/* Current Status Summary */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
                <div className="text-center p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-lg font-bold text-emerald-400">{completedChapters}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="text-center p-2 rounded bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-lg font-bold text-indigo-400">{inProgressChapters}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
                <div className="text-center p-2 rounded bg-amber-500/10 border border-amber-500/20">
                  <p className="text-lg font-bold text-amber-400">{plannedChapters}</p>
                  <p className="text-xs text-muted-foreground">Planned</p>
                </div>
              </div>

              {/* Monthly Progress */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold text-muted-foreground">Progress Over Time</p>
                {curriculumCompletionData.map((item) => {
                  const total = item.completed + item.inProgress + item.planned || 1
                  return (
                    <div key={item.month} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-foreground font-medium">{item.month}</span>
                        <span className="text-xs text-muted-foreground">
                          C: {item.completed} | P: {item.inProgress} | PL: {item.planned}
                        </span>
                      </div>
                      <div className="flex gap-1 h-4 rounded overflow-hidden">
                        <div
                          className="bg-emerald-500"
                          style={{ width: `${(item.completed / total) * 100}%` }}
                          title={`Completed: ${item.completed}`}
                        />
                        <div
                          className="bg-indigo-500"
                          style={{ width: `${(item.inProgress / total) * 100}%` }}
                          title={`In Progress: ${item.inProgress}`}
                        />
                        <div
                          className="bg-amber-500"
                          style={{ width: `${(item.planned / total) * 100}%` }}
                          title={`Planned: ${item.planned}`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Subject Breakdown */}
              {subjects.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground">By Subject</p>
                  {subjects.slice(0, 3).map((subject) => (
                    <div key={subject._id} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-foreground">{subject.subject}</span>
                        <span className="text-muted-foreground">
                          {subject.completedUnits}/{subject.totalUnits} units
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                          style={{ width: `${subject.overallProgress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
