import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import { getUserEvents } from "@/lib/events"
import { getRsvpsByEventIds } from "@/lib/rsvps"
import AllAttendeesList from "@/components/all-attendees-list"

export const metadata: Metadata = {
  title: "Attendees - EventEase",
  description: "Manage all your event attendees",
}

export default async function AttendeesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Get all events for this user
  const events = await getUserEvents(session.user.id)

  // Get all RSVPs for these events
  const eventIds = events.map((event) => event._id)
  const rsvps = await getRsvpsByEventIds(eventIds)

  return (
    <DashboardShell>
      <DashboardHeader heading="All Attendees" text="Manage attendees across all your events." />
      <div className="grid gap-8">
        <AllAttendeesList rsvps={rsvps} events={events} />
      </div>
    </DashboardShell>
  )
}
