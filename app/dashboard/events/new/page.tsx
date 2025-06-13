import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import EventForm from "@/components/event-form"

export const metadata: Metadata = {
  title: "Create Event - EventEase",
  description: "Create a new event",
}

export default async function NewEventPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create Event" text="Create a new event and start collecting RSVPs." />
      <div className="grid gap-8">
        <EventForm userId={session.user.id} />
      </div>
    </DashboardShell>
  )
}
