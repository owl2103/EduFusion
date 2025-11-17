"use client"

import { BarChart3, Users, Book, AlertCircle, FileText, Settings, LogOut, BookOpen } from "lucide-react"

interface SidebarProps {
  activeNav: string
  setActiveNav: (nav: string) => void
  isOpen: boolean
  onLogout: () => void
}

export function Sidebar({ activeNav, setActiveNav, isOpen, onLogout }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "students", label: "Students & Classes", icon: Book },
    { id: "curriculum", label: "Curriculum", icon: BookOpen },
    { id: "alerts", label: "Alerts", icon: AlertCircle },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 fixed left-0 top-0 h-screen border-r border-border transition-all duration-300 z-40 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-border/50">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        {isOpen && <span className="ml-3 font-bold text-lg text-foreground">EduFusion</span>}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeNav === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30 shadow-lg shadow-primary/20 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5 hover:shadow-md hover:shadow-white/5 hover:scale-102"
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-border/50">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:shadow-md hover:shadow-destructive/20"
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  )
}
