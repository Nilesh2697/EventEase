import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { ObjectId } from "mongodb"
import { authOptions } from "@/lib/auth"
import { getEventById, updateEvent, deleteEvent } from "@/lib/events"
import { z } from "zod"

const eventUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  date: z.string().min(1).optional(),
  time: z.string().min(1).optional(),
  location: z.string().min(2).optional(),
  isPublic: z.boolean().optional(),
  customFields: z
    .array(
      z.object({
        name: z.string().min(1),
        type: z.enum(["text", "email", "number", "checkbox"]),
        required: z.boolean().default(false),
      }),
    )
    .optional(),
})

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

    // For public events, no authentication needed
    if (event.isPublic) {
      return NextResponse.json(event)
    }

    // For private events, check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to view this event
    if (session.user.role !== "Admin" && session.user.role !== "Staff" && event.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Event fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid event ID" }, { status: 400 })
    }

    const event = await getEventById(id)

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    // Check if user has permission to update this event
    if (session.user.role !== "Admin" && session.user.role !== "Staff" && event.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = eventUpdateSchema.parse(body)

    const updatedEvent = await updateEvent(id, validatedData)

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error("Event update error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input data", errors: error.errors }, { status: 400 })
    }
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
      return NextResponse.json({ message: "Invalid event ID" }, { status: 400 })
    }

    const event = await getEventById(id)

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    // Check if user has permission to delete this event
    if (session.user.role !== "Admin" && session.user.role !== "Staff" && event.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    await deleteEvent(id)

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Event deletion error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
