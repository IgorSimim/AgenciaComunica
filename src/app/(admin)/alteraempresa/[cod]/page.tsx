'use client'
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

type Inputs = {
  nome: string
  cnpj: string
  email: string
  senha: string
  atuacao: string
  logotipo: string
}

export default function AlteracaoEmpresa() {
  const params = useParams()
  const { register, handleSubmit, reset } = useForm<Inputs>()

  useEffect(() => {
    async function getEmpresa() {
      try {
        const response = await fetch("http://localhost:3004/empresas/pesq/" + params.cod)
        const dado = await response.json()

        if (response.ok) {
          reset({
            nome: dado.nome,
            cnpj: dado.cnpj,
            email: dado.email,
            senha: dado.senha,
            atuacao: dado.atuacao,
            logotipo: dado.logotipo
          })
        } else {
          toast.error("Não foi possível carregar os dados da empresa")
        }
      } catch (error) {
        toast.error("Erro ao carregar os dados da empresa")
      }
    }
    getEmpresa()
  }, [])

  async function alteraDados(data: Inputs) {
    try {
      const response = await fetch("http://localhost:3004/empresas/" + params.cod, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      })

      if (response.status === 200) {
        toast.success("Empresa alterada com sucesso!")
      } else {
        const errorData = await response.json()

        if (errorData.msg === "Formato de email inválido.") {
          toast.error("O formato do e-mail fornecido é inválido.")
        } else if (errorData.msg === "Empresa não encontrada.") {
          toast.error("A empresa com o código fornecido não foi encontrada.")
        } else if (errorData.msg === "Não foi possível atualizar a empresa.") {
          toast.error("Ocorreu um erro ao tentar atualizar a empresa. Tente novamente.")
        } else {
          toast.error(`Erro ao alterar a empresa: ${errorData.msg || 'Tente novamente.'}`)
        }
      }
    } catch (error) {
      toast.error("Erro ao processar a alteração. Tente novamente mais tarde.")
    }
  }


  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6 font-bold text-gray-900">Alteração das informações da empresa</h2>
      <form
        className="grid grid-cols-1 gap-6 max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit(alteraDados)}
      >
        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Informações básicas</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            <div>
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-800">
                Nome
              </label>
              <input
                {...register("nome")}
                type="text"
                id="nome"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Digite o nome da empresa"
                required
              />
            </div>
            <div>
              <label htmlFor="cnpj" className="block mb-2 text-sm font-medium text-gray-800">
                CNPJ
              </label>
              <input
                {...register("cnpj")}
                type="text"
                id="cnpj"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Digite o CNPJ"
                required
              />
            </div>
            <div>
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
            <div>
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
          </div>
        </fieldset>

        {/* Logotipo */}
        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Logotipo</legend>
          <div className="mt-4">
            <label htmlFor="logotipo" className="block mb-2 text-sm font-medium text-gray-800">
              URL do Logotipo
            </label>
            <input
              {...register("logotipo")}
              type="url"
              id="logotipo"
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
              placeholder="Insira a URL do logotipo"
              required
            />
          </div>
        </fieldset>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <button
            type="submit"
            className="bg-yellow-400 text-black font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-200 ease-in-out shadow-md"
          >
            Alterar Empresa
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 ease-in-out shadow-md"
            onClick={() =>
              reset({
                nome: "",
                cnpj: "",
                email: "",
                senha: "",
                atuacao: "",
                logotipo: "",
              })
            }
          >
            Limpar
          </button>
        </div>
      </form>

      <div className="flex justify-start mt-6">
        <Link href="/principal/cadempresa">
          <button className="bg-gray-600 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 transition-all duration-200 ease-in-out shadow-md">
            Voltar
          </button>
        </Link>
      </div>
    </div>
  )
}