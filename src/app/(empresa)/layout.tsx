import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import NextAuthSessionProvider from "@/app/providers/SessionProvider";

export default function EmpresaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider>
      <Header />
      <div className="bg-black text-white dark:bg-black dark:text-white">
        {children}
      </div>
      <Footer />
    </NextAuthSessionProvider>
  );
}