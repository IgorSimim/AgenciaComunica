'use client'
import Titulo from "@/app/components/Titulo";
import MenuLateral from "@/app/components/MenuLateral";
import NextAuthSessionProvider from "@/app/providers/SessionProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const AdminContent = dynamic(() => Promise.resolve(function AdminContentComponent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const contratado = (session as any)?.contratado;
  
  useEffect(() => {
    if (status !== "loading" && (!session || !contratado)) {
      router.push("/logincontratado");
    }
  }, [session, contratado, status, router]);
  
  if (status === "loading") {
    return <div>Carregando...</div>;
  }
  
  if (!session || !contratado) {
    return null;
  }

  return (
    <>
      <MenuLateral />
      <Titulo />
      <div className="p-4 sm:ml-64">
        {children}
      </div>
    </>
  );
}), { ssr: false });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider>
      <AdminContent>{children}</AdminContent>
    </NextAuthSessionProvider>
  );
}