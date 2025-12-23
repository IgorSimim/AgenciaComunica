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
  const funcionario = (session as any)?.funcionario;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function logout() {
    alerts.confirm("Deseja realmente fazer logout?", async () => {
      await signOut({ redirect: false });
      alerts.success("Logout realizado com sucesso!");
      router.push(funcionario ? "/loginfuncionario" : "/");
    });
  }

  // Layout administrativo para funcionários
  if (session && funcionario) {
    return (
      <nav className="bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              className="h-16 w-auto drop-shadow-md"
              alt="Logo da Agência Comunica"
            />
            <div className="hidden md:block">
              <span className="text-black text-lg font-bold">Setor Administrativo</span>
              <p className="text-black/80 text-sm">Agência Comunica</p>
            </div>
          </div>

          {/* Centro: Navegação */}
          <div className="flex-1 text-center">
            <ul className="flex justify-center space-x-8 text-black text-lg font-semibold">
              <li>
                <Link
                  href="/"
                  className="hover:text-gray-800 hover:scale-105 transition-all duration-300 px-3 py-2 rounded-md hover:bg-white/20"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/funcionarios"
                  className="hover:text-gray-800 hover:scale-105 transition-all duration-300 px-3 py-2 rounded-md hover:bg-white/20"
                >
                  Funcionários
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre-nos"
                  className="hover:text-gray-800 hover:scale-105 transition-all duration-300 px-3 py-2 rounded-md hover:bg-white/20"
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link
                  href="/contate-nos"
                  className="hover:text-gray-800 hover:scale-105 transition-all duration-300 px-3 py-2 rounded-md hover:bg-white/20"
                >
                  Contate-nos
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="bg-black text-yellow-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 hover:shadow-lg transition-all duration-300 border border-black/20"
              title="Voltar para Dashboard"
            >
              Dashboard
            </Link>
            <span
              onClick={logout}
              className="text-2xl text-black cursor-pointer hover:text-red-600 hover:scale-110 transition-all duration-300 p-2 rounded-full hover:bg-black/10"
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
    <nav className="bg-black shadow-lg p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Esquerda: Logo e Nome */}
        <div className="flex items-center space-x-4">
          {session && empresa ? (
            <>
              <Link href="/home-empresa" className="hover:opacity-80 transition-opacity">
                <img
                  src={empresa.logotipo || "/logo.png"}
                  alt="Logotipo da empresa"
                  className="h-16 w-16 rounded-full border-2 border-white object-cover drop-shadow-md"
                />
              </Link>
              <div className="hidden md:block">
                <span className="text-white text-lg font-bold">{empresa.nome}</span>
                <p className="text-white/80 text-sm">Área Empresarial</p>
              </div>
            </>
          ) : (
            <Link href="/">
              <img src="/logo.png" alt="Logo da Agência Comunica" className="h-16 w-auto drop-shadow-md" />
            </Link>
          )}
        </div>

        {/* Centro: Navegação */}
        <div className="flex-1 text-center">
          {(!session || (session && empresa)) && (
            <ul className="flex justify-center space-x-8 text-white text-lg font-semibold">
              <li>
                <Link
                  href="/"
                  className="hover:text-orange-400 hover:scale-105 transition-all duration-300 px-3 py-2 rounded-md hover:bg-white/10"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/funcionarios"
                  className="hover:text-orange-400 hover:scale-105 transition-all duration-300 px-3 py-2 rounded-md hover:bg-white/10"
                >
                  Funcionários
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre-nos"
                  className="hover:text-orange-400 hover:scale-105 transition-all duration-300 px-3 py-2 rounded-md hover:bg-white/10"
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link
                  href="/contate-nos"
                  className="hover:text-orange-400 hover:scale-105 transition-all duration-300 px-3 py-2 rounded-md hover:bg-white/10"
                >
                  Contate-nos
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Direita: Login ou Logout */}
        <div className="flex items-center space-x-4">
          {session && empresa ? (
            <>
              <div className="text-right">
                <p className="text-white text-md font-medium">Bem-vindo(a), <span className="text-white text-md font-bold">{empresa.nome}</span></p>
              </div>
              <span
                onClick={logout}
                className="text-2xl text-white cursor-pointer hover:text-red-400 hover:scale-110 transition-all duration-300 p-2 rounded-full hover:bg-white/10"
                title="Logout"
              >
                <RxExit />
              </span>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-orange-600 text-white px-6 py-3 rounded-full text-lg font-bold cursor-pointer hover:bg-orange-700 hover:shadow-lg flex items-center space-x-2 transition-all duration-300"
              >
                <span>Entrar</span>
                <FaChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black border border-orange-600 rounded-lg shadow-lg z-50">
                  <Link
                    href="/loginempresa"
                    className="block px-4 py-3 text-white hover:bg-orange-600 hover:text-black rounded-t-lg transition-colors font-medium"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Área empresarial
                  </Link>
                  <Link
                    href="/loginfuncionario"
                    className="block px-4 py-3 text-white hover:bg-yellow-500 hover:text-black rounded-b-lg transition-colors border-t border-gray-700 font-medium"
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