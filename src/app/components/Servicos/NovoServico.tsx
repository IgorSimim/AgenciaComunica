'use client'
import { useForm } from "react-hook-form"
import { servicoProps } from "@/app/(admin)/cadservico/page"
import { Dispatch, SetStateAction, useEffect } from "react"
import { toast } from "sonner"

type Inputs = {
  nome: string
  descricao: string
  foto: string
}

interface NovoServicoProps {
  servicos: servicoProps[]
  setServicos: Dispatch<SetStateAction<servicoProps[]>>
}

function NovoServico({ servicos, setServicos }: NovoServicoProps) {
  const {
    register,
    handleSubmit,
    reset,
    setFocus
  } = useForm<Inputs>()

  async function incluirServico(data: Inputs) {
    const novoServico: servicoProps = {
      cod: 0,
      nome: data.nome,
      descricao: data.descricao,
      foto: data.foto
    }

    try {
      const response = await fetch("http://localhost:3004/servicos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novoServico),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Serviço cadastrado com sucesso!")
        reset()
        setServicos([data, ...servicos])
      } else {
        switch (data.id) {
          case 1:
            toast.error("Preencha todos os campos obrigatórios.")
            break
          case 4:
            toast.error("Já existe um serviço com este nome.")
            break
          default:
            toast.error(data.msg || "Erro ao cadastrar o serviço.")
        }
      }
    } catch (error) {
      console.error("Erro ao cadastrar o serviço:", error)
      toast.error("Erro inesperado. Tente novamente mais tarde.")
    }

  }

  useEffect(() => {
    setFocus("nome")
  }, [])

  return (
    <>
      <form
        className="max-w-5xl mx-auto p-6 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg m-6"
        onSubmit={handleSubmit(incluirServico)}
      >
        <div className="mb-5">
          <label
            htmlFor="nome"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nome do serviço
          </label>
          <input
            type="text"
            id="nome"
            placeholder="Digite o nome do serviço"
            aria-required="true"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            required
            {...register("nome")}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="descricao"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Descrição
          </label>
          <input
            type="text"
            id="descricao"
            placeholder="Digite a descrição do serviço"
            aria-required="true"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            required
            {...register("descricao")}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="foto"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            URL da foto
          </label>
          <input
            type="url"
            id="foto"
            placeholder="Insira a URL da foto"
            aria-required="true"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            required
            {...register("foto")}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-green-700 hover:bg-green-800 shadow-md hover:shadow-lg focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Cadastrar Serviço
        </button>
      </form>
    </>

  )
}

export default NovoServico