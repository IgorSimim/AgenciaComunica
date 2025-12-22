import type { Metadata } from "next";
import "@/app/styles/globals.css";
import { Toaster } from "sonner";
import NextAuthSessionProvider from "@/app/providers/SessionProvider";
import LayoutContent from "@/app/components/shared/LayoutContent";

export const metadata: Metadata = {
  title: "Agência Comunica",
  description: "Agencia de marketing digital",
  keywords: ["Serviços", "Empresas", "Funcionários", "Marketing Digital"],
  icons: {
    icon: "/favicon.ico",
  },
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
