import type { Metadata } from "next"
import Link from "next/link"
import { getPublicEvents } from "@/lib/events"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

export const metadata: Metadata = {
  title: "Events - EventEase",
  description: "Browse upcoming events",
}

export default async function EventsPage() {
  const events = await getPublicEvents()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
            <div className="flex-1 space-y-4">
              <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">Events</h1>
              <p className="text-xl text-muted-foreground">Browse and register for upcoming events.</p>
            </div>
          </div>

          <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
            {events.length > 0 ? (
              events.map((event) => (
                <Card key={event._id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-col space-y-2 text-sm">
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
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/event/${event._id}`}>View Event</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                  <h3 className="mt-4 text-lg font-semibold">No events found</h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    There are no public events available at the moment. Check back later or create your own event.
                  </p>
                  <Button asChild>
                    <Link href="/register">Create an Account</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
