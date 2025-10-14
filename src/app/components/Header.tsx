'use client';
import { useContext } from "react";
import { useRouter } from "next/navigation"; // Importa o hook useRouter
import { RxExit } from "react-icons/rx";
import { EmpresaContext } from "@/app/context/EmpresaContext";
import Swal from "sweetalert2";
import Link from "next/link";

function Header() {
  const { codEmpresaLogado, nomeEmpresaLogado, logotipoEmpresaLogado, mudaLogin } = useContext(EmpresaContext);
  const router = useRouter(); // Instancia o roteador

  function logout() {
    Swal.fire({
      title: "Confirmar saída do site da agência?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        mudaLogin({ cod: null, nome: "", logotipo: "" });
        router.push("/");
      }
    });
  }

  return (
    <nav className="bg-black p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Esquerda: Logo e Nome */}
        <div className="flex items-center space-x-4">
          {codEmpresaLogado ? (
            <>
              <img
                src={logotipoEmpresaLogado}
                alt="Logo ou Foto de Perfil da Empresa"
                className="w-20 h-20 rounded-full border-4 border-white me-3"
              />
              <span className="text-white text-2xl font-semibold">
                {nomeEmpresaLogado}
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
          {!codEmpresaLogado && (
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
          {codEmpresaLogado ? (
            <>
              <span className="text-white text-xl font-normal">
                Bem-vindo(a), {nomeEmpresaLogado}
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
