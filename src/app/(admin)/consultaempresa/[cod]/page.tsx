'use client'
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

type EmpresaData = {
  nome: string
  cnpj: string
  email: string
  atuacao: string
  logotipo: string
  dataCriacao: string
}

export default function ConsultaEmpresa() {
  const params = useParams()
  const { register, reset, watch } = useForm<EmpresaData>()

  const logotipo = watch("logotipo")

  useEffect(() => {
    async function getEmpresa() {
      try {
        const response = await fetch("http://localhost:3004/empresas/pesq/" + params.cod)
        const dado = await response.json()

        if (response.ok) {
          const dataCriacao = new Date(dado.createdAt)
          const formattedDate = `${dataCriacao.getDate().toString().padStart(2, '0')}/${(dataCriacao.getMonth() + 1).toString().padStart(2, '0')}/${dataCriacao.getFullYear()}`

          reset({
            nome: dado.nome,
            cnpj: dado.cnpj,
            email: dado.email,
            atuacao: dado.atuacao,
            logotipo: dado.logotipo,
            dataCriacao: formattedDate
          })
        } else {
          toast.error("Não foi possível carregar os dados da empresa")
        }
      } catch (error) {
        toast.error("Erro ao carregar os dados da empresa")
      }
    }
    getEmpresa()
  }, [params.cod, reset])

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6 font-bold text-gray-900">Consulta das informações da empresa</h2>

      <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg">
        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Informações da empresa</legend>
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
                placeholder="Nome da empresa"
                readOnly
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="cnpj" className="block mb-2 text-sm font-medium text-gray-800">
                CNPJ
              </label>
              <input
                {...register("cnpj")}
                type="text"
                id="cnpj"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="CNPJ da empresa"
                readOnly
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
                placeholder="Email da empresa"
                readOnly
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="dataCriacao" className="block mb-2 text-sm font-medium text-gray-800">
                Data de cadastro
              </label>
              <input
                {...register("dataCriacao")}
                type="text"
                id="dataCriacao"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Data de cadastro"
                readOnly
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Informações adicionais</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="sm:col-span-1">
              <label htmlFor="atuacao" className="block mb-2 text-sm font-medium text-gray-800">
                Área de atuação
              </label>
              <input
                {...register("atuacao")}
                type="text"
                id="atuacao"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Área de atuação"
                readOnly
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="logotipo" className="block mb-2 text-sm font-medium text-gray-800">
                Logotipo
              </label>
              {logotipo && (
                <div className="flex justify-center">
                  <img
                    src={logotipo}
                    alt="Logotipo da empresa"
                    className="w-40 h-auto object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </fieldset>
      </div>

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
