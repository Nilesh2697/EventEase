import type React from "react"
import { cn } from "@/lib/utils"
import DashboardNav from "@/components/dashboard-nav"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

interface DashboardShellProps {
  children?: React.ReactNode
  className?: string
}

export default function DashboardShell({ children, className }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
          <DashboardNav />
        </aside>
        <main className={cn("flex w-full flex-1 flex-col overflow-hidden", className)}>
          <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
