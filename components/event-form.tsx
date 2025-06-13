"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Trash } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Event } from "@/lib/events"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  date: z.string().min(1, {
    message: "Date is required.",
  }),
  time: z.string().min(1, {
    message: "Time is required.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  isPublic: z.boolean().default(true),
  customFields: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Field name is required" }),
        type: z.enum(["text", "email", "number", "checkbox"]),
        required: z.boolean().default(false),
      }),
    )
    .optional(),
})

interface EventFormProps {
  userId: string
  event?: Event
}

export default function EventForm({ userId, event }: EventFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [customFields, setCustomFields] = useState<{ name: string; type: string; required: boolean }[]>(
    event?.customFields || [],
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      date: event?.date || "",
      time: event?.time || "",
      location: event?.location || "",
      isPublic: event?.isPublic !== undefined ? event.isPublic : true,
      customFields: event?.customFields || [],
    },
  })

  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", type: "text", required: false }])
  }

  const removeCustomField = (index: number) => {
    const updatedFields = [...customFields]
    updatedFields.splice(index, 1)
    setCustomFields(updatedFields)
  }

  const updateCustomField = (index: number, field: { name: string; type: string; required: boolean }) => {
    const updatedFields = [...customFields]
    updatedFields[index] = field
    setCustomFields(updatedFields)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const eventData = {
        ...values,
        userId,
        customFields,
      }

      const url = event ? `/api/events/${event._id}` : "/api/events"

      const method = event ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save event")
      }

      toast({
        title: "Success",
        description: event ? "Your event has been updated." : "Your event has been created.",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="Annual Conference 2025" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="123 Conference Center, City, State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide details about your event..." className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Public Event</FormLabel>
                <FormDescription>Make this event visible in the public events listing.</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Custom RSVP Fields</h3>
            <Button type="button" variant="outline" size="sm" onClick={addCustomField}>
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </div>

          {customFields.length > 0 ? (
            <div className="space-y-4">
              {customFields.map((field, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <FormLabel className="text-sm">Field Name</FormLabel>
                        <Input
                          value={field.name}
                          onChange={(e) => updateCustomField(index, { ...field, name: e.target.value })}
                          placeholder="e.g., Dietary Restrictions"
                        />
                      </div>
                      <div>
                        <FormLabel className="text-sm">Field Type</FormLabel>
                        <select
                          value={field.type}
                          onChange={(e) => updateCustomField(index, { ...field, type: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="number">Number</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                      </div>
                      <div className="flex items-end space-x-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`required-${index}`}
                            checked={field.required}
                            onCheckedChange={(checked) => updateCustomField(index, { ...field, required: !!checked })}
                          />
                          <label
                            htmlFor={`required-${index}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Required
                          </label>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomField(index)}
                          className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-8 text-center">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <h3 className="mt-4 text-lg font-semibold">No custom fields</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  Add custom fields to collect additional information from attendees.
                </p>
                <Button type="button" variant="outline" size="sm" onClick={addCustomField}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </div>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {event ? "Updating..." : "Creating..."}
            </>
          ) : event ? (
            "Update Event"
          ) : (
            "Create Event"
          )}
        </Button>
      </form>
    </Form>
  )
}
