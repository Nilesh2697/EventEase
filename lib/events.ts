import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export type Event = {
  _id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  userId: string
  createdAt: Date
  updatedAt: Date
  customFields?: Record<string, any>
}

export async function getUserEvents(userId: string): Promise<Event[]> {
  const client = await clientPromise
  const db = client.db()

  const events = await db.collection("events").find({ userId }).sort({ createdAt: -1 }).toArray()

  return events.map((event) => ({
    ...event,
    _id: event._id.toString(),
  }))
}

export async function getEventById(id: string): Promise<Event | null> {
  const client = await clientPromise
  const db = client.db()

  try {
    const event = await db.collection("events").findOne({ _id: new ObjectId(id) })

    if (!event) return null

    return {
      ...event,
      _id: event._id.toString(),
    }
  } catch (error) {
    console.error("Error fetching event:", error)
    return null
  }
}

export async function createEvent(eventData: Omit<Event, "_id" | "createdAt" | "updatedAt">) {
  const client = await clientPromise
  const db = client.db()

  const now = new Date()

  const result = await db.collection("events").insertOne({
    ...eventData,
    createdAt: now,
    updatedAt: now,
  })

  return {
    _id: result.insertedId.toString(),
    ...eventData,
    createdAt: now,
    updatedAt: now,
  }
}

export async function updateEvent(
  id: string,
  eventData: Partial<Omit<Event, "_id" | "userId" | "createdAt" | "updatedAt">>,
) {
  const client = await clientPromise
  const db = client.db()

  const now = new Date()

  await db.collection("events").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...eventData,
        updatedAt: now,
      },
    },
  )

  const updatedEvent = await getEventById(id)
  return updatedEvent
}

export async function deleteEvent(id: string) {
  const client = await clientPromise
  const db = client.db()

  await db.collection("events").deleteOne({ _id: new ObjectId(id) })

  // Also delete all RSVPs for this event
  await db.collection("rsvps").deleteMany({ eventId: id })

  return true
}

export async function getPublicEvents(): Promise<Event[]> {
  const client = await clientPromise
  const db = client.db()

  const events = await db.collection("events").find({ isPublic: true }).sort({ date: 1 }).toArray()

  return events.map((event) => ({
    ...event,
    _id: event._id.toString(),
  }))
}
