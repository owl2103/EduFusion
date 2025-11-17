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
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Search, Filter, Award } from "lucide-react"

const classesData = [
  {
    id: 1,
    name: "Mathematics 10-A",
    grade: "Grade 10",
    teacher: "Sarah Johnson",
    totalStudents: 32,
    enrolledStudents: 30,
    averageGrade: 8.5,
    passRate: 96,
    averageAttendance: 94,
    lastUpdated: "Today",
    students: [
      { id: 1, name: "Alex Martin", grade: 9.2, attendance: 98, performance: 95 },
      { id: 2, name: "Emma Wilson", grade: 8.8, attendance: 96, performance: 90 },
      { id: 3, name: "James Brown", grade: 8.5, attendance: 92, performance: 85 },
      { id: 4, name: "Olivia Davis", grade: 9.0, attendance: 94, performance: 92 },
      { id: 5, name: "Lucas Taylor", grade: 7.8, attendance: 90, performance: 78 },
    ],
    performanceTrend: [
      { month: "Jan", grade: 7.8, attendance: 88 },
      { month: "Feb", grade: 8.0, attendance: 90 },
      { month: "Mar", grade: 8.2, attendance: 91 },
      { month: "Apr", grade: 8.3, attendance: 92 },
      { month: "May", grade: 8.4, attendance: 93 },
      { month: "Jun", grade: 8.5, attendance: 94 },
    ],
  },
  {
    id: 2,
    name: "Physics 11-B",
    grade: "Grade 11",
    teacher: "Michael Chen",
    totalStudents: 28,
    enrolledStudents: 27,
    averageGrade: 8.2,
    passRate: 93,
    averageAttendance: 91,
    lastUpdated: "Today",
    students: [
      { id: 1, name: "Sophie Garcia", grade: 9.1, attendance: 97, performance: 93 },
      { id: 2, name: "Noah Martinez", grade: 8.5, attendance: 94, performance: 88 },
      { id: 3, name: "Isabella Lee", grade: 7.9, attendance: 88, performance: 80 },
      { id: 4, name: "Mason Rodriguez", grade: 8.3, attendance: 92, performance: 86 },
      { id: 5, name: "Ava Johnson", grade: 8.6, attendance: 95, performance: 89 },
    ],
    performanceTrend: [
      { month: "Jan", grade: 7.6, attendance: 86 },
      { month: "Feb", grade: 7.8, attendance: 87 },
      { month: "Mar", grade: 8.0, attendance: 88 },
      { month: "Apr", grade: 8.1, attendance: 89 },
      { month: "May", grade: 8.2, attendance: 90 },
      { month: "Jun", grade: 8.2, attendance: 91 },
    ],
  },
  {
    id: 3,
    name: "English 9-C",
    grade: "Grade 9",
    teacher: "Emily Rodriguez",
    totalStudents: 35,
    enrolledStudents: 34,
    averageGrade: 8.7,
    passRate: 97,
    averageAttendance: 96,
    lastUpdated: "Today",
    students: [
      { id: 1, name: "Charlotte White", grade: 9.3, attendance: 99, performance: 96 },
      { id: 2, name: "Ethan Clark", grade: 8.9, attendance: 97, performance: 92 },
      { id: 3, name: "Mia Anderson", grade: 8.4, attendance: 94, performance: 87 },
      { id: 4, name: "Benjamin Harris", grade: 9.0, attendance: 96, performance: 93 },
      { id: 5, name: "Harper Thompson", grade: 8.6, attendance: 95, performance: 89 },
    ],
    performanceTrend: [
      { month: "Jan", grade: 8.2, attendance: 92 },
      { month: "Feb", grade: 8.3, attendance: 93 },
      { month: "Mar", grade: 8.4, attendance: 94 },
      { month: "Apr", grade: 8.5, attendance: 95 },
      { month: "May", grade: 8.6, attendance: 95 },
      { month: "Jun", grade: 8.7, attendance: 96 },
    ],
  },
  {
    id: 4,
    name: "History 10-D",
    grade: "Grade 10",
    teacher: "David Thompson",
    totalStudents: 29,
    enrolledStudents: 28,
    averageGrade: 7.9,
    passRate: 89,
    averageAttendance: 88,
    lastUpdated: "Yesterday",
    students: [
      { id: 1, name: "Jackson Moore", grade: 8.2, attendance: 91, performance: 85 },
      { id: 2, name: "Amelia Jackson", grade: 7.6, attendance: 85, performance: 78 },
      { id: 3, name: "Lucas White", grade: 8.0, attendance: 88, performance: 81 },
      { id: 4, name: "Ella Harris", grade: 7.8, attendance: 87, performance: 79 },
      { id: 5, name: "Henry Martin", grade: 8.1, attendance: 90, performance: 83 },
    ],
    performanceTrend: [
      { month: "Jan", grade: 7.4, attendance: 82 },
      { month: "Feb", grade: 7.5, attendance: 84 },
      { month: "Mar", grade: 7.6, attendance: 85 },
      { month: "Apr", grade: 7.8, attendance: 86 },
      { month: "May", grade: 7.9, attendance: 87 },
      { month: "Jun", grade: 7.9, attendance: 88 },
    ],
  },
]

const performanceDistribution = [
  { name: "Excellent (9+)", value: 8, color: "#10b981" },
  { name: "Very Good (8-9)", value: 35, color: "#6366f1" },
  { name: "Good (7-8)", value: 42, color: "#f59e0b" },
  { name: "Fair (6-7)", value: 12, color: "#ef4444" },
]

