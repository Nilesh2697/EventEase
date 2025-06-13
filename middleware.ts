import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Paths that require authentication
  const authPaths = ["/dashboard"]

  // Check if the path requires authentication
  const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // If the path requires authentication and the user is not authenticated, redirect to login
  if (isAuthPath && !isAuthenticated) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If the user is authenticated and trying to access login/register, redirect to dashboard
  if (isAuthenticated && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}
