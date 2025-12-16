'use client'
import Titulo from "@/app/components/Titulo";
import MenuLateral from "@/app/components/MenuLateral";
import NextAuthSessionProvider from "@/app/providers/SessionProvider";
import { useSession } from "next-auth/react";

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

function AdminContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const contratado = (session as any)?.contratado;
  const showMenu = session && contratado;

  return (
    <>
      {showMenu && <MenuLateral />}
      <Titulo />
      <div className={showMenu ? "p-4 sm:ml-64" : ""}>
        {children}
      </div>
    </>
  );
}