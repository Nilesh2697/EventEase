import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { ObjectId } from "mongodb"
import { authOptions } from "@/lib/auth"
import { getRsvpById, deleteRsvp } from "@/lib/rsvps"
import { getEventById } from "@/lib/events"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid RSVP ID" }, { status: 400 })
    }

    const rsvp = await getRsvpById(id)

    if (!rsvp) {
      return NextResponse.json({ message: "RSVP not found" }, { status: 404 })
    }

    // Get the event to check permissions
    const event = await getEventById(rsvp.eventId)

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    // Check if user has permission to view this RSVP
    if (session.user.role !== "Admin" && session.user.role !== "Staff" && event.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(rsvp)
  } catch (error) {
    console.error("RSVP fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid RSVP ID" }, { status: 400 })
    }

    const rsvp = await getRsvpById(id)

    if (!rsvp) {
      return NextResponse.json({ message: "RSVP not found" }, { status: 404 })
    }

    // Get the event to check permissions
    const event = await getEventById(rsvp.eventId)

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    // Check if user has permission to delete this RSVP
    if (session.user.role !== "Admin" && session.user.role !== "Staff" && event.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    await deleteRsvp(id)

    return NextResponse.json({ message: "RSVP deleted successfully" })
  } catch (error) {
    console.error("RSVP deletion error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
