'use client'
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'

const ContratadosRegister: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<{
    nome: string
    email: string
    senha: string
    atuacao: string
    dtnasc: Date
    sobre: string
    foto: string
  }>()

  async function registerContratados(data: {
    nome: string
    email: string
    senha: string
    atuacao: string
    dtnasc: Date
    sobre: string
    foto: string
  }) {
    try {
      const response = await fetch("http://localhost:3004/contratados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      console.log("Response Data:", responseData)

      if (response.ok) {
        toast.success("Funcionário cadastrado com sucesso!")
        reset()
      } else {
        switch (responseData.id) {
          case 1:
            toast.error("Preencha todos os campos obrigatórios.")
            break
          case 2:
            toast.error(responseData.msg)
            break
          case 4:
            toast.error("O e-mail já está cadastrado. Escolha outro.")
            break
          case 5:
            toast.error("Dados inválidos. Verifique os campos.")
            break
          case 6:
            toast.error("Formato de email inválido.")
            break
          case 7:
            toast.error("Data de nascimento inválida.")
            break
          default:
            toast.error(responseData.msg || "Erro ao cadastrar o funcionário.")
        }
      }
    } catch (error) {
      console.error("Erro ao cadastrar o funcionário:", error)
      toast.error("Erro inesperado. Tente novamente mais tarde.")
    }

  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6 font-bold text-gray-900">Cadastrar um novo funcionário</h2>
      <form
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit(registerContratados)}
      >
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
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

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-800">
              Senha
            </label>
            <input
              {...register("senha")}
              type="password"
              id="senha"
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
              placeholder="********"
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

        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <label htmlFor="sobre" className="block mb-2 text-sm font-medium text-gray-800">
            Sobre
          </label>
          <textarea
            {...register("sobre")}
            id="sobre"
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
            placeholder="Escreva uma breve descrição sobre o novo contratado"
            rows={4}
            required
          />
        </div>

        <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
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

          <div>
            <label htmlFor="foto" className="block mb-2 text-sm font-medium text-gray-800">
              Foto da pessoa contratada
            </label>
            <input
              {...register("foto")}
              type="url"
              id="foto"
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
              placeholder="URL da foto da nova pessoa contratada"
              required
            />
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-start mt-6">
          <button
            type="submit"
            className="bg-yellow-400 text-black font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-200 ease-in-out shadow-md"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContratadosRegister
