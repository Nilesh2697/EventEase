import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getEventById } from "@/lib/events"
import { formatDate } from "@/lib/utils"
import { Calendar, Clock, MapPin } from "lucide-react"
import RsvpForm from "@/components/rsvp-form"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

interface EventPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const event = await getEventById(params.id)

  if (!event) {
    return {
      title: "Event Not Found",
    }
  }

  return {
    title: `${event.title} - EventEase`,
    description: event.description,
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-2">{event.title}</h1>
                <div className="flex flex-col space-y-2 text-sm md:text-base">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(new Date(event.date))}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">About this event</h2>
                <div className="prose max-w-none">
                  <p>{event.description}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Register for this event</h3>
                  <RsvpForm eventId={event._id} customFields={event.customFields} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
