"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
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
import { Star, Award, Search, Filter } from "lucide-react"

const teachersData = [
  {
    id: 1,
    name: "Sarah Johnson",
    subject: "Mathematics",
    department: "STEM",
    rating: 4.8,
    reviews: 45,
    studentsEnrolled: 128,
    averageGrade: 8.5,
    attendanceRate: 98,
    engagementScore: 92,
    performanceTrend: [
      { month: "Jan", score: 78 },
      { month: "Feb", score: 82 },
      { month: "Mar", score: 85 },
      { month: "Apr", score: 88 },
      { month: "May", score: 90 },
      { month: "Jun", score: 92 },
    ],
  },
  {
    id: 2,
    name: "Michael Chen",
    subject: "Physics",
    department: "STEM",
    rating: 4.6,
    reviews: 38,
    studentsEnrolled: 95,
    averageGrade: 8.2,
    attendanceRate: 96,
    engagementScore: 88,
    performanceTrend: [
      { month: "Jan", score: 75 },
      { month: "Feb", score: 78 },
      { month: "Mar", score: 81 },
      { month: "Apr", score: 84 },
      { month: "May", score: 86 },
      { month: "Jun", score: 88 },
    ],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    subject: "English",
    department: "Humanities",
    rating: 4.7,
    reviews: 52,
    studentsEnrolled: 142,
    averageGrade: 8.7,
    attendanceRate: 99,
    engagementScore: 95,
    performanceTrend: [
      { month: "Jan", score: 82 },
      { month: "Feb", score: 84 },
      { month: "Mar", score: 86 },
      { month: "Apr", score: 89 },
      { month: "May", score: 92 },
      { month: "Jun", score: 95 },
    ],
  },
  {
    id: 4,
    name: "David Thompson",
    subject: "History",
    department: "Humanities",
    rating: 4.4,
    reviews: 35,
    studentsEnrolled: 110,
    averageGrade: 7.9,
    attendanceRate: 94,
    engagementScore: 82,
    performanceTrend: [
      { month: "Jan", score: 70 },
      { month: "Feb", score: 72 },
      { month: "Mar", score: 75 },
      { month: "Apr", score: 78 },
      { month: "May", score: 80 },
      { month: "Jun", score: 82 },
    ],
  },
  {
    id: 5,
    name: "Jessica Lee",
    subject: "Biology",
    department: "STEM",
    rating: 4.5,
    reviews: 41,
    studentsEnrolled: 105,
    averageGrade: 8.3,
    attendanceRate: 97,
    engagementScore: 85,
    performanceTrend: [
      { month: "Jan", score: 76 },
      { month: "Feb", score: 79 },
      { month: "Mar", score: 82 },
      { month: "Apr", score: 84 },
      { month: "May", score: 87 },
      { month: "Jun", score: 85 },
    ],
  },
]

const performanceCategories = [
  { name: "Excellent", value: 2, color: "#10b981" },
  { name: "Very Good", value: 2, color: "#6366f1" },
  { name: "Good", value: 1, color: "#f59e0b" },
]

export function TeacherPerformance() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedTeacher, setSelectedTeacher] = useState<(typeof teachersData)[0] | null>(null)

  const filteredTeachers = teachersData.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || teacher.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const getRatingColor = (rating: number) => {
    if (rating >= 4.7) return "bg-green-500/20 text-green-400"
    if (rating >= 4.5) return "bg-blue-500/20 text-blue-400"
    if (rating >= 4.3) return "bg-amber-500/20 text-amber-400"
    return "bg-orange-500/20 text-orange-400"
  }

  const getPerformanceLevel = (engagementScore: number) => {
    if (engagementScore >= 90) return "Excellent"
    if (engagementScore >= 85) return "Very Good"
    if (engagementScore >= 80) return "Good"
    return "Fair"
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Teacher Details</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="STEM">STEM</SelectItem>
                <SelectItem value="Humanities">Humanities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Teachers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((teacher) => (
              <Card
                key={teacher.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setSelectedTeacher(teacher)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{teacher.name}</CardTitle>
                      <CardDescription>{teacher.subject}</CardDescription>
                    </div>
                    <Badge variant="secondary" className={getRatingColor(teacher.rating)}>
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {teacher.rating.toFixed(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Students</p>
                      <p className="text-sm font-semibold">{teacher.studentsEnrolled}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Grade</p>
                      <p className="text-sm font-semibold">{teacher.averageGrade}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                      <p className="text-sm font-semibold">{teacher.attendanceRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                      <p className="text-sm font-semibold">{teacher.engagementScore}%</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-full justify-center">
                    {getPerformanceLevel(teacher.engagementScore)}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          {selectedTeacher ? (
            <div className="space-y-6">
              <div>
                <Button variant="outline" onClick={() => setSelectedTeacher(null)}>
                  ← Back to Overview
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-semibold">{selectedTeacher.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Subject</p>
                      <p className="font-semibold">{selectedTeacher.subject}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-semibold">{selectedTeacher.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(selectedTeacher.rating) ? "fill-amber-400 text-amber-400" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm">
                          {selectedTeacher.rating} ({selectedTeacher.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Students Enrolled</span>
                        <span className="font-semibold">{selectedTeacher.studentsEnrolled}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${(selectedTeacher.studentsEnrolled / 150) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Average Grade</span>
                        <span className="font-semibold">{selectedTeacher.averageGrade}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${(selectedTeacher.averageGrade / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Attendance Rate</span>
                        <span className="font-semibold">{selectedTeacher.attendanceRate}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${selectedTeacher.attendanceRate}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Level */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Engagement Score</span>
                        <span className="font-semibold">{selectedTeacher.engagementScore}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${selectedTeacher.engagementScore}%` }}
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Badge
                        className={`w-full justify-center text-base py-2 ${getRatingColor(selectedTeacher.rating)}`}
                      >
                        <Award className="w-4 h-4 mr-2" />
                        {getPerformanceLevel(selectedTeacher.engagementScore)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trend</CardTitle>
                  <CardDescription>6-month performance progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={selectedTeacher.performanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0 0)" />
                      <XAxis dataKey="month" stroke="oklch(0.65 0 0)" />
                      <YAxis stroke="oklch(0.65 0 0)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.15 0 0)",
                          border: "1px solid oklch(0.22 0 0)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#6366f1"
                        dot={{ fill: "#6366f1", r: 4 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Select a teacher from the overview to view details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Rating</span>
                  <span className="text-2xl font-bold">
                    {(teachersData.reduce((sum, t) => sum + t.rating, 0) / teachersData.length).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Teachers</span>
                  <span className="text-2xl font-bold">{teachersData.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Students</span>
                  <span className="text-2xl font-bold">
                    {teachersData.reduce((sum, t) => sum + t.studentsEnrolled, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Attendance</span>
                  <span className="text-2xl font-bold">
                    {Math.round(teachersData.reduce((sum, t) => sum + t.attendanceRate, 0) / teachersData.length)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={performanceCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {performanceCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Teacher Comparison</CardTitle>
              <CardDescription>Performance metrics across all teachers</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={teachersData} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0 0)" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="oklch(0.65 0 0)" />
                  <YAxis stroke="oklch(0.65 0 0)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.15 0 0)",
                      border: "1px solid oklch(0.22 0 0)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="rating" name="Rating (out of 5)" fill="#6366f1" />
                  <Bar dataKey="engagementScore" name="Engagement Score (%)" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
