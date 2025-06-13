import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserEvents } from "@/lib/events"
import { getRsvpsByEventIds } from "@/lib/rsvps"
import { Calendar, PlusCircle, Users } from "lucide-react"
import RecentRsvps from "@/components/recent-rsvps"

export const metadata: Metadata = {
  title: "Dashboard - EventEase",
  description: "Manage your events and RSVPs",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const events = await getUserEvents(session.user.id)
  const eventIds = events.map((event) => event._id)
  const rsvps = await getRsvpsByEventIds(eventIds)

  // Calculate stats
  const totalEvents = events.length
  const totalRsvps = rsvps.length
  const upcomingEvents = events.filter((event) => new Date(event.date) >= new Date()).length

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text={`Welcome back, ${session.user.name}`}>
        <Button asChild>
          <Link href="/dashboard/events/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Event
          </Link>
        </Button>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <CardDescription>All events you've created</CardDescription>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total RSVPs</CardTitle>
              <CardDescription>Across all your events</CardDescription>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRsvps}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <CardDescription>Events in the future</CardDescription>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <div key={event._id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/events/${event._id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                  <h3 className="mt-4 text-lg font-semibold">No events created</h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">You haven't created any events yet.</p>
                  <Button asChild>
                    <Link href="/dashboard/events/new">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Event
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent RSVPs</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentRsvps rsvps={rsvps} events={events} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
