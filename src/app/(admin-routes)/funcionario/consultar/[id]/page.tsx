'use client'
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import { alerts } from "@/lib/alerts"
import Link from "next/link"
import { TFuncionario } from "@/app/types/index"

export default function ConsultaFuncionario() {
  const params = useParams()
  const { register, reset, watch } = useForm<TFuncionario>()

  const foto = watch("fotoUrl")

  useEffect(() => {
    async function getFuncionario() {
      try {
        const response = await fetch("/api/funcionario/" + params.id)
        const dado = await response.json()

        if (response.ok) {
          reset({
            nome: dado.nome,
            email: dado.email,
            telefone: dado.telefone,
            cargo: dado.cargo,
            dtnasc: new Date(dado.dtnasc),
            sobre: dado.sobre,
            fotoUrl: dado.fotoUrl,
            createdAt: dado.createdAt
          })
        } else {
          alerts.error(dado.message || "Não foi possível carregar os dados do funcionário")
        }
      } catch (error) {
        alerts.error("Erro ao carregar os dados do funcionário")
      }
    }
    getFuncionario()
  }, [params.id])

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6 font-bold text-gray-900">Consultar informações do funcionário</h2>

      <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg">
        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Informações básicas</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="sm:col-span-1">
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-800">Nome</label>
              <input
                {...register("nome")}
                type="text"
                id="nome"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-hidden focus:ring-2 focus:ring-yellow-400 shadow-xs"
                placeholder="Nome do funcionário"
                readOnly
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-800">Email</label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-hidden focus:ring-2 focus:ring-yellow-400 shadow-xs"
                placeholder="Email do funcionário"
                readOnly
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="telefone" className="block mb-2 text-sm font-medium text-gray-800">Telefone</label>
              <input
                {...register("telefone")}
                type="text"
                id="telefone"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-hidden focus:ring-2 focus:ring-yellow-400 shadow-xs"
                placeholder="Telefone do funcionário"
                readOnly
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="cargo" className="block mb-2 text-sm font-medium text-gray-800">Cargo</label>
              <input
                {...register("cargo")}
                type="text"
                id="cargo"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-hidden focus:ring-2 focus:ring-yellow-400 shadow-xs"
                placeholder="Cargo do funcionário"
                readOnly
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="dtnasc" className="block mb-2 text-sm font-medium text-gray-800">Data de nascimento</label>
              <input
                type="text"
                id="dtnasc"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-hidden focus:ring-2 focus:ring-yellow-400 shadow-xs"
                placeholder="Data de nascimento"
                value={watch("dtnasc") ? new Date(watch("dtnasc")).toLocaleDateString('pt-BR') : ''}
                readOnly
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="createdAt" className="block mb-2 text-sm font-medium text-gray-800">Data de admissão</label>
              <input
                type="text"
                id="createdAt"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-hidden focus:ring-2 focus:ring-yellow-400 shadow-xs"
                placeholder="Data de admissão"
                value={watch("createdAt") ? new Date(watch("createdAt")).toLocaleDateString('pt-BR') : ''}
                readOnly
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Informações adicionais</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="sm:col-span-1">
              <label htmlFor="sobre" className="block mb-2 text-sm font-medium text-gray-800">Descrição sobre o funcionário</label>
              <textarea
                {...register("sobre")}
                id="sobre"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-hidden focus:ring-2 focus:ring-yellow-400 shadow-xs"
                placeholder="Descrição sobre o funcionário"
                rows={6}
                readOnly
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="foto" className="block mb-2 text-sm font-medium text-gray-800">Foto</label>
              <div className="w-full h-56">
                <img
                  src={foto}
                  alt="Foto do funcionário"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </fieldset>

      </div>

      <div className="flex justify-start mt-6">
        <Link href="/funcionario">
          <button className="bg-gray-600 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto cursor-pointerhover:bg-gray-700 focus:outline-hidden focus:ring-4 focus:ring-gray-500 transition-all duration-200 ease-in-out shadow-md">
            Voltar
          </button>
        </Link>
      </div>
    </div>
  )
}
