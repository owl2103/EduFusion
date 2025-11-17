"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EnhancedDashboardOverview } from "@/components/dashboard/enhanced-dashboard-overview"
import { TeacherPerformance } from "@/components/dashboard/teacher-performance"
import { TeachersManagement } from "@/components/dashboard/teachers-management"
import { StudentsManagement } from "@/components/dashboard/students-management"
import { CurriculumTracker } from "@/components/dashboard/curriculum-tracker"
import { EnhancedAlerts } from "@/components/dashboard/enhanced-alerts"
import { Reports } from "@/components/dashboard/reports"
import { Settings } from "@/components/dashboard/settings"
import { DepartmentPerformance } from "@/components/dashboard/department-performance"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeNav, setActiveNav] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeNav) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Real-time overview of your institution's performance</p>
            </div>
            <EnhancedDashboardOverview />
          </div>
        )
      case "teachers":
        return (
          <div className="space-y-6">
            <TeachersManagement />
          </div>
        )
      case "students":
        return (
          <div className="space-y-6">
            <StudentsManagement />
          </div>
        )
      case "departments":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Department Performance</h1>
              <p className="text-muted-foreground">Multi-dimensional analysis across all departments</p>
            </div>
            <DepartmentPerformance />
          </div>
        )
      case "curriculum":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Curriculum Tracker</h1>
              <p className="text-muted-foreground">Track curriculum progress and completion timelines</p>
            </div>
            <CurriculumTracker />
          </div>
        )
      case "alerts":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Alerts & Notifications</h1>
              <p className="text-muted-foreground">Advanced notification management system</p>
            </div>
            <EnhancedAlerts />
          </div>
        )
      case "reports":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Reports</h1>
              <p className="text-muted-foreground">Generate and analyze detailed institutional reports</p>
            </div>
            <Reports />
          </div>
        )
      case "settings":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage institution information and system preferences</p>
            </div>
            <Settings />
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}
              </h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} isOpen={sidebarOpen} onLogout={onLogout} />

      <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  )
}
