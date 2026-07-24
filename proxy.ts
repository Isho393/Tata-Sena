import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSessionCookieValue } from "@/lib/auth";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const isAdminPage = pathname.startsWith("/admin");
  const isProtectedApi =
    pathname.startsWith("/api/products") && MUTATING_METHODS.has(request.method);

  if (!isAdminPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (await isValidSessionCookieValue(session)) {
    return NextResponse.next();
  }

  if (isAdminPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
}

export const config = {
  matcher: ["/admin/:path*", "/api/products", "/api/products/:path*"],
};
