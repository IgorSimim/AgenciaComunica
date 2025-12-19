'use client'
import 'react-responsive-modal/styles.css'
import { useEffect, useState } from "react"
import { HiOutlineXCircle, HiOutlineEye, HiOutlinePencilAlt } from "react-icons/hi"
import { alerts } from "@/lib/alerts"
import { useRouter } from "next/navigation"
import axios from 'axios'
import { TContratado } from "@/app/types/index"
import Link from "next/link"

function Contratados() {
  const [contratados, setContratados] = useState<TContratado[]>([])

  useEffect(() => {
    async function getContratados() {
      const response = await fetch("/api/contratado")
      const dados = await response.json()
      setContratados(dados)
    }
    getContratados()
  }, [])


  const router = useRouter()

  async function excluirContratado(contratado: TContratado) {
    await alerts.delete(
      contratado.nome,
      `Confirmar a exclusão do ${contratado.nome}?`,
      async () => {
        const response = await fetch(`/api/contratado/${contratado.id}`, {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
        })

        if (response.status == 200) {
          const contratados2 = contratados.filter(x => x.id != contratado.id)
          setContratados(contratados2)
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message || "Erro ao excluir contratado")
        }
      }
    )
  }

  const listaContratados = contratados.map((contratado: TContratado) => (
    <tr key={contratado.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <img src={contratado.foto} alt="Foto do funcionário" className="w-25 h-24 object-cover rounded-lg" />
      </th>
      <td className="px-6 py-4">{contratado.nome}</td>
      <td className="px-6 py-4">{contratado.cargo}</td>
      <td className="px-6 py-4">{contratado.email}</td>
      <td className="px-6 py-4">
        <HiOutlineEye className="text-3xl text-blue-700 inline-block cursor-pointer hover:text-blue-700 transition-colors" title="Consulta" onClick={() => router.push(`contratado/consultar/${contratado.id}`)} />
        <HiOutlinePencilAlt className="text-3xl text-yellow-500 inline-block cursor-pointer hover:text-yellow-700 transition-colors" title="Alteração" onClick={() => router.push(`contratado/editar/${contratado.id}`)} />
        <HiOutlineXCircle className="text-3xl text-red-600 inline-block cursor-pointer hover:text-red-800 transition-colors" title="Excluir" onClick={() => excluirContratado(contratado)} />
      </td>
    </tr>
  ))

  async function gerarpdf() {
    try {
      const response = await axios.get('/api/contratado/pdf', {
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
        <Link href="/contratado/criar">
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
            {listaContratados}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Contratados
