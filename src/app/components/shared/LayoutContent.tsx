'use client'
import { usePathname } from "next/navigation";
import MenuLateral from "@/app/components/layout/MenuLateral";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Rotas de admin com MenuLateral 
  const isAdminRoute = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/servico') ||
    pathname.startsWith('/empresa') ||
    (pathname.startsWith('/funcionario') && !pathname.startsWith('/funcionarios'));

  // Rotas de empresa, index e login
  const isEmpresaOrIndexRoute =
    pathname === '/' ||
    pathname.startsWith('/funcionarios') ||
    pathname.startsWith('/sobre-nos') ||
    pathname.startsWith('/contate-nos') ||
    pathname.includes('/loginempresa') ||
    pathname.startsWith('/home-empresa') ||
    pathname.includes('/loginfuncionario');

  if (isAdminRoute) {
    return (
      <>
        <Header />
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