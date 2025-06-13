"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface RsvpFormProps {
  eventId: string
  customFields?: {
    name: string
    type: string
    required: boolean
  }[]
}

export default function RsvpForm({ eventId, customFields = [] }: RsvpFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Dynamically build the form schema based on custom fields
  const buildFormSchema = () => {
    const baseSchema = {
      name: z.string().min(2, { message: "Name is required" }),
      email: z.string().email({ message: "Please enter a valid email address" }),
    }

    const customFieldsSchema: Record<string, any> = {}

    customFields.forEach((field) => {
      if (field.type === "text") {
        customFieldsSchema[field.name] = field.required
          ? z.string().min(1, { message: `${field.name} is required` })
          : z.string().optional()
      } else if (field.type === "email") {
        customFieldsSchema[field.name] = field.required
          ? z.string().email({ message: `Please enter a valid email for ${field.name}` })
          : z
              .string()
              .email({ message: `Please enter a valid email for ${field.name}` })
              .optional()
      } else if (field.type === "number") {
        customFieldsSchema[field.name] = field.required
          ? z.string().refine((val) => !isNaN(Number(val)), { message: `${field.name} must be a number` })
          : z
              .string()
              .refine((val) => val === "" || !isNaN(Number(val)), { message: `${field.name} must be a number` })
              .optional()
      } else if (field.type === "checkbox") {
        customFieldsSchema[field.name] = field.required
          ? z.boolean().refine((val) => val === true, { message: `${field.name} is required` })
          : z.boolean().optional()
      }
    })

    return z.object({
      ...baseSchema,
      ...customFieldsSchema,
    })
  }

  const formSchema = buildFormSchema()
  type FormValues = z.infer<typeof formSchema>

  // Create default values for the form
  const createDefaultValues = () => {
    const defaultValues: Record<string, any> = {
      name: "",
      email: "",
    }

    customFields.forEach((field) => {
      if (field.type === "checkbox") {
        defaultValues[field.name] = false
      } else {
        defaultValues[field.name] = ""
      }
    })

    return defaultValues
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues(),
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to submit RSVP")
      }

      toast({
        title: "Success",
        description: "Your RSVP has been submitted successfully.",
      })

      setIsSubmitted(true)
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

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
        <p className="text-muted-foreground">
          Your RSVP has been submitted successfully. We look forward to seeing you at the event!
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {customFields.map((customField) => (
          <FormField
            key={customField.name}
            control={form.control}
            name={customField.name as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {customField.name}
                  {customField.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  {customField.type === "checkbox" ? (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange}
                        id={customField.name}
                      />
                      <label
                        htmlFor={customField.name}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {customField.name}
                      </label>
                    </div>
                  ) : (
                    <Input type={customField.type} placeholder={`Enter ${customField.name.toLowerCase()}`} {...field} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit RSVP"
          )}
        </Button>
      </form>
    </Form>
  )
}
