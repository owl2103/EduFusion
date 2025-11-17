"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, GraduationCap, TrendingUp } from "lucide-react"

const studentsData = [
  {
    id: 1,
    name: "Aisha Kumar",
    grade: "Grade 10-A",
    department: "Science",
    gpa: 9.2,
    attendance: 98,
    status: "excellent",
    courses: 5,
    avatar: "AK",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    grade: "Grade 10-B",
    department: "Commerce",
    gpa: 8.5,
    attendance: 94,
    status: "good",
    courses: 4,
    avatar: "RS",
  },
  {
    id: 3,
    name: "Priya Desai",
    grade: "Grade 10-A",
    department: "Science",
    gpa: 9.7,
    attendance: 99,
    status: "excellent",
    courses: 5,
    avatar: "PD",
  },
  {
    id: 4,
    name: "Arjun Patel",
    grade: "Grade 11-A",
    department: "Science",
    gpa: 8.9,
    attendance: 96,
    status: "excellent",
    courses: 6,
    avatar: "AP",
  },
  {
    id: 5,
    name: "Neha Singh",
    grade: "Grade 9-B",
    department: "Humanities",
    gpa: 7.8,
    attendance: 92,
    status: "good",
    courses: 4,
    avatar: "NS",
  },
  {
    id: 6,
    name: "Vihaan Reddy",
    grade: "Grade 10-C",
    department: "Science",
    gpa: 7.4,
    attendance: 88,
    status: "average",
    courses: 5,
    avatar: "VR",
  },
  {
    id: 7,
    name: "Ananya Joshi",
    grade: "Grade 11-B",
    department: "Commerce",
    gpa: 9.1,
    attendance: 97,
    status: "excellent",
    courses: 5,
    avatar: "AJ",
  },
  {
    id: 8,
    name: "Karan Singh",
    grade: "Grade 9-A",
    department: "Science",
    gpa: 8.6,
    attendance: 95,
    status: "good",
    courses: 5,
    avatar: "KS",
  },
  {
    id: 9,
    name: "Divya Nair",
    grade: "Grade 12-A",
    department: "Science",
    gpa: 9.4,
    attendance: 99,
    status: "excellent",
    courses: 6,
    avatar: "DN",
  },
  {
    id: 10,
    name: "Rohan Verma",
    grade: "Grade 10-A",
    department: "Humanities",
    gpa: 8.2,
    attendance: 93,
    status: "good",
    courses: 4,
    avatar: "RV",
  },
  {
    id: 11,
    name: "Mira Kapoor",
    grade: "Grade 11-C",
    department: "Commerce",
    gpa: 7.9,
    attendance: 90,
    status: "good",
    courses: 5,
    avatar: "MK",
  },
  {
    id: 12,
    name: "Abhishek Roy",
    grade: "Grade 9-C",
    department: "Science",
    gpa: 8.8,
    attendance: 96,
    status: "excellent",
    courses: 5,
    avatar: "AR",
  },
]

export function StudentsDirectory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrade = selectedGrade === "all" || student.grade === selectedGrade
    const matchesStatus = selectedStatus === "all" || student.status === selectedStatus
    return matchesSearch && matchesGrade && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-emerald-500/20 text-emerald-400"
      case "good":
        return "bg-blue-500/20 text-blue-400"
      case "average":
        return "bg-amber-500/20 text-amber-400"
      default:
        return "bg-red-500/20 text-red-400"
    }
  }

  const getGPAColor = (gpa: number) => {
    if (gpa >= 9) return "text-emerald-400"
    if (gpa >= 8.5) return "text-blue-400"
    if (gpa >= 8) return "text-amber-400"
    return "text-orange-400"
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-blue-400">{studentsData.length}</p>
              </div>
              <Users className="w-10 h-10 text-blue-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Excellent Status</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {studentsData.filter((s) => s.status === "excellent").length}
                </p>
              </div>
              <GraduationCap className="w-10 h-10 text-emerald-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg GPA</p>
                <p className="text-2xl font-bold text-purple-400">
                  {(studentsData.reduce((sum, s) => sum + s.gpa, 0) / studentsData.length).toFixed(2)}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Attendance</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {Math.round(studentsData.reduce((sum, s) => sum + s.attendance, 0) / studentsData.length)}%
                </p>
              </div>
              <Users className="w-10 h-10 text-cyan-400/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger className="md:w-40">
              <SelectValue placeholder="Filter by grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="Grade 9-A">Grade 9-A</SelectItem>
              <SelectItem value="Grade 9-B">Grade 9-B</SelectItem>
              <SelectItem value="Grade 9-C">Grade 9-C</SelectItem>
              <SelectItem value="Grade 10-A">Grade 10-A</SelectItem>
              <SelectItem value="Grade 10-B">Grade 10-B</SelectItem>
              <SelectItem value="Grade 10-C">Grade 10-C</SelectItem>
              <SelectItem value="Grade 11-A">Grade 11-A</SelectItem>
              <SelectItem value="Grade 11-B">Grade 11-B</SelectItem>
              <SelectItem value="Grade 11-C">Grade 11-C</SelectItem>
              <SelectItem value="Grade 12-A">Grade 12-A</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="average">Average</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => (
          <Card
            key={student.id}
            className="border border-white/10 backdrop-blur-xl bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center font-semibold">
                    {student.avatar}
                  </div>
                  <div>
                    <CardTitle className="text-base group-hover:text-purple-400 transition-colors">
                      {student.name}
                    </CardTitle>
                    <CardDescription className="text-xs">{student.grade}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(student.status)}>
                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">GPA</p>
                  <p className={`text-sm font-bold ${getGPAColor(student.gpa)}`}>{student.gpa}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Attendance</p>
                  <p className="text-sm font-bold text-cyan-400">{student.attendance}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Courses</p>
                  <p className="text-sm font-bold text-blue-400">{student.courses}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full text-xs hover:bg-purple-500/20 hover:border-purple-400 bg-transparent"
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No students found matching your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
