'use client'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'
import { useEffect, useState } from "react"
import NovaEmpresa from '@/app/components/Empresas/NovaEmpresa'
import ItemEmpresa from '@/app/components/Empresas/ItemEmpresa'
import axios from 'axios'

export interface empresaProps {
  cod: number
  cnpj: string
  nome: string
  email: string
  senha: string
  atuacao: string
  logotipo: string
  contr_id: number
}

function CadEmpresas() {
  const [empresas, setEmpresas] = useState<empresaProps[]>([])
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    async function getEmpresas() {
      const response = await fetch("http://localhost:3004/empresas")
      const dados = await response.json()
      setEmpresas(dados)
    }
    getEmpresas()
  }, [])

  const listaEmpresas = empresas.map((empresa: empresaProps) => (
    <ItemEmpresa key={empresa.cod} empresa={empresa} empresas={empresas} setEmpresas={setEmpresas} />
  ))

  async function gerarpdf() {
    try {
      const response = await axios.get('http://localhost:3004/empresas/pdf', {
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
        <NovaEmpresa empresas={empresas} setEmpresas={setEmpresas} />
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
                Logotipo
              </th>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Atuação
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
            {listaEmpresas}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CadEmpresas