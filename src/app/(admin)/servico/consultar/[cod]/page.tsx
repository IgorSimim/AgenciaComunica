'use client'
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import { alerts } from "@/lib/alerts"
import Link from "next/link"
import { TServico } from "@/app/types/index"

export default function ConsultaServico() {
  const params = useParams()
  const { register, reset, watch } = useForm<TServico>()

  const simbolo = watch("simbolo")
  const preco = watch("preco")

  useEffect(() => {
    async function getServico() {
      try {
        const response = await fetch("/api/servico/" + params.cod)
        const dado = await response.json()

        if (response.ok) {
          reset({
            nome: dado.nome,
            descricao: dado.descricao,
            simbolo: dado.simbolo,
            preco: dado.preco
          })
        } else {
          alerts.error(dado.message || "Não foi possível carregar os dados do serviço")
        }
      } catch (error) {
        alerts.error("Erro ao carregar os dados do serviço")
      }
    }

    getServico()
  }, [params.cod, reset])

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6 font-bold text-gray-900">Consulta das informações do serviço</h2>

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
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Nome do serviço"
                readOnly
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-800">Descrição</label>
              <textarea
                {...register("descricao")}
                id="descricao"
                className="border border-gray-300 rounded-md p-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Descrição do serviço"
                readOnly
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="preco" className="block mb-2 text-sm font-medium text-gray-800">Preço</label>
              <input
                value={preco ? `R$ ${preco.toFixed(2).replace('.', ',')}` : ''}
                type="text"
                id="preco"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Preço do serviço"
                readOnly
              />
            </div>
          </div>
        </fieldset>

        {/* Foto e Data de Criação do Serviço */}
        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Informações adicionais</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="sm:col-span-1">
              <label htmlFor="simbolo" className="block mb-2 text-sm font-medium text-gray-800">Símbolo</label>
              <div className="w-full h-56">
                <img
                  src={simbolo}
                  alt="Símbolo do serviço"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>

            {/* <div className="sm:col-span-1">
              <label htmlFor="dataCriacao" className="block mb-2 text-sm font-medium text-gray-800">Data de Criação</label>
              <input
                {...register("dataCriacao")}
                type="text"
                id="dataCriacao"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Data de criação"
                readOnly
              />
            </div> */}
          </div>
        </fieldset>
      </div>

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
