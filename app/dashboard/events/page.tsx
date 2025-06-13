import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import EventsList from "@/components/events-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getUserEvents } from "@/lib/events"

export const metadata: Metadata = {
  title: "Events - EventEase",
  description: "Manage your events",
}

export default async function EventsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const events = await getUserEvents(session.user.id)

  return (
    <DashboardShell>
      <DashboardHeader heading="Events" text="Create and manage your events.">
        <Button asChild>
          <Link href="/dashboard/events/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Event
          </Link>
        </Button>
      </DashboardHeader>
      <div>
        {events.length > 0 ? (
          <EventsList events={events} />
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <h3 className="mt-4 text-lg font-semibold">No events created</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                You haven&apos;t created any events yet. Start creating events to manage your attendees.
              </p>
              <Button asChild>
                <Link href="/dashboard/events/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Event
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
