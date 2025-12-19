'use client'
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import NextAuthSessionProvider from "@/app/providers/SessionProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const EmpresaContent = dynamic(() => Promise.resolve(function EmpresaContentComponent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const empresa = (session as any)?.empresa;
  
  useEffect(() => {
    if (status !== "loading" && (!session || !empresa)) {
      router.push("/loginempresa");
    }
  }, [session, empresa, status, router]);
  
  if (status === "loading") {
    return <div>Carregando...</div>;
  }
  
  if (!session || !empresa) {
    return null;
  }
  
  return (
    <>
      <Header />
      <div className="bg-black text-white">
        {children}
      </div>
      <Footer />
    </>
  );
}), { ssr: false });

export default function EmpresaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider>
      <EmpresaContent>{children}</EmpresaContent>
    </NextAuthSessionProvider>
  );
}