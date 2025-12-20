'use client'
import { usePathname } from "next/navigation";
import Titulo from "@/app/components/Titulo";
import MenuLateral from "@/app/components/MenuLateral";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Rotas de admin com MenuLateral (Titulo + MenuLateral)
  const isAdminRoute = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/servico') ||
    pathname.startsWith('/empresa') ||
    (pathname.startsWith('/contratado') && !pathname.startsWith('/contratados'));

  // Rotas de empresa, index e login
  const isEmpresaOrIndexRoute =
    pathname === '/' ||
    pathname.startsWith('/contratados') ||
    pathname.startsWith('/sobre-nos') ||
    pathname.startsWith('/contate-nos') ||
    pathname.includes('/loginempresa') ||
    pathname.startsWith('/home-empresa') ||
    pathname.includes('/logincontratado');

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

export default LayoutContent;