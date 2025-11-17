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
import { Star, Plus, Trash2, Search, TrendingUp, Users, BookOpen, Award } from "lucide-react"

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
  email?: string
  department?: string
  experience?: number
}

export function TeachersManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    students: 0,
    attendance: 0,
    avgGrade: 0,
    engagement: 0,
    rating: 0,
    status: "Excellent",
    email: "",
    department: "",
    experience: 0,
  })

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await fetch("/api/teachers")
      if (response.ok) {
        const data = await response.json()
        setTeachers(data)
      }
    } catch (error) {
      console.error("Error fetching teachers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchTeachers()
        setIsAddModalOpen(false)
        setFormData({
          name: "",
          subject: "",
          students: 0,
          attendance: 0,
          avgGrade: 0,
          engagement: 0,
          rating: 0,
          status: "Excellent",
          email: "",
          department: "",
          experience: 0,
        })
        // Trigger dashboard refresh by dispatching a custom event
        window.dispatchEvent(new Event("teachersUpdated"))
      }
    } catch (error) {
      console.error("Error adding teacher:", error)
    }
  }

  const handleDeleteTeacher = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) {
      return
    }

    try {
      const response = await fetch(`/api/teachers?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchTeachers()
        // Trigger dashboard refresh by dispatching a custom event
        window.dispatchEvent(new Event("teachersUpdated"))
      }
    } catch (error) {
      console.error("Error deleting teacher:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "good":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "average":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading teachers...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Teachers Management</h2>
          <p className="text-muted-foreground">Add, view, and manage teacher information</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search teachers by name or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-input border-border focus:border-primary"
        />
      </div>

      {/* Teachers Grid */}
      {filteredTeachers.length === 0 ? (
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {searchTerm ? "No teachers found matching your search." : "No teachers added yet. Click 'Add Teacher' to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map((teacher) => (
            <Card
              key={teacher._id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary/50 transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedTeacher(teacher)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-foreground mb-1">{teacher.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {teacher.rating.toFixed(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Students</p>
                    <p className="text-2xl font-bold text-foreground">{teacher.students}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Attendance</p>
                    <p className="text-2xl font-bold text-foreground">{teacher.attendance}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Avg Grade</p>
                    <p className="text-2xl font-bold text-foreground">{teacher.avgGrade}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                    <p className="text-2xl font-bold text-foreground">{teacher.engagement}%</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="pt-2 border-t border-border/50">
                  <Badge className={`w-full justify-center ${getStatusColor(teacher.status)}`}>
                    {teacher.status}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTeacher(teacher)
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
                      handleDeleteTeacher(teacher._id)
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Teacher Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New Teacher</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTeacher} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="Sarah Johnson"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Subject *</label>
                <Input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="Mathematics"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Students *</label>
                <Input
                  type="number"
                  value={formData.students}
                  onChange={(e) => setFormData({ ...formData, students: Number(e.target.value) })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="128"
                  required
                  min="0"
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
                <label className="block text-sm font-medium text-foreground mb-2">Avg Grade *</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.avgGrade}
                  onChange={(e) => setFormData({ ...formData, avgGrade: Number(e.target.value) })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="8.5"
                  required
                  min="0"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Engagement (%) *</label>
                <Input
                  type="number"
                  value={formData.engagement}
                  onChange={(e) => setFormData({ ...formData, engagement: Number(e.target.value) })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="92"
                  required
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Rating *</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="4.8"
                  required
                  min="0"
                  max="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:border-primary text-foreground"
                  required
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Needs Improvement">Needs Improvement</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="sarah@institution.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Department</label>
                <Input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="STEM"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Experience (Years)</label>
              <Input
                type="number"
                step="0.5"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                className="bg-input border-border focus:border-primary"
                placeholder="5"
                min="0"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Add Teacher
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Teacher Details Modal with Overview and Analytics */}
      {selectedTeacher && (
        <Dialog open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
          <DialogContent className="bg-card border-border max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold text-foreground">{selectedTeacher.name}</DialogTitle>
                  <p className="text-muted-foreground mt-1">{selectedTeacher.subject}</p>
                </div>
                <Badge className={getStatusColor(selectedTeacher.status)}>
                  {selectedTeacher.status}
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
                          <p className="text-xs text-muted-foreground">Students</p>
                          <p className="text-2xl font-bold text-blue-400">{selectedTeacher.students}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-400/30" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Attendance</p>
                          <p className="text-2xl font-bold text-emerald-400">{selectedTeacher.attendance}%</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-emerald-400/30" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Grade</p>
                          <p className="text-2xl font-bold text-purple-400">{selectedTeacher.avgGrade}</p>
                        </div>
                        <BookOpen className="w-8 h-8 text-purple-400/30" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                          <p className="text-2xl font-bold text-cyan-400">{selectedTeacher.engagement}%</p>
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
                        <span className="font-medium">{selectedTeacher.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subject:</span>
                        <span className="font-medium">{selectedTeacher.subject}</span>
                      </div>
                      {selectedTeacher.email && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-medium">{selectedTeacher.email}</span>
                        </div>
                      )}
                      {selectedTeacher.department && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Department:</span>
                          <span className="font-medium">{selectedTeacher.department}</span>
                        </div>
                      )}
                      {selectedTeacher.experience && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Experience:</span>
                          <span className="font-medium">{selectedTeacher.experience} years</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rating:</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          {selectedTeacher.rating.toFixed(1)}/5.0
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Attendance Rate</span>
                          <span className="text-sm font-medium">{selectedTeacher.attendance}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                            style={{ width: `${selectedTeacher.attendance}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Engagement Level</span>
                          <span className="text-sm font-medium">{selectedTeacher.engagement}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                            style={{ width: `${selectedTeacher.engagement}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Average Grade</span>
                          <span className="text-sm font-medium">{selectedTeacher.avgGrade}/10</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                            style={{ width: `${(selectedTeacher.avgGrade / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6 mt-6">
                {/* Performance Distribution Pie Chart */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Excellent", value: selectedTeacher.attendance },
                            { name: "Good", value: selectedTeacher.engagement },
                            { name: "Average", value: 100 - selectedTeacher.attendance - selectedTeacher.engagement },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#3b82f6" />
                          <Cell fill="#f59e0b" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Performance Metrics Bar Chart */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Metrics Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={[
                          {
                            name: "Attendance",
                            value: selectedTeacher.attendance,
                            fullMark: 100,
                          },
                          {
                            name: "Engagement",
                            value: selectedTeacher.engagement,
                            fullMark: 100,
                          },
                          {
                            name: "Avg Grade",
                            value: selectedTeacher.avgGrade * 10,
                            fullMark: 100,
                          },
                          {
                            name: "Rating",
                            value: selectedTeacher.rating * 20,
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

                {/* Performance Trend Line Chart */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Trend (Last 6 Months)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={[
                          { month: "Jan", attendance: selectedTeacher.attendance - 5, engagement: selectedTeacher.engagement - 8 },
                          { month: "Feb", attendance: selectedTeacher.attendance - 3, engagement: selectedTeacher.engagement - 5 },
                          { month: "Mar", attendance: selectedTeacher.attendance - 2, engagement: selectedTeacher.engagement - 3 },
                          { month: "Apr", attendance: selectedTeacher.attendance - 1, engagement: selectedTeacher.engagement - 2 },
                          { month: "May", attendance: selectedTeacher.attendance, engagement: selectedTeacher.engagement - 1 },
                          { month: "Jun", attendance: selectedTeacher.attendance, engagement: selectedTeacher.engagement },
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
                        <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} name="Attendance %" />
                        <Line type="monotone" dataKey="engagement" stroke="#06b6d4" strokeWidth={2} name="Engagement %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Radar Chart for Overall Performance */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Overall Performance Radar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={[
                        {
                          subject: "Attendance",
                          A: selectedTeacher.attendance,
                          fullMark: 100,
                        },
                        {
                          subject: "Engagement",
                          A: selectedTeacher.engagement,
                          fullMark: 100,
                        },
                        {
                          subject: "Grade",
                          A: selectedTeacher.avgGrade * 10,
                          fullMark: 100,
                        },
                        {
                          subject: "Rating",
                          A: selectedTeacher.rating * 20,
                          fullMark: 100,
                        },
                        {
                          subject: "Students",
                          A: Math.min((selectedTeacher.students / 200) * 100, 100),
                          fullMark: 100,
                        },
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.5)" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="rgba(255,255,255,0.5)" />
                        <Radar
                          name="Performance"
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

