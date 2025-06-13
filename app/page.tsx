import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, CheckCircle, Users } from "lucide-react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Simplify Your Event Planning with EventEase
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Create, manage, and track events effortlessly. From RSVPs to attendee management, EventEase handles it
                  all in one intuitive platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg">
                    <Link href="/register">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/events">Browse Events</Link>
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border bg-background p-8 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-10 w-10 text-primary" />
                    <div>
                      <h3 className="font-semibold">Easy Event Creation</h3>
                      <p className="text-sm text-muted-foreground">Create professional events in minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Users className="h-10 w-10 text-primary" />
                    <div>
                      <h3 className="font-semibold">Attendee Management</h3>
                      <p className="text-sm text-muted-foreground">Track RSVPs and manage attendees effortlessly</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle className="h-10 w-10 text-primary" />
                    <div>
                      <h3 className="font-semibold">Role-Based Access</h3>
                      <p className="text-sm text-muted-foreground">
                        Secure permissions for admins, staff, and event owners
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Powerful Features for Event Management
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Everything you need to create and manage successful events
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Streamline Your Event Management?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Join EventEase today and experience the difference in event planning and management.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg">
                  <Link href="/register">Create an Account</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

const features = [
  {
    icon: Calendar,
    title: "Event Creation",
    description: "Create events with customizable fields, dates, locations, and descriptions.",
  },
  {
    icon: Users,
    title: "RSVP Management",
    description: "Collect and manage RSVPs with custom forms and automated responses.",
  },
  {
    icon: CheckCircle,
    title: "Attendee Tracking",
    description: "Track attendance and export attendee data in CSV format.",
  },
  {
    icon: ArrowRight,
    title: "Public Event Pages",
    description: "Share events with public URLs for easy access and registration.",
  },
  {
    icon: Calendar,
    title: "Role-Based Access",
    description: "Secure your events with role-based permissions for different team members.",
  },
  {
    icon: Users,
    title: "Analytics Dashboard",
    description: "Get insights into event performance with detailed analytics.",
  },
]
