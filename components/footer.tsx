import Link from "next/link"
import { Github, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <Link
              href="https://github.com/Nilesh2697"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Your Full Name
            </Link>
            . All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="https://github.com/Nilesh2697" target="_blank" rel="noreferrer">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="www.linkedin.com/in/nilesh-prajapati26" target="_blank" rel="noreferrer">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
