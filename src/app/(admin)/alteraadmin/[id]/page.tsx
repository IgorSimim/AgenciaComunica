'use client'
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

type Inputs = {
  nome: string
  email: string
  senha: string
  atuacao: string
  dtnasc: string
  sobre: string
  foto: string
}

export default function AlteracaoContratado() {
  const params = useParams()
  const { register, handleSubmit, reset } = useForm<Inputs>()

  useEffect(() => {
    async function getContratado() {
      try {
        const response = await fetch("http://localhost:3004/contratados/pesq/" + params.id)
        const dado = await response.json()

        if (response.ok) {
          reset({
            nome: dado.nome,
            email: dado.email,
            senha: dado.senha,
            atuacao: dado.atuacao,
            dtnasc: dado.dtnasc ? dado.dtnasc.split('T')[0] : "",
            sobre: dado.sobre,
            foto: dado.foto
          })
        } else {
          toast.error("Não foi possível carregar os dados do contratado")
        }
      } catch (error) {
        toast.error("Erro ao carregar os dados do contratado")
      }
    }
    getContratado()
  }, [params.id])

  async function alteraDados(data: Inputs) {
    try {
      const response = await fetch("http://localhost:3004/contratados/" + params.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.status === 200) {
        toast.success("Contratado alterado com sucesso!")
      } else {
        const errorData = await response.json()

        if (errorData.id === 3) {
          toast.error("O e-mail fornecido é inválido.")
        } else if (errorData.id === 6) {
          toast.error("A URL da foto não é válida.")
        } else {
          toast.error(`Erro ao alterar o contratado: ${errorData.msg || 'Tente novamente.'}`)
        }
      }
    } catch (error) {
      toast.error("Erro ao processar a alteração. Tente novamente mais tarde.")
    }
  }


  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6 font-bold text-gray-900">Alteração das informações da pessoa contratada</h2>
      <form
        className="grid grid-cols-1 gap-6 max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit(alteraDados)}
      >
        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Informações básicas</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="sm:col-span-1">
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-800">
                Nome
              </label>
              <input
                {...register("nome")}
                type="text"
                id="nome"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Digite o nome completo"
                required
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Digite o email"
                required
              />
            </div>

            <div className="sm:col-span-1 lg:col-span-2">
              <label htmlFor="atuacao" className="block mb-2 text-sm font-medium text-gray-800">
                Área de atuação
              </label>
              <input
                {...register("atuacao")}
                type="text"
                id="atuacao"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Digite a área de atuação"
                required
              />
            </div>
            <div className="sm:col-span-1 lg:col-span-1">
              <label htmlFor="dtnasc" className="block mb-2 text-sm font-medium text-gray-800">
                Data de nascimento
              </label>
              <input
                {...register("dtnasc")}
                type="date"
                id="dtnasc"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                required
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Foto</legend>
          <div className="mt-4">
            <label htmlFor="foto" className="block mb-2 text-sm font-medium text-gray-800">
              URL da foto
            </label>
            <input
              {...register("foto")}
              type="url"
              id="foto"
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
              placeholder="Insira a URL da foto"
              required
            />
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Sobre o Contratado</legend>
          <div className="mt-4">
            <label htmlFor="sobre" className="block mb-2 text-sm font-medium text-gray-800">
              Sobre
            </label>
            <textarea
              {...register("sobre")}
              id="sobre"
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
              placeholder="Escreva uma breve descrição sobre o contratado"
              required
            />
          </div>
        </fieldset>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <button
            type="submit"
            className="bg-yellow-400 text-black font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-200 ease-in-out shadow-md"
          >
            Alterar Contratado
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 ease-in-out shadow-md"
            onClick={() =>
              reset({
                nome: "",
                email: "",
                atuacao: "",
                dtnasc: "",
                sobre: "",
                foto: "",
              })
            }
          >
            Limpar
          </button>
        </div>
      </form>

      <div className="flex justify-start mt-6">
        <Link href="/principal/contratados">
          <button className="bg-gray-600 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 transition-all duration-200 ease-in-out shadow-md">
            Voltar
          </button>
        </Link>
      </div>
    </div>
  )
}
