import type { RSVP } from "@/lib/rsvps"
import type { Event } from "@/lib/events"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface RecentRsvpsProps {
  rsvps: RSVP[]
  events: Event[]
}

export default function RecentRsvps({ rsvps, events }: RecentRsvpsProps) {
  // Create a map of event IDs to event titles for easy lookup
  const eventMap = events.reduce(
    (acc, event) => {
      acc[event._id] = event.title
      return acc
    },
    {} as Record<string, string>,
  )

  // Sort RSVPs by date (newest first) and take the first 5
  const recentRsvps = [...rsvps]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  if (recentRsvps.length === 0) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No RSVPs yet</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">You haven't received any RSVPs yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentRsvps.map((rsvp) => (
        <div key={rsvp._id} className="flex items-center space-x-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <span className="font-medium text-primary">{rsvp.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="space-y-1">
            <p className="font-medium">{rsvp.name}</p>
            <p className="text-sm text-muted-foreground">
              RSVP'd to{" "}
              <Link
                href={`/dashboard/events/${rsvp.eventId}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {eventMap[rsvp.eventId] || "Unknown Event"}
              </Link>{" "}
              {formatDistanceToNow(new Date(rsvp.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
