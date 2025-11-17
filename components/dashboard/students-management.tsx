"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import { Plus, Trash2, Search, GraduationCap, TrendingUp, Users, BookOpen, Award } from "lucide-react"

interface Student {
  _id: string
  name: string
  email: string
  grade: string
  department: string
  gpa: number
  attendance: number
  status: string
  courses: number
}

export function StudentsManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    grade: "",
    department: "",
    gpa: 0,
    attendance: 0,
    status: "Active",
    courses: 0,
  })

  useEffect(() => {
    fetchStudents()
  }, [])

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

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchStudents()
        setIsAddModalOpen(false)
        setFormData({
          name: "",
          email: "",
          grade: "",
          department: "",
          gpa: 0,
          attendance: 0,
          status: "Active",
          courses: 0,
        })
        // Trigger dashboard refresh
        window.dispatchEvent(new Event("studentsUpdated"))
      }
    } catch (error) {
      console.error("Error adding student:", error)
    }
  }

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) {
      return
    }

    try {
      const response = await fetch(`/api/students?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchStudents()
        // Trigger dashboard refresh
        window.dispatchEvent(new Event("studentsUpdated"))
      }
    } catch (error) {
      console.error("Error deleting student:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
      case "good":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "average":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "inactive":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const getGPAColor = (gpa: number) => {
    if (gpa >= 9) return "text-emerald-400"
    if (gpa >= 8.5) return "text-blue-400"
    if (gpa >= 8) return "text-amber-400"
    return "text-orange-400"
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading students...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Students Management</h2>
          <p className="text-muted-foreground">Add, view, and manage student information</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search students by name, grade, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-input border-border focus:border-primary"
        />
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {searchTerm ? "No students found matching your search." : "No students added yet. Click 'Add Student' to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const initials = student.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)

            return (
              <Card
                key={student._id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary/50 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedStudent(student)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center font-semibold text-white text-sm">
                        {initials}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-foreground mb-1">{student.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{student.grade}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(student.status)}>
                      {student.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">GPA</p>
                      <p className={`text-2xl font-bold ${getGPAColor(student.gpa)}`}>{student.gpa}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Attendance</p>
                      <p className="text-2xl font-bold text-foreground">{student.attendance}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Courses</p>
                      <p className="text-2xl font-bold text-foreground">{student.courses}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Department</p>
                      <p className="text-sm font-semibold text-foreground">{student.department || "N/A"}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedStudent(student)
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteStudent(student._id)
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add Student Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="Aisha Kumar"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="aisha@institution.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Grade *</label>
                <Input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="Grade 10-A"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Department *</label>
                <Input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="Science"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">GPA *</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: Number(e.target.value) })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="9.2"
                  required
                  min="0"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Attendance (%) *</label>
                <Input
                  type="number"
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="98"
                  required
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:border-primary text-foreground"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Courses</label>
                <Input
                  type="number"
                  value={formData.courses}
                  onChange={(e) => setFormData({ ...formData, courses: Number(e.target.value) })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="5"
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Add Student
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Student Details Modal with Overview and Analytics */}
      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="bg-card border-border max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center font-semibold text-white">
                    {selectedStudent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-foreground">{selectedStudent.name}</DialogTitle>
                    <p className="text-muted-foreground mt-1">{selectedStudent.grade} • {selectedStudent.department}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(selectedStudent.status)}>
                  {selectedStudent.status}
                </Badge>
              </div>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">GPA</p>
                          <p className={`text-2xl font-bold ${getGPAColor(selectedStudent.gpa)}`}>
                            {selectedStudent.gpa}
                          </p>
                        </div>
                        <GraduationCap className="w-8 h-8 text-blue-400/30" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Attendance</p>
                          <p className="text-2xl font-bold text-emerald-400">{selectedStudent.attendance}%</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-emerald-400/30" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Courses</p>
                          <p className="text-2xl font-bold text-purple-400">{selectedStudent.courses}</p>
                        </div>
                        <BookOpen className="w-8 h-8 text-purple-400/30" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className="text-lg font-bold text-cyan-400">{selectedStudent.status}</p>
                        </div>
                        <Award className="w-8 h-8 text-cyan-400/30" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{selectedStudent.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{selectedStudent.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Grade:</span>
                        <span className="font-medium">{selectedStudent.grade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Department:</span>
                        <span className="font-medium">{selectedStudent.department || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={getStatusColor(selectedStudent.status)}>
                          {selectedStudent.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg">Academic Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">GPA Score</span>
                          <span className={`text-sm font-medium ${getGPAColor(selectedStudent.gpa)}`}>
                            {selectedStudent.gpa}/10
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${
                              selectedStudent.gpa >= 9
                                ? "from-emerald-500 to-emerald-400"
                                : selectedStudent.gpa >= 8.5
                                ? "from-blue-500 to-blue-400"
                                : "from-amber-500 to-amber-400"
                            }`}
                            style={{ width: `${(selectedStudent.gpa / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Attendance Rate</span>
                          <span className="text-sm font-medium">{selectedStudent.attendance}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                            style={{ width: `${selectedStudent.attendance}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Courses Enrolled</span>
                          <span className="text-sm font-medium">{selectedStudent.courses}</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                            style={{ width: `${Math.min((selectedStudent.courses / 10) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6 mt-6">
                {/* Grade Distribution Pie Chart */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "GPA Score", value: selectedStudent.gpa * 10 },
                            { name: "Attendance", value: selectedStudent.attendance },
                            {
                              name: "Remaining",
                              value: 100 - selectedStudent.gpa * 10 - selectedStudent.attendance,
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#8b5cf6" />
                          <Cell fill="#10b981" />
                          <Cell fill="#6b7280" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Academic Metrics Bar Chart */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Academic Metrics Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={[
                          {
                            name: "GPA",
                            value: selectedStudent.gpa * 10,
                            fullMark: 100,
                          },
                          {
                            name: "Attendance",
                            value: selectedStudent.attendance,
                            fullMark: 100,
                          },
                          {
                            name: "Courses",
                            value: selectedStudent.courses * 10,
                            fullMark: 100,
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            border: "1px solid rgba(255,255,255,0.2)",
                          }}
                        />
                        <Bar dataKey="value" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Academic Trend Line Chart */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Academic Trend (Last 6 Months)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={[
                          { month: "Jan", gpa: selectedStudent.gpa - 0.5, attendance: selectedStudent.attendance - 8 },
                          { month: "Feb", gpa: selectedStudent.gpa - 0.3, attendance: selectedStudent.attendance - 5 },
                          { month: "Mar", gpa: selectedStudent.gpa - 0.2, attendance: selectedStudent.attendance - 3 },
                          { month: "Apr", gpa: selectedStudent.gpa - 0.1, attendance: selectedStudent.attendance - 2 },
                          { month: "May", gpa: selectedStudent.gpa, attendance: selectedStudent.attendance - 1 },
                          { month: "Jun", gpa: selectedStudent.gpa, attendance: selectedStudent.attendance },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            border: "1px solid rgba(255,255,255,0.2)",
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="gpa" stroke="#8b5cf6" strokeWidth={2} name="GPA" />
                        <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} name="Attendance %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Overall Performance Radar Chart */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Overall Performance Radar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart
                        data={[
                          {
                            subject: "GPA",
                            A: selectedStudent.gpa * 10,
                            fullMark: 100,
                          },
                          {
                            subject: "Attendance",
                            A: selectedStudent.attendance,
                            fullMark: 100,
                          },
                          {
                            subject: "Courses",
                            A: Math.min(selectedStudent.courses * 10, 100),
                            fullMark: 100,
                          },
                          {
                            subject: "Performance",
                            A: (selectedStudent.gpa / 10) * 100,
                            fullMark: 100,
                          },
                        ]}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.5)" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="rgba(255,255,255,0.5)" />
                        <Radar
                          name="Student"
                          dataKey="A"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.6}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            border: "1px solid rgba(255,255,255,0.2)",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

