'use client'
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import { alerts } from "@/lib/alerts"
import Link from "next/link"
import { TEmpresa } from "@/app/types/index"

export default function ConsultaEmpresa() {
  const params = useParams()
  const { register, reset, watch } = useForm<TEmpresa>()

  const logotipo = watch("logotipo")

  useEffect(() => {
    async function getEmpresa() {
      try {
        const response = await fetch("/api/empresa/" + params.cod)
        const dado = await response.json()

        if (response.ok) {
          reset({
            nome: dado.nome,
            cnpj: dado.cnpj,
            email: dado.email,
            setor: dado.setor,
            logotipo: dado.logotipo,
            createdAt: dado.createdAt,
            updatedAt: dado.updatedAt
          })
        } else {
          alerts.error(dado.message || "Não foi possível carregar os dados da empresa")
        }
      } catch (error) {
        alerts.error("Erro ao carregar os dados da empresa")
      }
    }
    getEmpresa()
  }, [params.cod, reset])

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6 font-bold text-gray-900">Consultar informações da empresa</h2>

      <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg">
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
              <label htmlFor="setor" className="block mb-2 text-sm font-medium text-gray-800">
                Setor
              </label>
              <input
                {...register("setor")}
                type="text"
                id="setor"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Setor de atuação da empresa"
                readOnly
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Informações adicionais</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="sm:col-span-1">
              <label htmlFor="createdAt" className="block mb-2 text-sm font-medium text-gray-800">
                Data de cadastro
              </label>
              <input
                type="text"
                id="createdAt"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Data de cadastro"
                value={watch("createdAt") ? new Date(watch("createdAt")).toLocaleDateString('pt-BR') : ''}
                readOnly
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="updatedAt" className="block mb-2 text-sm font-medium text-gray-800">
                Data da última atualização
              </label>
              <input
                type="text"
                id="updatedAt"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Data da última atualização"
                value={watch("updatedAt") ? new Date(watch("updatedAt")).toLocaleDateString('pt-BR') : ''}
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
        <Link href="/empresa">
          <button className="bg-gray-600 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 transition-all duration-200 ease-in-out shadow-md">
            Voltar
          </button>
        </Link>
      </div>
    </div>
  )
}