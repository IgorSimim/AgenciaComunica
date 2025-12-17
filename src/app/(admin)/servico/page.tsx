'use client'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { HiOutlineXCircle, HiOutlinePencilAlt, HiOutlineEye } from "react-icons/hi"
import { useRouter } from "next/navigation"
import axios from 'axios'
import { alerts } from '@/lib/alerts'
import { TServico } from '@/app/types/index'

function CadServicos() {
  const [servicos, setServicos] = useState<TServico[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()
  const { register, handleSubmit, reset, setFocus, formState: { errors } } = useForm<TServico>({
    mode: "onBlur"
  })

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

  async function incluirServico(data: TServico) {
    try {
      const response = await fetch("/api/servico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const responseData = await response.json()
        alerts.success("Serviço cadastrado com sucesso!")
        reset()
        setServicos([responseData.servico, ...servicos])
        setOpen(false)
      } else {
        const errorData = await response.json()
        alerts.error(errorData.message || "Erro ao cadastrar o serviço")
      }
    } catch (error) {
      alerts.error("Erro ao processar o cadastro. Tente novamente mais tarde.")
    }
  }

  useEffect(() => {
    if (open) {
      setFocus("nome")
    }
  }, [open, setFocus])

  const listaServicos = Array.isArray(servicos) ? servicos.map((servico: TServico) => (
    <tr key={servico.cod} className="odd:bg-gray-100 odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <img src={servico.simbolo} alt="Símbolo do serviço" className="w-20 h-20 sm:w-16 sm:h-16 object-contain" />
      </th>
      <td className="px-6 py-4">{servico.nome}</td>
      <td className="px-6 py-4">{servico.descricao}</td>
      <td className="px-6 py-4">R$ {servico.preco?.toFixed(2).replace('.', ',')}</td>
      <td className="px-6 py-4 flex">
        <HiOutlineEye className="text-3xl text-blue-700 cursor-pointer hover:text-blue-700 transition-colors" title="Consulta" onClick={() => router.push(`/servico/consultar/${servico.cod}`)} />
        <HiOutlinePencilAlt className="text-3xl text-yellow-500 cursor-pointer hover:text-yellow-700 transition-colors" title="Alteração" onClick={() => router.push(`/servico/editar/${servico.cod}`)} />
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

  const validateNome = (nome: string) => {
    const nomeRegex = /^[A-Za-zÀ-ú\s]+$/
    if (!nomeRegex.test(nome)) {
      return "Nome não pode conter números ou caracteres especiais"
    }
    return true
  }

  const validateURL = (url: string) => {
    try {
      new URL(url)
      if (url.length > 255) {
        return "URL deve ter no máximo 255 caracteres"
      }
      return true
    } catch {
      return "URL deve ter um formato válido"
    }
  }

  const onOpenModal = () => setOpen(true)
  const onCloseModal = () => setOpen(false)

  return (
    <div className="m-4">
      <Modal open={open} onClose={onCloseModal} center>
        <form className="max-w-5xl mx-auto p-6 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg m-6" onSubmit={handleSubmit(incluirServico)}>
          <div className="mb-5">
            <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
            <input
              {...register("nome", {
                required: "Nome é obrigatório",
                maxLength: { value: 100, message: "Nome deve ter no máximo 100 caracteres" },
                minLength: { value: 2, message: "Nome deve ter pelo menos 2 caracteres" },
                validate: validateNome
              })}
              type="text"
              id="nome"
              className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-2 focus:outline-none block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${errors.nome ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500'}`}
              placeholder="Digite o nome do serviço"
              maxLength={100}
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
          </div>
          <div className="mb-5">
            <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
            <input
              {...register("descricao", {
                required: "Descrição é obrigatória",
                maxLength: { value: 500, message: "Descrição deve ter no máximo 500 caracteres" },
                minLength: { value: 10, message: "Descrição deve ter pelo menos 10 caracteres" }
              })}
              type="text"
              id="descricao"
              className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-2 focus:outline-none block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${errors.descricao ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500'}`}
              placeholder="Digite a descrição do serviço"
              maxLength={500}
            />
            {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>}
          </div>
          <div className="mb-5">
            <label htmlFor="simbolo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">URL do símbolo</label>
            <input
              {...register("simbolo", {
                required: "URL do símbolo é obrigatória",
                validate: validateURL
              })}
              type="url"
              id="simbolo"
              className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-2 focus:outline-none block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${errors.simbolo ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500'}`}
              placeholder="Insira a URL do símbolo"
              maxLength={255}
            />
            {errors.simbolo && <p className="text-red-500 text-sm mt-1">{errors.simbolo.message}</p>}
          </div>
          <div className="mb-5">
            <label htmlFor="preco" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Preço</label>
            <input
              {...register("preco", {
                required: "Preço é obrigatório",
                valueAsNumber: true,
                min: { value: 0.01, message: "Preço deve ser maior que zero" },
                max: { value: 999999.99, message: "Preço deve ser menor que R$ 999.999,99" }
              })}
              type="number"
              id="preco"
              step="0.01"
              min="0"
              className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-2 focus:outline-none block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${errors.preco ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500'}`}
              placeholder="Digite o preço do serviço"
            />
            {errors.preco && <p className="text-red-500 text-sm mt-1">{errors.preco.message}</p>}
          </div>
          <button type="submit" className="text-white bg-green-700 hover:bg-green-800 shadow-md hover:shadow-lg focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Cadastrar serviço</button>
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
