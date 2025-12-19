import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('Middleware executado para:', pathname);
  
  // Pula middleware para rotas públicas
  if (pathname === "/" || pathname.startsWith("/admin") || pathname.startsWith("/contate-nos") || pathname.startsWith("/sobre-nos") || pathname.startsWith("/contratados") || pathname.startsWith("/logincontratado") || pathname.startsWith("/loginempresa")) {
    return NextResponse.next();
  }
  
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  console.log('Token:', token);
  
  if (!token) {
    if (pathname.startsWith("/home-empresa")) {
      return NextResponse.redirect(new URL("/loginempresa", request.url));
    }
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/contratado") || pathname.startsWith("/empresa") || pathname.startsWith("/servico")) {
      return NextResponse.redirect(new URL("/logincontratado", request.url));
    }
  }
  
  // Rotas admin - apenas contratados
  if (pathname.startsWith("/dashboard") || (pathname.startsWith('/contratado') && !pathname.startsWith('/contratados')) || pathname.startsWith("/empresa") || pathname.startsWith("/servico")) {
    if (!(token as any)?.contratado) {
      return NextResponse.redirect(new URL("/logincontratado", request.url));
    }
  }
  
  // Rotas empresa - apenas empresas
  if (pathname.startsWith("/home-empresa")) {
    if (!(token as any)?.empresa) {
      return NextResponse.redirect(new URL("/loginempresa", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/contratado/:path*",
    "/empresa/:path*",
    "/servico/:path*",
    "/home-empresa/:path*"
  ]
};