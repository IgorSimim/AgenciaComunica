'use client';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RxExit } from "react-icons/rx";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";
import { alerts } from "@/lib/alerts";
import { useState } from "react";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const empresa = (session as any)?.empresa;
  const contratado = (session as any)?.contratado;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function logout() {
    alerts.confirm("Deseja realmente fazer logout?", async () => {
      await signOut({ redirect: false });
      alerts.success("Logout realizado com sucesso!");
      router.push(contratado ? "/logincontratado" : "/");
    });
  }

  // Layout administrativo para contratados
  if (session && contratado) {
    return (
      <nav className="bg-yellow-400 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
          <img
            src="/logo.png"
            className="h-20 w-auto"
            alt="Logo da Agência Comunica"
          />
            <span className="text-black text-2xl font-semibold">
              Setor Administrativo: Agência Comunica Mkt. Digital
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <span className="text-black text-xl font-medium">
              Bem-vindo(a), {contratado.nome}
            </span>
            <span
              onClick={logout}
              className="text-2xl text-black cursor-pointer hover:text-gray-700 transition-colors"
              title="Logout"
            >
              <RxExit />
            </span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-black p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Esquerda: Logo e Nome */}
        <div className="flex items-center space-x-4">
          {session && empresa ? (
            <>
              <Link href="/home-empresa" className="hover:opacity-80 transition-opacity">
                <img
                  src={empresa.logotipo || "/logo.png"}
                  alt="Logotipo da empresa"
                  className="h-20 w-20 rounded-full border-2 border-white object-cover"
                />
              </Link>
            </>
          ) : (
            <Link href="/">
              <img src="/logo.png" alt="Logo da Agência Comunica" className="h-20 w-auto" />
            </Link>
          )}
        </div>

        {/* Centro: Navegação */}
        <div className="flex-1 text-center">
          {(!session || (session && empresa)) && (
            <ul className="flex justify-center space-x-12 text-white text-2xl font-medium">
              <li>
                <Link
                  href="/"
                  className="hover:text-orange-400 hover:scale-105 transition-all duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/contratados"
                  className="hover:text-orange-400 hover:scale-105 transition-all duration-300"
                >
                  Contratados
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre-nos"
                  className="hover:text-orange-400 hover:scale-105 transition-all duration-300"
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link
                  href="/contate-nos"
                  className="hover:text-orange-400 hover:scale-105 transition-all duration-300"
                >
                  Contate-nos
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Direita: Login ou Logout */}
        <div className="flex items-center space-x-6">
          {session && empresa ? (
            <>
              <span className="text-white text-xl font-medium">
                Bem-vindo(a), {empresa.nome}
              </span>
              <span
                onClick={logout}
                className="text-2xl text-white cursor-pointer hover:text-gray-300 transition-colors"
                title="Logout"
              >
                <RxExit />
              </span>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-orange-600 text-white px-6 py-3 rounded-full text-xl font-medium hover:bg-orange-700 flex items-center space-x-2 transition-colors"
              >
                <span>Entrar</span>
                <FaChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black border border-orange-600 rounded-lg shadow-lg z-50">
                  <Link
                    href="/loginempresa"
                    className="block px-4 py-3 text-white hover:bg-orange-600 hover:text-black rounded-t-lg transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Área empresarial
                  </Link>
                  <Link
                    href="/logincontratado"
                    className="block px-4 py-3 text-white hover:bg-yellow-500 hover:text-black rounded-b-lg transition-colors border-t border-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Área administrativa
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;