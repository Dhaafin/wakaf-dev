import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = 
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/admin/dashboard") ||
    request.nextUrl.pathname.startsWith("/profil");

  if (!sessionToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika sudah login dan mencoba ke halaman auth, lempar ke dashboard/riwayat
  if (sessionToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/riwayat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/profil/:path*", "/login", "/register"],
};
