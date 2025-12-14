import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin" className="bg-blue-600 hover:bg-blue-700 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold">Administradores</h2>
          <p className="mt-2">Gerenciar administradores</p>
        </Link>
        
        <Link href="/cadempresa" className="bg-green-600 hover:bg-green-700 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold">Empresas</h2>
          <p className="mt-2">Gerenciar empresas</p>
        </Link>
        
        <Link href="/cadservico" className="bg-purple-600 hover:bg-purple-700 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold">Serviços</h2>
          <p className="mt-2">Gerenciar serviços</p>
        </Link>
      </div>
    </div>
  );
}