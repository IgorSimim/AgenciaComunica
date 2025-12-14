import type { Metadata } from "next";
import "@/app/styles/globals.css";

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
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
      </head>
      <body className="bg-black text-white dark:bg-black dark:text-white">
        {children}
      </body>
    </html>
  );
}
