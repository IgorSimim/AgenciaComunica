import type { Metadata } from "next";
import "@/app/styles/globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import EmpresaProvider from "@/app/context/EmpresaContext";

export const metadata: Metadata = {
  title: "Agência Comunica",
  description: "Agência Comunica Marketing Digital",
  keywords: ["Agência", "Empresas", "Marketing Digital"],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
      </head>
      <body className="bg-black text-white dark:bg-black dark:text-white">
        <EmpresaProvider>
          <Header />
          {children}
          <Footer />
        </EmpresaProvider>
        {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script> */}
      </body>
    </html>
  );
}
