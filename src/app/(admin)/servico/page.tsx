'use client'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { HiOutlineXCircle, HiOutlinePencilAlt, HiOutlineEye } from "react-icons/hi"
import Swal from 'sweetalert2'
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from 'axios'
import { TServico } from '@/app/types'

type ServicoInputs = {
  nome: string
  descricao: string
  simbolo: string
}

function CadServicos() {
  const [servicos, setServicos] = useState<TServico[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()
  const { register, handleSubmit, reset, setFocus } = useForm<ServicoInputs>()

  useEffect(() => {
    async function getServicos() {
      const response = await fetch("/api/servico")
      const dados = await response.json()
      setServicos(dados.servicos)
    }
    getServicos()
  }, [])

  async function excluirServico(servico: TServico) {
    const result = await Swal.fire({
      title: servico.nome,
      text: `Confirmar a exclusão do serviço ${servico.nome}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar"
    })

    if (result.isConfirmed) {
      const response = await fetch(`/api/servico/${servico.cod}`, {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
      })

      if (response.status == 200) {
        const servicos2 = servicos.filter(x => x.cod != servico.cod)
        setServicos(servicos2)
        Swal.fire({
          title: "Serviço excluído com sucesso",
          text: servico.nome,
          icon: "success"
        })
      } else {
        Swal.fire({
          title: "Erro... Serviço não excluído",
          text: "Pode haver comentários para este serviço",
          icon: "error"
        })
      }
    }
  }

  async function incluirServico(data: ServicoInputs) {
    const novoServico: TServico = {
      cod: 0,
      nome: data.nome,
      descricao: data.descricao,
      simbolo: data.simbolo
    }

    try {
      const response = await fetch("/api/servico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoServico),
      })

      const responseData = await response.json()

      if (response.ok) {
        toast.success("Serviço cadastrado com sucesso!")
        reset()
        setServicos([responseData, ...servicos])
        setOpen(false)
      } else {
        switch (responseData.id) {
          case 1:
            toast.error("Preencha todos os campos obrigatórios.")
            break
          case 4:
            toast.error("Já existe um serviço com este nome.")
            break
          default:
            toast.error(responseData.msg || "Erro ao cadastrar o serviço.")
        }
      }
    } catch (error) {
      console.error("Erro ao cadastrar o serviço:", error)
      toast.error("Erro inesperado. Tente novamente mais tarde.")
    }
  }

  useEffect(() => {
    if (open) {
      setFocus("nome")
    }
  }, [open, setFocus])

  const listaServicos = servicos.map((servico: TServico) => (
    <tr key={servico.cod} className="odd:bg-gray-100 odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <img src={servico.simbolo} alt="Símbolo do serviço" className="w-20 h-20 sm:w-16 sm:h-16 object-contain" />
      </th>
      <td className="px-6 py-4">{servico.nome}</td>
      <td className="px-6 py-4">{servico.descricao}</td>
      <td className="px-6 py-4 flex">
        <HiOutlineEye className="text-3xl text-blue-700 cursor-pointer hover:text-blue-700 transition-colors" title="Consulta" onClick={() => router.push(`consultaservico/${servico.cod}`)} />
        <HiOutlinePencilAlt className="text-3xl text-yellow-500 cursor-pointer hover:text-yellow-700 transition-colors" title="Alteração" onClick={() => router.push(`alteraservico/${servico.cod}`)} />
        <HiOutlineXCircle className="text-3xl text-red-600 cursor-pointer hover:text-red-800 transition-colors" title="Excluir" onClick={() => excluirServico(servico)} />
      </td>
    </tr>
  ))

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

  const onOpenModal = () => setOpen(true)
  const onCloseModal = () => setOpen(false)

  return (
    <div className="m-4">
      <Modal open={open} onClose={onCloseModal} center>
        <form className="max-w-5xl mx-auto p-6 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg m-6" onSubmit={handleSubmit(incluirServico)}>
          <div className="mb-5">
            <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome do serviço</label>
            <input type="text" id="nome" placeholder="Digite o nome do serviço" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" required {...register("nome")} />
          </div>
          <div className="mb-5">
            <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
            <input type="text" id="descricao" placeholder="Digite a descrição do serviço" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" required {...register("descricao")} />
          </div>
          <div className="mb-5">
            <label htmlFor="simbolo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">URL do símbolo</label>
            <input type="url" id="simbolo" placeholder="Insira a URL do símbolo" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" required {...register("simbolo")} />
          </div>
          <button type="submit" className="text-white bg-green-700 hover:bg-green-800 shadow-md hover:shadow-lg focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Cadastrar Serviço</button>
        </form>
      </Modal>

      <div className="flex justify-end gap-4 mb-4">
        <button
          type="button"
          className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-bold rounded-lg text-md px-5 py-2.5 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none dark:focus:ring-green-900"
          onClick={onOpenModal}
        >
          Novo cadastro
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
                Símbolo
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
