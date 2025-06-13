import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getEventById } from "@/lib/events"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import EventForm from "@/components/event-form"

interface EditEventPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EditEventPageProps): Promise<Metadata> {
  const event = await getEventById(params.id)

  if (!event) {
    return {
      title: "Event Not Found - EventEase",
    }
  }

  return {
    title: `Edit ${event.title} - EventEase`,
    description: "Edit your event details",
  }
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  // Check if user has permission to edit this event
  if (session.user.role !== "Admin" && session.user.role !== "Staff" && event.userId !== session.user.id) {
    redirect("/dashboard")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Event" text="Update your event details." />
      <div className="grid gap-8">
        <EventForm userId={session.user.id} event={event} />
      </div>
    </DashboardShell>
  )
}
