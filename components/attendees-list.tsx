"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { RSVP } from "@/lib/rsvps"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import { MoreHorizontal, Search, Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AttendeesListProps {
  rsvps: RSVP[]
  customFields?: {
    name: string
    type: string
    required: boolean
  }[]
}

export default function AttendeesList({ rsvps, customFields = [] }: AttendeesListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [rsvpToDelete, setRsvpToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = (id: string) => {
    setRsvpToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!rsvpToDelete) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/rsvps/${rsvpToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete RSVP")
      }

      toast({
        title: "RSVP deleted",
        description: "The RSVP has been deleted successfully.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete RSVP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setRsvpToDelete(null)
    }
  }

  const filteredRsvps = rsvps.filter((rsvp) => {
    const searchLower = searchTerm.toLowerCase()
    return rsvp.name.toLowerCase().includes(searchLower) || rsvp.email.toLowerCase().includes(searchLower)
  })

  // Determine which columns to show
  const columnsToShow = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    ...(customFields?.map((field) => ({
      key: field.name,
      label: field.name,
    })) || []),
    { key: "createdAt", label: "RSVP Date" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search attendees..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredRsvps.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columnsToShow.map((column) => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ))}
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRsvps.map((rsvp) => (
                <TableRow key={rsvp._id}>
                  <TableCell>{rsvp.name}</TableCell>
                  <TableCell>{rsvp.email}</TableCell>
                  {customFields?.map((field) => (
                    <TableCell key={field.name}>
                      {field.type === "checkbox"
                        ? rsvp.responses[field.name]
                          ? "Yes"
                          : "No"
                        : rsvp.responses[field.name] || "-"}
                    </TableCell>
                  ))}
                  <TableCell>{formatDate(new Date(rsvp.createdAt))}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(rsvp._id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete RSVP</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No attendees found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {searchTerm
                ? "No attendees match your search. Try a different search term."
                : "No one has RSVP'd to this event yet. Share your event to get attendees."}
            </p>
          </div>
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the RSVP from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
