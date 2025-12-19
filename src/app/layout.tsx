'use client'
import "@/app/styles/globals.css";
import { Toaster } from "sonner";
import NextAuthSessionProvider from "@/app/providers/SessionProvider";
import { usePathname } from "next/navigation";
import Titulo from "@/app/components/Titulo";
import MenuLateral from "@/app/components/MenuLateral";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Rotas com apenas Titulo
  const isTituloOnly = pathname.includes('/logincontratado') || pathname.startsWith('/admin');

  // Rotas de admin com MenuLateral (Titulo + MenuLateral)
  const isAdminRoute = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/servico') ||
    pathname.startsWith('/empresa') ||
    (pathname.startsWith('/contratado') && !pathname.startsWith('/contratados'));

  // Rotas de empresa, index e loginempresa
  const isEmpresaOrIndexRoute = pathname.startsWith('/home-empresa') ||
    pathname === '/' ||
    pathname.startsWith('/contate-nos') ||
    pathname.startsWith('/contratados') ||
    pathname.startsWith('/sobre-nos') ||
    pathname.includes('/loginempresa');

  if (isTituloOnly) {
    return (
      <>
        <Titulo />
        {children}
      </>
    );
  }

  if (isAdminRoute) {
    return (
      <>
          <Titulo />
        <div className="sm:ml-64">
          <MenuLateral />
          {children}
        </div>
      </>
    );
  }

  if (isEmpresaOrIndexRoute) {
    return (
      <>
        <Header />
        {children}
        <Footer />
      </>
    );
  }

  // Fallback para outras rotas
  return children;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
      </head>
      <body>
        <NextAuthSessionProvider>
          <LayoutContent>{children}</LayoutContent>
        </NextAuthSessionProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
