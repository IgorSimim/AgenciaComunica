'use client'
import { useEffect, useState } from "react"
import { HiOutlineXCircle, HiOutlinePencilAlt, HiOutlineEye } from "react-icons/hi"
import { useRouter } from "next/navigation"
import axios from 'axios'
import { alerts } from '@/lib/alerts'
import { TServico } from '@/app/types/index'

function CadServicos() {
  const [servicos, setServicos] = useState<TServico[]>([])
  const router = useRouter()

  useEffect(() => {
    async function getServicos() {
      try {
        const response = await fetch("/api/servico")
        const dados = await response.json()
        setServicos(Array.isArray(dados.servicos) ? dados.servicos : [])
      } catch (error) {
        console.error("Erro ao carregar serviços:", error)
        setServicos([])
      }
    }
    getServicos()
  }, [])

  async function excluirServico(servico: TServico) {
    await alerts.delete(
      servico.nome,
      `Confirmar a exclusão do serviço ${servico.nome}?`,
      async () => {
        const response = await fetch(`/api/servico/${servico.cod}`, {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
        })

        if (response.status == 200) {
          const servicos2 = servicos.filter(x => x.cod != servico.cod)
          setServicos(servicos2)
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message || "Erro ao excluir serviço")
        }
      }
    )
  }

  const listaServicos = Array.isArray(servicos) ? servicos.map((servico: TServico) => (
    <tr key={servico.cod} className="odd:bg-gray-100 dark:odd:bg-gray-900 even:bg-gray-50 dark:even:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <img src={servico.simboloUrl} alt="Símbolo do serviço" className="w-20 h-20 sm:w-16 sm:h-16 object-contain" />
      </th>
      <td className="px-6 py-4">{servico.nome}</td>
      <td className="px-6 py-4">{servico.descricao}</td>
      <td className="px-6 py-4">R$ {servico.preco?.toFixed(2).replace('.', ',')}</td>
      <td className="px-6 py-4 flex">
        <HiOutlineEye className="text-3xl text-blue-700 cursor-pointer hover:text-blue-700 transition-colors" title="Consultar" onClick={() => router.push(`/servico/consultar/${servico.cod}`)} />
        <HiOutlinePencilAlt className="text-3xl text-yellow-500 cursor-pointer hover:text-yellow-700 transition-colors" title="Alterar" onClick={() => router.push(`/servico/editar/${servico.cod}`)} />
        <HiOutlineXCircle className="text-3xl text-red-600 cursor-pointer hover:text-red-800 transition-colors" title="Excluir" onClick={() => excluirServico(servico)} />
      </td>
    </tr>
  )) : []

  async function gerarpdf() {
    try {
      const response = await axios.get('/api/servico/pdf', {
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
        <button
          type="button"
          className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 cursor-pointer focus:ring-green-300 font-bold rounded-lg text-md px-5 py-2.5 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none dark:focus:ring-green-900"
          onClick={() => router.push('/servico/criar')}
        >
          Novo cadastro
        </button>

        <button
          type="button"
          className="text-white bg-blue-600 hover:bg-blue-700 cursor-pointer focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-md px-5 py-2.5 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none dark:focus:ring-blue-900"
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
                Símbolo
              </th>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Descrição
              </th>
              <th scope="col" className="px-6 py-3">
                Preço
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {listaServicos}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CadServicos
