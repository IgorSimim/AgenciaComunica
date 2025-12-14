'use client'
import Link from "next/link"
import Cookies from "js-cookie"
import { FaUserAlt } from "react-icons/fa"
import { HiOutlineChartBar } from 'react-icons/hi'
import { FaStore, FaUserPlus, FaUsers, FaHandHolding } from "react-icons/fa"
import { FiLogOut } from 'react-icons/fi'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

function MenuLateral() {
  const [nomeContratado, setNomeContratado] = useState<string>("")
  const router = useRouter()

  useEffect(() => {

    const nome = Cookies.get("contr_logado_nome") as string
    setNomeContratado(nome)
  }, [])

  function limpaCookies() {
    Cookies.remove("contr_logado_id")
    Cookies.remove("contr_logado_nome")
    Cookies.remove("contr_logado_token")
    router.replace("/")
  }

  return (
    <aside
      id="default-sidebar"
      className={`fixed top-4 left-0 z-40 w-64 h-screen bg-gray-900 shadow-lg transition-transform -translate-x-full sm:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="h-full px-4 py-6 overflow-y-auto text-white mt-8">
        <Link href="/" className="flex items-center ps-2.5 mb-6 mt-12">
          <FaUserAlt className="h-8 w-8 text-yellow-400 mr-4" />
          <span className="text-2xl font-semibold">{nomeContratado}</span>
        </Link>

        <ul className="space-y-4 font-medium">
          <li>
            <Link
              href="/principal"
              className="flex items-center p-3 rounded-lg hover:bg-yellow-500 hover:text-black transition-all group"
            >
              <HiOutlineChartBar className="w-6 h-6 mr-3 text-yellow-400 group-hover:text-black" />
              <span className="text-lg">Estatísticas</span>
            </Link>
          </li>
          <li>
            <Link
              href="/principal/cadservico"
              className="flex items-center p-3 rounded-lg hover:bg-yellow-500 hover:text-black transition-all group"
            >
              <FaHandHolding className="w-6 h-6 mr-3 text-yellow-400 group-hover:text-black" />
              <span className="text-lg">Serviços</span>
            </Link>
          </li>
          <li>
            <Link
              href="/principal/cadempresa"
              className="flex items-center p-3 rounded-lg hover:bg-yellow-500 hover:text-black transition-all group"
            >
              <FaStore className="w-6 h-6 mr-3 text-yellow-400 group-hover:text-black" />
              <span className="text-lg">Empresas</span>
            </Link>
          </li>
          <li>
            <Link
              href="/principal/contratados"
              className="flex items-center p-3 rounded-lg hover:bg-yellow-500 hover:text-black transition-all group"
            >
              <FaUsers className="w-6 h-6 mr-3 text-yellow-400 group-hover:text-black" />
              <span className="text-lg">Funcionários</span>
            </Link>
          </li>
          <li>
            <Link
              href="/principal/cadcontratado"
              className="flex items-center p-3 rounded-lg hover:bg-yellow-500 hover:text-black transition-all group"
            >
              <FaUserPlus className="w-6 h-6 mr-3 text-yellow-400 group-hover:text-black" />
              <span className="text-lg">Cadastro do funcionário</span>
            </Link>
          </li>
        </ul>

        <ul className="pt-6 mt-6 space-y-2 font-medium border-t border-gray-700">
          <li>
            <span
              onClick={limpaCookies}
              className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-red-500 hover:text-black transition-all group"
            >
              <FiLogOut className="w-6 h-6 mr-3 text-yellow-400 group-hover:text-black" />
              <span className="text-lg">Logout</span>
            </span>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default MenuLateral
