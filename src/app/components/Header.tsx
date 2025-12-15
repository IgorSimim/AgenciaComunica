'use client';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RxExit } from "react-icons/rx";
import Link from "next/link";
import { alerts } from "@/lib/alerts";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const empresa = (session as any)?.empresa;

  async function logout() {
    alerts.confirm("Deseja realmente fazer logout?", async () => {
      await signOut({ redirect: false });
      alerts.success("Logout realizado com sucesso!");
      router.push("/");
    });
  }

  return (
    <nav className="bg-black p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Esquerda: Logo e Nome */}
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <img
                src={empresa?.logotipo || "/logo.png"}
                alt="Logo ou Foto de Perfil da Empresa"
                className="w-20 h-20 rounded-full border-4 border-white me-3"
              />
              <span className="text-white text-2xl font-semibold">
                {empresa?.nome || "Empresa"}
              </span>
            </>
          ) : (
            <Link href="/">
              <img src="/logo.png" alt="Logo da Agência Comunica" className="w-44 h-auto" />
            </Link>
          )}
        </div>

        {/* Centro: Navegação ou Boas-vindas */}
        <div className="flex-1 text-center">
          {!session && (
            <ul className="flex justify-center space-x-16 text-white text-3xl font-normal me-[13rem]">
              <li>
                <Link
                  href="/"
                  className="hover:text-orange-600 hover:scale-105 transition-all duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/contratados"
                  className="hover:text-orange-600 hover:scale-105 transition-all duration-300"
                >
                  Contratados
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre-nos"
                  className="hover:text-orange-600 hover:scale-105 transition-all duration-300"
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link
                  href="/contate-nos"
                  className="hover:text-orange-600 hover:scale-105 transition-all duration-300"
                >
                  Contate-nos
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Direita: Login ou Logout */}
        <div className="flex items-center space-x-10">
          {session ? (
            <>
              <span className="text-white text-xl font-normal">
                Bem-vindo(a), {empresa?.nome || "Empresa"}
              </span>
              <span
                onClick={logout}
                className="text-3xl text-white cursor-pointer hover:text-gray-300"
                title="Logout"
              >
                <RxExit />
              </span>
            </>
          ) : (
            <Link
              href="/loginempresa"
              className="bg-orange-600 text-white px-20 py-4 rounded-full text-3xl font-normal hover:bg-orange-700 min-w-[200px] text-center"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
