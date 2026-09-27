import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register") || req.nextUrl.pathname.startsWith("/admin-login");

    if (isAuthPage) {
      if (isAuth) {
        if(token?.role === "ADMIN") {
           return NextResponse.redirect(new URL("/admin/programs", req.url));
        }
        return NextResponse.redirect(new URL("/student/dashboard", req.url));
      }
      return null;
    }

    if (!isAuth) {
      // Redirect to login if user tries to access protected route without being authenticated
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin-login", req.url));
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/student/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware function handle the logic
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/login", "/admin-login", "/register"],
};
