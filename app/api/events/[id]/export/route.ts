import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { ObjectId } from "mongodb"
import { authOptions } from "@/lib/auth"
import { getEventById } from "@/lib/events"
import { getRsvpsByEventId } from "@/lib/rsvps"

export async function GET(req: Request, { params }: { params: { id: string } }) {
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

    // Check if user has permission to export RSVPs
    if (session.user.role !== "Admin" && session.user.role !== "Staff" && event.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const rsvps = await getRsvpsByEventId(id)

    // Generate CSV
    const customFields = event.customFields || []

    // Create headers
    const headers = ["Name", "Email", ...customFields.map((field) => field.name), "RSVP Date"]

    // Create rows
    const rows = rsvps.map((rsvp) => {
      const row = [
        rsvp.name,
        rsvp.email,
        ...customFields.map((field) => {
          if (field.type === "checkbox") {
            return rsvp.responses[field.name] ? "Yes" : "No"
          }
          return rsvp.responses[field.name] || ""
        }),
        new Date(rsvp.createdAt).toLocaleString(),
      ]

      return row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma
          if (typeof cell === "string" && (cell.includes(",") || cell.includes('"'))) {
            return `"${cell.replace(/"/g, '""')}"`
          }
          return cell
        })
        .join(",")
    })

    // Combine headers and rows
    const csv = [headers.join(","), ...rows].join("\n")

    // Create filename
    const filename = `${event.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-attendees-${new Date().toISOString().split("T")[0]}.csv`

    // Return CSV as download
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("CSV export error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
