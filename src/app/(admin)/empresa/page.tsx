'use client'
import { useEffect, useState } from "react"
import { HiOutlineXCircle, HiOutlinePencilAlt, HiOutlineEye } from "react-icons/hi"
import { alerts } from "@/lib/alerts"
import { useRouter } from "next/navigation"
import axios from 'axios'
import { TEmpresa } from '@/app/types'
import Link from "next/link"

function Empresas() {
  const [empresas, setEmpresas] = useState<TEmpresa[]>([])
  const router = useRouter()

  useEffect(() => {
    async function getEmpresas() {
      const response = await fetch("/api/empresa")
      const dados = await response.json()
      setEmpresas(dados)
    }
    getEmpresas()
  }, [])

  async function excluirEmpresa(empresa: TEmpresa) {
    await alerts.delete(
      empresa.nome,
      `Confirmar a exclusão da empresa ${empresa.nome}?`,
      async () => {
        const response = await fetch(`/api/empresa/${empresa.cod}`, {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
        })

        if (response.status == 200) {
          const empresas2 = empresas.filter((x) => x.cod != empresa.cod)
          setEmpresas(empresas2)
        } else {
          throw new Error("Pode haver comentários para esta empresa")
        }
      }
    )
  }

  const listaEmpresas = empresas.map((empresa: TEmpresa) => (
    <tr key={empresa.cod} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <img src={empresa.logotipo} alt="Logotipo da empresa" className="w-20 h-20 object-contain rounded-lg" />
      </th>
      <td className="px-6 py-4">{empresa.nome}</td>
      <td className="px-6 py-4">{empresa.setor}</td>
      <td className="px-6 py-4">{empresa.email}</td>
      <td className="px-6 py-4">
        <HiOutlineEye className="text-3xl text-blue-700 inline-block cursor-pointer hover:text-blue-700 transition-colors" title="Consulta" onClick={() => router.push(`empresa/consultar/${empresa.cod}`)} />
        <HiOutlinePencilAlt className="text-3xl text-yellow-500 inline-block cursor-pointer hover:text-yellow-700 transition-colors" title="Alteração" onClick={() => router.push(`empresa/editar/${empresa.cod}`)} />
        <HiOutlineXCircle className="text-3xl text-red-600 inline-block cursor-pointer hover:text-red-800 transition-colors" title="Excluir" onClick={() => excluirEmpresa(empresa)} />
      </td>
    </tr>
  ))

  async function gerarpdf() {
    try {
      const response = await axios.get('/api/empresa/pdf', {
        responseType: 'blob',
      })

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const pdfUrl = URL.createObjectURL(blob)
      const newWindow = window.open(pdfUrl, '_blank')

      newWindow?.addEventListener('load', () => {
        URL.revokeObjectURL(pdfUrl)
      })
    } catch (error) {
      console.error('Erro ao gerar o PDF:', error)
    }
  }

  return (
    <div className="m-4">
      <div className="flex justify-end gap-4 mb-4">
        <Link href="/empresa/criar">
          <button type="button" className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-bold rounded-lg text-md px-5 py-2.5 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none dark:focus:ring-green-900">
            Novo cadastro
          </button>
        </Link>

        <button type="button" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-md px-5 py-2.5 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none dark:focus:ring-blue-900" onClick={gerarpdf}>
          Gerar PDF
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-300">
          <thead className="text-xs text-gray-800 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">Logotipo</th>
              <th scope="col" className="px-6 py-3">Nome</th>
              <th scope="col" className="px-6 py-3">Setor</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {listaEmpresas}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Empresas