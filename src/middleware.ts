import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Obter o token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // 2. Se não houver token, redirecionar conforme a rota
  if (!token) {
    if (pathname.startsWith("/home-empresa")) {
      return NextResponse.redirect(new URL("/loginempresa", request.url));
    }
    // Para todas as outras rotas privadas do matcher
    return NextResponse.redirect(new URL("/loginfuncionario", request.url));
  }

  // 3. Verificação de permissões (Roles)
  
  // Rotas de Empresa: exige que seja 'empresa'
  if (pathname.startsWith("/home-empresa") && !(token as any)?.empresa) {
    return NextResponse.redirect(new URL("/loginempresa", request.url));
  }

  // Rotas de Funcionário: exige que seja 'funcionario'
  const isFuncionarioRoute = pathname.startsWith("/dashboard") || 
                           pathname.startsWith("/funcionario") || 
                           pathname.startsWith("/servico") || 
                           pathname.startsWith("/empresa");

  if (isFuncionarioRoute && !(token as any)?.funcionario) {
    return NextResponse.redirect(new URL("/loginfuncionario", request.url));
  }

  return NextResponse.next();
}

// O Matcher deve conter todas as rotas que PRECISAM de verificação (privadas)
export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/funcionario/:path*",
    "/empresa/:path*",
    "/servico/:path*",
    "/home-empresa/:path*"
  ]
};