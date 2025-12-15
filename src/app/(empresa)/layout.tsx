import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import NextAuthSessionProvider from "@/app/providers/SessionProvider";
import EmpresaProvider from "@/app/context/EmpresaContext";

export default function EmpresaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider>
      <EmpresaProvider>
        <Header />
        {children}
        <Footer />
      </EmpresaProvider>
    </NextAuthSessionProvider>
  );
}