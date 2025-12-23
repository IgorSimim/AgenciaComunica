'use client'
import { useEffect, useState } from "react"
import { HiOutlinePencilAlt, HiOutlineEye, HiOutlineCheckCircle, HiOutlineBan } from "react-icons/hi"
import { alerts } from "@/lib/alerts"
import { useRouter } from "next/navigation"
import axios from 'axios'
import { TEmpresa } from '@/app/types/index'
import Link from "next/link"

function Empresas() {
  const [empresas, setEmpresas] = useState<TEmpresa[]>([])
  const [filtro, setFiltro] = useState<'todas' | 'ativas' | 'inativas'>('ativas')
  const router = useRouter()

  useEffect(() => {
    async function getEmpresas() {
      const response = await fetch("/api/empresa")
      const dados = await response.json()
      setEmpresas(dados)
    }
    getEmpresas()
  }, [])

  async function toggleStatusEmpresa(empresa: TEmpresa) {
    const novoStatus = !empresa.ativa
    const response = await fetch(`/api/empresa/${empresa.cod}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ ...empresa, ativa: novoStatus })
    })

    if (response.status == 200) {
      const empresasAtualizadas = empresas.map(emp => 
        emp.cod === empresa.cod ? { ...emp, ativa: novoStatus } : emp
      )
      setEmpresas(empresasAtualizadas)
      alerts.success(`Empresa ${novoStatus ? 'ativada' : 'desativada'} com sucesso!`)
    } else {
      const errorData = await response.json()
      alerts.error(errorData.message || "Erro ao alterar status da empresa")
    }
  }

  const empresasFiltradas = empresas.filter(empresa => {
    if (filtro === 'ativas') return empresa.ativa !== false
    if (filtro === 'inativas') return empresa.ativa === false
    return true
  })

  const listaEmpresas = empresasFiltradas.map((empresa: TEmpresa) => (
    <tr key={empresa.cod} className="odd:bg-white dark:odd:bg-gray-900 even:bg-gray-50 dark:even:bg-gray-800 border-b dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <img src={empresa.logotipoUrl} alt="Logotipo da empresa" className="w-20 h-20 object-contain rounded-lg" />
      </th>
      <td className="px-6 py-4">
        {empresa.nome}
        {filtro === 'todas' && (
          empresa.ativa === false ? (
            <span className="ml-3 text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-medium border border-red-200">Inativa</span>
          ) : (
            <span className="ml-3 text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium border border-emerald-200">Ativa</span>
          )
        )}
      </td>
      <td className="px-6 py-4">{empresa.setor}</td>
      <td className="px-6 py-4">{empresa.email}</td>
      <td className="px-6 py-4">
        <HiOutlineEye className="text-3xl text-blue-700 inline-block cursor-pointer hover:text-blue-700 transition-colors" title="Consultar" onClick={() => router.push(`empresa/consultar/${empresa.cod}`)} />
        <HiOutlinePencilAlt className="text-3xl text-yellow-500 inline-block cursor-pointer hover:text-yellow-700 transition-colors" title="Alterar" onClick={() => router.push(`empresa/editar/${empresa.cod}`)} />
        {empresa.ativa !== false ? (
          <HiOutlineBan className="text-3xl text-red-600 inline-block cursor-pointer hover:text-red-800 transition-colors" title="Desativar" onClick={() => toggleStatusEmpresa(empresa)} />
        ) : (
          <HiOutlineCheckCircle className="text-3xl text-green-600 inline-block cursor-pointer hover:text-green-800 transition-colors" title="Ativar" onClick={() => toggleStatusEmpresa(empresa)} />
        )}
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setFiltro('ativas')}
            className={`px-4 py-2 rounded-md font-medium transition-all cursor-pointer ${filtro === 'ativas' ? 'bg-emerald-500 text-white shadow-xs' : 'text-gray-600 hover:bg-white hover:shadow-xs'}`}
          >
            Ativas
          </button>
          <button
            onClick={() => setFiltro('inativas')}
            className={`px-4 py-2 rounded-md font-medium transition-all cursor-pointer ${filtro === 'inativas' ? 'bg-red-500 text-white shadow-xs' : 'text-gray-600 hover:bg-white hover:shadow-xs'}`}
          >
            Inativas
          </button>
          <button
            onClick={() => setFiltro('todas')}
            className={`px-4 py-2 rounded-md font-medium transition-all cursor-pointer ${filtro === 'todas' ? 'bg-slate-600 text-white shadow-xs' : 'text-gray-600 hover:bg-white hover:shadow-xs'}`}
          >
            Todas
          </button>
        </div>
        <div className="flex gap-4">
        <Link href="/empresa/criar">
          <button type="button" className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 cursor-pointer focus:ring-green-300 font-bold rounded-lg text-md px-5 py-2.5 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none dark:focus:ring-green-900">
            Novo cadastro
          </button>
        </Link>

        <button type="button" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 cursor-pointer focus:ring-blue-300 font-bold rounded-lg text-md px-5 py-2.5 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none dark:focus:ring-blue-900" onClick={gerarpdf}>
          Gerar PDF
        </button>
        </div>
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