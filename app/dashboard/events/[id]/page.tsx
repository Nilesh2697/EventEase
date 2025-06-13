import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getEventById } from "@/lib/events"
import { getRsvpsByEventId } from "@/lib/rsvps"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Calendar, Clock, Download, MapPin, Pencil, Share } from "lucide-react"
import AttendeesList from "@/components/attendees-list"
import EventStats from "@/components/event-stats"

interface EventPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const event = await getEventById(params.id)

  if (!event) {
    return {
      title: "Event Not Found - EventEase",
    }
  }

  return {
    title: `${event.title} - EventEase`,
    description: "Manage your event and attendees",
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  // Check if user has permission to view this event
  if (session.user.role !== "Admin" && session.user.role !== "Staff" && event.userId !== session.user.id) {
    redirect("/dashboard")
  }

  const rsvps = await getRsvpsByEventId(params.id)

  return (
    <DashboardShell>
      <DashboardHeader heading={event.title} text="Manage your event and attendees.">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/events/${params.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Event
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/event/${params.id}`} target="_blank">
              <Share className="mr-2 h-4 w-4" />
              View Public Page
            </Link>
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{formatDate(new Date(event.date))}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{event.time}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="attendees">
          <TabsList>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="details">Event Details</TabsTrigger>
          </TabsList>
          <TabsContent value="attendees" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Attendees ({rsvps.length})</h2>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/api/events/${params.id}/export`}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Link>
              </Button>
            </div>
            <AttendeesList rsvps={rsvps} customFields={event.customFields} />
          </TabsContent>
          <TabsContent value="stats">
            <EventStats eventId={params.id} rsvps={rsvps} />
          </TabsContent>
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Event Description</CardTitle>
                <CardDescription>Details about your event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>{event.description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
