'use client'
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Link from "next/link"
import { TServico } from "@/app/types"

type ServicoForm = Omit<TServico, 'cod'>

export default function CriarServico() {
  const { register, handleSubmit, reset } = useForm<ServicoForm>()

  async function criarServico(data: ServicoForm) {
    try {
      const response = await fetch("/api/servico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.status === 201) {
        toast.success("Serviço criado com sucesso!")
        reset()
      } else {
        const errorData = await response.json()
        toast.error(`Erro ao criar o serviço: ${errorData.msg || 'Tente novamente.'}`)
      }
    } catch (error) {
      toast.error("Erro ao processar a criação. Tente novamente mais tarde.")
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6 font-bold text-gray-900">Criar novo serviço</h2>
      <form
        className="grid grid-cols-1 gap-6 max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit(criarServico)}
      >
        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Informações básicas</legend>
          <div className="mt-4">
            <div className="w-full mb-4">
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-800">
                Nome do serviço
              </label>
              <input
                {...register("nome")}
                type="text"
                id="nome"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Digite o nome do serviço"
                required
              />
            </div>

            <div className="w-full mb-4">
              <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-800">
                Descrição
              </label>
              <textarea
                {...register("descricao")}
                id="descricao"
                className="border border-gray-300 rounded-md p-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Digite a descrição do serviço"
                required
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Símbolo</legend>
          <div className="mt-4">
            <label htmlFor="simbolo" className="block mb-2 text-sm font-medium text-gray-800">
              URL do símbolo
            </label>
            <input
              {...register("simbolo")}
              type="url"
              id="simbolo"
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
              placeholder="Insira a URL do símbolo"
              required
            />
          </div>
        </fieldset>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <button
            type="submit"
            className="bg-yellow-400 text-black font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-200 ease-in-out shadow-md"
          >
            Criar Ssrviço
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 ease-in-out shadow-md"
            onClick={() => reset()}
          >
            Limpar
          </button>
        </div>
      </form>

      <div className="flex justify-start mt-6">
        <Link href="/servico">
          <button className="bg-gray-600 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 transition-all duration-200 ease-in-out shadow-md">
            Voltar
          </button>
        </Link>
      </div>
    </div>
  )
}