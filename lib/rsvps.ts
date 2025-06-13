import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export type RSVP = {
  _id: string
  eventId: string
  name: string
  email: string
  responses: Record<string, any>
  createdAt: Date
}

export async function getRsvpsByEventId(eventId: string): Promise<RSVP[]> {
  const client = await clientPromise
  const db = client.db()

  const rsvps = await db.collection("rsvps").find({ eventId }).sort({ createdAt: -1 }).toArray()

  return rsvps.map((rsvp) => ({
    ...rsvp,
    _id: rsvp._id.toString(),
  }))
}

export async function getRsvpsByEventIds(eventIds: string[]): Promise<RSVP[]> {
  if (eventIds.length === 0) return []

  const client = await clientPromise
  const db = client.db()

  const rsvps = await db
    .collection("rsvps")
    .find({ eventId: { $in: eventIds } })
    .sort({ createdAt: -1 })
    .toArray()

  return rsvps.map((rsvp) => ({
    ...rsvp,
    _id: rsvp._id.toString(),
  }))
}

export async function getRsvpById(id: string): Promise<RSVP | null> {
  const client = await clientPromise
  const db = client.db()

  try {
    const rsvp = await db.collection("rsvps").findOne({ _id: new ObjectId(id) })

    if (!rsvp) return null

    return {
      ...rsvp,
      _id: rsvp._id.toString(),
    }
  } catch (error) {
    console.error("Error fetching RSVP:", error)
    return null
  }
}

export async function deleteRsvp(id: string): Promise<boolean> {
  const client = await clientPromise
  const db = client.db()

  try {
    await db.collection("rsvps").deleteOne({ _id: new ObjectId(id) })
    return true
  } catch (error) {
    console.error("Error deleting RSVP:", error)
    return false
  }
}
