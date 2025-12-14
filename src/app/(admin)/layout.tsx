import { Toaster } from "sonner";
import Titulo from "@/app/components/Titulo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Titulo />
      {children}
    </>
  );
}