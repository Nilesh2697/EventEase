"use client"

import type { RSVP } from "@/lib/rsvps"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarClock, Users } from "lucide-react"

interface EventStatsProps {
  eventId: string
  rsvps: RSVP[]
}

export default function EventStats({ eventId, rsvps }: EventStatsProps) {
  // Calculate stats
  const totalRsvps = rsvps.length

  // Calculate RSVPs per day
  const rsvpsByDay = rsvps.reduce((acc: Record<string, number>, rsvp) => {
    const date = new Date(rsvp.createdAt).toLocaleDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  // Find the day with most RSVPs
  let maxRsvpDay = ""
  let maxRsvpCount = 0

  Object.entries(rsvpsByDay).forEach(([day, count]) => {
    if (count > maxRsvpCount) {
      maxRsvpDay = day
      maxRsvpCount = count
    }
  })

  // Calculate average RSVPs per day
  const uniqueDays = Object.keys(rsvpsByDay).length
  const avgRsvpsPerDay = uniqueDays > 0 ? (totalRsvps / uniqueDays).toFixed(1) : "0"

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Total RSVPs</CardTitle>
            <CardDescription>Overall attendance count</CardDescription>
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
            <CardTitle className="text-sm font-medium">Average RSVPs per Day</CardTitle>
            <CardDescription>Daily registration rate</CardDescription>
          </div>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgRsvpsPerDay}</div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>RSVP Timeline</CardTitle>
          <CardDescription>Registration activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          {totalRsvps > 0 ? (
            <div className="h-[200px] w-full">
              <div className="flex h-full items-end gap-2">
                {Object.entries(rsvpsByDay).map(([day, count], index) => {
                  const height = (count / maxRsvpCount) * 100
                  return (
                    <div key={index} className="flex flex-1 flex-col items-center">
                      <div className="w-full bg-primary rounded-t" style={{ height: `${height}%` }} />
                      <div className="mt-2 text-xs text-muted-foreground">
                        {new Date(day).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-sm text-muted-foreground">No RSVP data available yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
