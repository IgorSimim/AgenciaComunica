'use client'
import 'react-responsive-modal/styles.css'
import { useEffect, useState } from "react"
import { HiOutlineXCircle, HiOutlineEye, HiOutlinePencilAlt } from "react-icons/hi"
import { alerts } from "@/lib/alerts"
import { useRouter } from "next/navigation"
import axios from 'axios'
import { TFuncionario } from "@/app/types/index"
import Link from "next/link"

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<TFuncionario[]>([])

  useEffect(() => {
    async function getFuncionarios() {
      const response = await fetch("/api/funcionario")
      const dados = await response.json()
      setFuncionarios(dados)
    }
    getFuncionarios()
  }, [])


  const router = useRouter()

  async function excluirFuncionario(funcionario: TFuncionario) {
    await alerts.delete(
      funcionario.nome,
      `Confirmar a exclusão do ${funcionario.nome}?`,
      async () => {
        const response = await fetch(`/api/funcionario/${funcionario.id}`, {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
        })

        if (response.status == 200) {
          const funcionarios2 = funcionarios.filter(x => x.id != funcionario.id)
          setFuncionarios(funcionarios2)
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message || "Erro ao excluir o funcionário")
        }
      }
    )
  }

  const listaFuncionarios = funcionarios.map((funcionario: TFuncionario) => (
    <tr key={funcionario.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <img src={funcionario.fotoUrl} alt="Foto do funcionário" className="w-25 h-24 object-cover rounded-lg" />
      </th>
      <td className="px-6 py-4">{funcionario.nome}</td>
      <td className="px-6 py-4">{funcionario.cargo}</td>
      <td className="px-6 py-4">{funcionario.email}</td>
      <td className="px-6 py-4">
        <HiOutlineEye className="text-3xl text-blue-700 inline-block cursor-pointer hover:text-blue-700 transition-colors" title="Consultar" onClick={() => router.push(`funcionario/consultar/${funcionario.id}`)} />
        <HiOutlinePencilAlt className="text-3xl text-yellow-500 inline-block cursor-pointer hover:text-yellow-700 transition-colors" title="Alterar" onClick={() => router.push(`funcionario/editar/${funcionario.id}`)} />
        <HiOutlineXCircle className="text-3xl text-red-600 inline-block cursor-pointer hover:text-red-800 transition-colors" title="Excluir" onClick={() => excluirFuncionario(funcionario)} />
      </td>
    </tr>
  ))

  async function gerarpdf() {
    try {
      const response = await axios.get('/api/funcionario/pdf', {
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
        <Link href="/funcionario/criar">
          <button type="button" className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-bold rounded-lg text-md px-5 py-2.5 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none dark:focus:ring-green-900">
            Novo cadastro
          </button>
        </Link>

        <button
          type="button"
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-md px-5 py-2.5 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none dark:focus:ring-blue-900"
          onClick={gerarpdf}
        >
          Gerar PDF
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-300">
          <thead className="text-xs text-gray-800 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">
                Foto
              </th>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Cargo
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {listaFuncionarios}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Funcionarios
