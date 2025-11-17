"use client"

import { Menu, Bell, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DashboardHeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function DashboardHeader({ sidebarOpen, setSidebarOpen }: DashboardHeaderProps) {
  return (
    <header className="bg-white/5 backdrop-blur-xl border border-white/10 border-b border-border sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-6 gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 max-w-sm hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10 bg-input border-border focus:border-primary" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-border/50">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground">Principal</p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
