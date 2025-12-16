'use client'
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { TContratado } from "@/app/types"

type ContratadoConsulta = Omit<TContratado, 'dtnasc'> & {
  dtnasc: string
  dataCriacao: string
}

export default function ConsultaContratado() {
  const params = useParams()
  const { register, reset, watch } = useForm<ContratadoConsulta>()

  const foto = watch("foto")

  useEffect(() => {
    async function getContratado() {
      try {
        const response = await fetch("/api/contratado/" + params.id)
        const dado = await response.json()

        if (response.ok) {
          const dtnasc = new Date(dado.dtnasc)
          const formattedDatedtnasc = `${dtnasc.getUTCDate().toString().padStart(2, '0')}/${(dtnasc.getUTCMonth() + 1).toString().padStart(2, '0')}/${dtnasc.getUTCFullYear()}`

          const dataCriacao = new Date(dado.createdAt)
          const formattedDatedataCriacao = `${dataCriacao.getDate().toString().padStart(2, '0')}/${(dataCriacao.getMonth() + 1).toString().padStart(2, '0')}/${dataCriacao.getFullYear()}`

          reset({
            nome: dado.nome,
            email: dado.email,
            cargo: dado.cargo,
            dtnasc: formattedDatedtnasc,
            sobre: dado.sobre,
            foto: dado.foto,
            dataCriacao: formattedDatedataCriacao
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

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6 font-bold text-gray-900">Consulta das informações da pessoa contratada</h2>

      <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg">
        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Informações da pessoa contratada</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="sm:col-span-1">
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-800">Nome</label>
              <input
                {...register("nome")}
                type="text"
                id="nome"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Nome do contratado"
                readOnly
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-800">Email</label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Email do contratado"
                readOnly
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="cargo" className="block mb-2 text-sm font-medium text-gray-800">Cargo</label>
              <input
                {...register("cargo")}
                type="text"
                id="cargo"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Cargo do contratado"
                readOnly
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="dtnasc" className="block mb-2 text-sm font-medium text-gray-800">Data de nascimento</label>
              <input
                {...register("dtnasc")}
                type="text"
                id="dtnasc"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Data de nascimento"
                readOnly
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="dataCriacao" className="block mb-2 text-sm font-medium text-gray-800">Data de admissão</label>
              <input
                {...register("dataCriacao")}
                type="text"
                id="dataCriacao"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Data de admissão"
                readOnly
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Informações adicionais</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="sm:col-span-1">
              <label htmlFor="foto" className="block mb-2 text-sm font-medium text-gray-800">Foto</label>
              <div className="w-full h-56">
                <img
                  src={foto}
                  alt="Foto do contratado"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="sobre" className="block mb-2 text-sm font-medium text-gray-800">Descrição sobre o contratado</label>
              <textarea
                {...register("sobre")}
                id="sobre"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                placeholder="Descrição sobre o contratado"
                rows={6}
                readOnly
              />
            </div>
          </div>
        </fieldset>

      </div>

      <div className="flex justify-start mt-6">
        <Link href="/contratado">
          <button className="bg-gray-600 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 transition-all duration-200 ease-in-out shadow-md">
            Voltar
          </button>
        </Link>
      </div>
    </div>
  )
}
