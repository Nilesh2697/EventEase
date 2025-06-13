import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { getEventById } from "@/lib/events"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid event ID" }, { status: 400 })
    }

    const event = await getEventById(id)

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    const body = await req.json()

    // Basic validation for required fields
    if (!body.name || !body.email) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if this email has already RSVP'd
    const existingRsvp = await db.collection("rsvps").findOne({
      eventId: id,
      email: body.email,
    })

    if (existingRsvp) {
      return NextResponse.json({ message: "You have already RSVP'd to this event" }, { status: 409 })
    }

    // Create RSVP
    const rsvp = {
      eventId: id,
      name: body.name,
      email: body.email,
      responses: { ...body },
      createdAt: new Date(),
    }

    const result = await db.collection("rsvps").insertOne(rsvp)

    return NextResponse.json(
      {
        message: "RSVP submitted successfully",
        rsvpId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("RSVP submission error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid event ID" }, { status: 400 })
    }

    const event = await getEventById(id)

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    const client = await clientPromise
    const db = client.db()

    const rsvps = await db.collection("rsvps").find({ eventId: id }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(
      rsvps.map((rsvp) => ({
        ...rsvp,
        _id: rsvp._id.toString(),
      })),
    )
  } catch (error) {
    console.error("RSVP fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
