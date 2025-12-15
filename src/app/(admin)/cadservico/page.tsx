'use client'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'
import { useEffect, useState } from "react"
import NovoServico from '@/app/components/Servicos/NovoServico'
import ItemServico from '@/app/components/Servicos/ItemServico'
import axios from 'axios'

export interface servicoProps {
  cod: number
  nome: string
  descricao: string
  foto: string
}

function CadServicos() {
  const [servicos, setServicos] = useState<servicoProps[]>([])
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    async function getServicos() {
      const response = await fetch("http://localhost:3004/servicos")
      const dados = await response.json()
      setServicos(dados)
    }
    getServicos()
  }, [])

  const listaServicos = servicos.map((servico: servicoProps) => (
    <ItemServico key={servico.cod} servico={servico} servicos={servicos} setServicos={setServicos} />
  ))

  async function gerarpdf() {
    try {
      const response = await axios.get('http://localhost:3004/servicos/pdf', {
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

  const onOpenModal = () => setOpen(true)
  const onCloseModal = () => setOpen(false)

  return (
    <div className="m-4">
      <Modal open={open} onClose={onCloseModal} center>
        <NovoServico servicos={servicos} setServicos={setServicos} />
      </Modal>

      <div className="flex justify-end gap-4 mb-4">
        <button
          type="button"
          className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-bold rounded-lg text-md px-5 py-2.5 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none dark:focus:ring-green-900"
          onClick={onOpenModal}
        >
          Novo Cadastro
        </button>

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
                Descrição
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
