import Titulo from "@/app/components/Titulo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Titulo />
      {children}
    </>
  );
}