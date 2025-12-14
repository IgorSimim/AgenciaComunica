'use client'
import { useForm } from "react-hook-form"
import Cookies from "js-cookie"
import { empresaProps } from "@/app/(admin)/cadempresa/page"
import { Dispatch, SetStateAction, useEffect } from "react"
import { toast } from "sonner"

type Inputs = {
  cnpj: string
  nome: string
  email: string
  senha: string
  atuacao: string
  logotipo: string
}

interface NovaEmpresaProps {
  empresas: empresaProps[]
  setEmpresas: Dispatch<SetStateAction<empresaProps[]>>
}

function NovaEmpresa({ empresas, setEmpresas }: NovaEmpresaProps) {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
  } = useForm<Inputs>()

  async function incluirEmpresa(data: Inputs) {
    const novaEmpresa: empresaProps = {
      cod: 0,
      nome: data.nome,
      cnpj: data.cnpj,
      email: data.email,
      senha: data.senha,
      atuacao: data.atuacao,
      logotipo: data.logotipo,
      contr_id: Number(Cookies.get("contr_logado_id"))
    }

    try {
      const response = await fetch("http://localhost:3004/empresas", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + Cookies.get("contr_logado_token"),
        },
        body: JSON.stringify(novaEmpresa),
      })

      const responseData = await response.json()

      if (response.ok) {
        toast.success("Empresa cadastrada com sucesso!")
        reset()

        const empresas2 = [novaEmpresa, ...empresas]
        setEmpresas(empresas2)
      } else {
        switch (responseData.id) {
          case 1:
            toast.error("Preencha todos os campos obrigatórios.")
            break
          case 2:
            toast.error(responseData.msg)
            break
          case 3:
            toast.error("CNPJ já cadastrado. Por favor, escolha outro.")
            break
          case 4:
            toast.error("E-mail já cadastrado. Por favor, escolha outro.")
            break
          case 6:
            toast.error("CNPJ inválido. Verifique o formato e tente novamente.")
            break
          case 7:
            toast.error("Formato de email inválido.")
            break
          default:
            toast.error(responseData.msg || "Erro ao cadastrar a empresa.")
        }
      }
    } catch (error) {
      console.error("Erro ao cadastrar a empresa:", error)
      toast.error("Erro inesperado. Tente novamente mais tarde.")
    }

  }

  useEffect(() => {
    setFocus("nome")
  }, [])

  return (
    <>
      <form className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg m-6" onSubmit={handleSubmit(incluirEmpresa)}>
        <div className="mb-5">
          <label
            htmlFor="nome"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nome da empresa
          </label>
          <input
            type="text"
            id="nome"
            placeholder="Digite o nome da empresa"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            required
            {...register("nome")}
          />

        </div>

        <div className="mb-5">
          <label
            htmlFor="cnpj"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            CNPJ
          </label>
          <input
            type="text"
            id="cnpj"
            placeholder="Digite o CNPJ"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            required
            {...register("cnpj")}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Digite o email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            required
            {...register("email")}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="senha"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Senha
          </label>
          <input
            type="password"
            id="senha"
            placeholder="Digite a senha"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            required
            {...register("senha")}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="atuacao"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Área de atuação
          </label>
          <input
            type="text"
            id="atuacao"
            placeholder="Digite a área de atuação"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            required
            {...register("atuacao")}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="logotipo"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            URL do logotipo
          </label>
          <input
            type="url"
            id="logotipo"
            placeholder="Insira a URL do logotipo"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            required
            {...register("logotipo")}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Cadastrar Empresa
        </button>
      </form>
    </>
  )
}

export default NovaEmpresa