export function ClassesStudentsAnalytics() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedClass, setSelectedClass] = useState<(typeof classesData)[0] | null>(null)

  const filteredClasses = classesData.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrade = selectedGrade === "all" || cls.grade === selectedGrade
    return matchesSearch && matchesGrade
  })

  const getPerformanceColor = (grade: number) => {
    if (grade >= 9) return "bg-green-500/20 text-green-400"
    if (grade >= 8) return "bg-blue-500/20 text-blue-400"
    if (grade >= 7) return "bg-amber-500/20 text-amber-400"
    return "bg-red-500/20 text-red-400"
  }

  const getAttendanceStatus = (attendance: number) => {
    if (attendance >= 95) return "Excellent"
    if (attendance >= 90) return "Good"
    if (attendance >= 85) return "Fair"
    return "Poor"
  }

  const totalStudents = classesData.reduce((sum, cls) => sum + cls.enrolledStudents, 0)
  const averageClassGrade = (classesData.reduce((sum, cls) => sum + cls.averageGrade, 0) / classesData.length).toFixed(
    2,
  )
  const totalClasses = classesData.length

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="class-details">Class Details</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{totalClasses}</div>
                  <p className="text-sm text-muted-foreground mt-1">Total Classes</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{totalStudents}</div>
                  <p className="text-sm text-muted-foreground mt-1">Total Students</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{averageClassGrade}</div>
                  <p className="text-sm text-muted-foreground mt-1">Avg Class Grade</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400">94%</div>
                  <p className="text-sm text-muted-foreground mt-1">Avg Attendance</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search classes or teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="Grade 9">Grade 9</SelectItem>
                <SelectItem value="Grade 10">Grade 10</SelectItem>
                <SelectItem value="Grade 11">Grade 11</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClasses.map((cls) => (
              <Card
                key={cls.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setSelectedClass(cls)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{cls.name}</CardTitle>
                      <CardDescription>
                        {cls.grade} - {cls.teacher}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className={getPerformanceColor(cls.averageGrade)}>
                      {cls.averageGrade}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Students</p>
                      <p className="text-sm font-semibold">
                        {cls.enrolledStudents}/{cls.totalStudents}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pass Rate</p>
                      <p className="text-sm font-semibold">{cls.passRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                      <p className="text-sm font-semibold">{cls.averageAttendance}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge variant="outline" className="text-xs">
                        {cls.lastUpdated}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Class Details Tab */}
        <TabsContent value="class-details" className="space-y-6">
          {selectedClass ? (
            <div className="space-y-6">
              <div>
                <Button variant="outline" onClick={() => setSelectedClass(null)}>
                  ← Back to Overview
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Class Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Class Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Class Name</p>
                      <p className="font-semibold">{selectedClass.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Grade Level</p>
                      <p className="font-semibold">{selectedClass.grade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teacher</p>
                      <p className="font-semibold">{selectedClass.teacher}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Enrollment</p>
                      <p className="font-semibold">
                        {selectedClass.enrolledStudents}/{selectedClass.totalStudents}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Average Grade</span>
                        <span className="font-semibold">{selectedClass.averageGrade}/10</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${(selectedClass.averageGrade / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Pass Rate</span>
                        <span className="font-semibold">{selectedClass.passRate}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${selectedClass.passRate}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Attendance</span>
                        <span className="font-semibold">{selectedClass.averageAttendance}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${selectedClass.averageAttendance}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-semibold">{selectedClass.lastUpdated}</p>
                    </div>
                    <div className="pt-4 border-t">
                      <Badge className="w-full justify-center text-base py-2">
                        <Award className="w-4 h-4 mr-2" />
                        Active
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trend</CardTitle>
                  <CardDescription>6-month class performance progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={selectedClass.performanceTrend}>
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
                        dataKey="grade"
                        stroke="#6366f1"
                        name="Average Grade"
                        dot={{ fill: "#6366f1", r: 4 }}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="attendance"
                        stroke="#10b981"
                        name="Attendance %"
                        dot={{ fill: "#10b981", r: 4 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Student List */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Performance</CardTitle>
                  <CardDescription>Individual student grades and attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedClass.students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">Attendance: {student.attendance}%</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getPerformanceColor(student.grade)}>{student.grade}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Select a class from the overview to view details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={performanceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {performanceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Class Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Class Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={classesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0 0)" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="oklch(0.65 0 0)" />
                    <YAxis stroke="oklch(0.65 0 0)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.15 0 0)",
                        border: "1px solid oklch(0.22 0 0)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="averageGrade" name="Avg Grade" fill="#6366f1" />
                    <Bar dataKey="passRate" name="Pass Rate %" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Student Performance Scatter */}
          <Card>
            <CardHeader>
              <CardTitle>Student Performance Correlation</CardTitle>
              <CardDescription>Attendance vs Grade correlation across all students</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0 0)" />
                  <XAxis type="number" dataKey="attendance" name="Attendance %" stroke="oklch(0.65 0 0)" />
                  <YAxis type="number" dataKey="grade" name="Grade" stroke="oklch(0.65 0 0)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.15 0 0)",
                      border: "1px solid oklch(0.22 0 0)",
                      borderRadius: "8px",
                    }}
                    cursor={{ strokeDasharray: "3 3" }}
                  />
                  {classesData.map((cls, index) => (
                    <Scatter
                      key={`scatter-${index}`}
                      name={cls.name}
                      data={cls.students}
                      fill={["#6366f1", "#10b981", "#f59e0b", "#ef4444"][index % 4]}
                    />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
