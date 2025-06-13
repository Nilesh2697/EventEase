import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createEvent } from "@/lib/events"
import { z } from "zod"

const eventSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().min(2),
  userId: z.string(),
  isPublic: z.boolean().default(true),
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = eventSchema.parse(body)

    // Ensure the user can only create events for themselves
    if (validatedData.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const event = await createEvent(validatedData)

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Event creation error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input data", errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    // If admin or staff, they can view all events
    // If event owner, they can only view their own events
    if (session.user.role !== "Admin" && session.user.role !== "Staff" && userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const client = await import("@/lib/mongodb").then((mod) => mod.default)
    const db = client.db()

    const query = userId ? { userId } : {}
    const events = await db.collection("events").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(
      events.map((event) => ({
        ...event,
        _id: event._id.toString(),
      })),
    )
  } catch (error) {
    console.error("Event fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
