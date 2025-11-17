"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function AddStudentModal({
  open,
  onClose,
  onSubmit,
}: { open: boolean; onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    grade: "",
    status: "Active",
    gpa: 0,
    attendance: 0,
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "gpa" || name === "attendance" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSubmit(formData)
        setFormData({ name: "", email: "", grade: "", status: "Active", gpa: 0, attendance: 0 })
        onClose()
      }
    } catch (error) {
      console.error("Error adding student:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Student</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Enter student name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Grade</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="e.g., 10-A"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="input-field w-full">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">GPA</label>
              <input
                type="number"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                className="input-field w-full"
                step="0.01"
                max="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Attendance (%)</label>
              <input
                type="number"
                name="attendance"
                value={formData.attendance}
                onChange={handleChange}
                className="input-field w-full"
                step="0.1"
                max="100"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={onClose} className="button-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="button-primary">
              {loading ? "Adding..." : "Add Student"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
