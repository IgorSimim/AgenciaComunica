'use client'
import Link from "next/link"
import { FaUserAlt } from "react-icons/fa"
import { HiOutlineChartBar } from 'react-icons/hi'
import { FaStore, FaUsers, FaHandHolding } from "react-icons/fa"
import { FiLogOut } from 'react-icons/fi'
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { alerts } from "@/lib/alerts"

function MenuLateral() {
  const { data: session } = useSession()
  const router = useRouter()
  const funcionario = (session as any)?.funcionario

  async function logout() {
    alerts.confirm("Deseja realmente fazer logout?", async () => {
      await signOut({ redirect: false })
      alerts.success("Logout realizado com sucesso!")
      router.push("/loginfuncionario")
    })
  }

  return (
    <aside
      id="default-sidebar"
      className={`fixed top-4 left-0 z-40 w-64 h-screen bg-gray-900 shadow-lg transition-transform -translate-x-full sm:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="h-full px-4 py-6 overflow-y-auto text-white mt-12">
        <div className="flex items-center p-4 mb-6 mt-6">
          <FaUserAlt className="h-8 w-8 text-yellow-400 mr-4 flex-shrink-0" />
          <span className="text-xl font-semibold leading-tight break-words">{funcionario?.nome || "Admin"}</span>
        </div>

        <ul className="space-y-4">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center p-3 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors group"
            >
              <HiOutlineChartBar className="w-6 h-6 mr-3 text-yellow-400 group-hover:text-black" />
              <span className="text-xl font-medium">Estatísticas</span>
            </Link>
          </li>
          <li>
            <Link
              href="/servico"
              className="flex items-center p-3 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors group"
            >
              <FaHandHolding className="w-6 h-6 mr-3 text-yellow-400 group-hover:text-black" />
              <span className="text-xl font-medium">Serviços</span>
            </Link>
          </li>
          <li>
            <Link
              href="/empresa"
              className="flex items-center p-3 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors group"
            >
              <FaStore className="w-6 h-6 mr-3 text-yellow-400 group-hover:text-black" />
              <span className="text-xl font-medium">Empresas</span>
            </Link>
          </li>
          <li>
            <Link
              href="/funcionario"
              className="flex items-center p-3 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors group"
            >
              <FaUsers className="w-6 h-6 mr-3 text-yellow-400 group-hover:text-black" />
              <span className="text-xl font-medium">Funcionários</span>
            </Link>
          </li>
        </ul>

        <ul className="pt-6 mt-6 space-y-2 border-t border-gray-700">
          <li>
            <Link
              href="/"
              className="flex items-center p-3 rounded-lg hover:bg-blue-500 hover:text-black transition-colors group"
            >
              <FaStore className="w-6 h-6 mr-3 text-yellow-400 group-hover:text-black" />
              <span className="text-xl font-medium">Home</span>
            </Link>
          </li>
          <li>
            <span
              onClick={logout}
              className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-red-500 hover:text-black transition-colors group"
            >
              <FiLogOut className="w-6 h-6 mr-3 text-yellow-400 group-hover:text-black" />
              <span className="text-xl font-medium">Logout</span>
            </span>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default MenuLateral
