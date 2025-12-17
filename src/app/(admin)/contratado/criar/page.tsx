'use client'
import React from "react"
import { useForm } from "react-hook-form"
import { alerts } from "@/lib/alerts"
import Link from "next/link"
import { TContratado } from "@/app/types/index"

const validateNome = (nome: string) => {
  const nomeRegex = /^[A-Za-zÀ-ú\s]+$/
  if (!nomeRegex.test(nome)) {
    return "Nome não pode conter números ou caracteres especiais"
  }
  return true
}

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return "Email deve ter um formato válido"
  }
  if (email.length > 100) {
    return "Email deve ter no máximo 100 caracteres"
  }
  return true
}

const validateTelefone = (telefone: string) => {
  const cleanTelefone = telefone.replace(/\D/g, '')
  if (cleanTelefone.length !== 11) {
    return "Telefone deve ter 11 dígitos"
  }
  return true
}

const formatTelefone = (value: string) => {
  const cleanValue = value.replace(/\D/g, '')
  return cleanValue
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
}

const validateSenha = (senha: string) => {
  const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/
  if (!senhaRegex.test(senha)) {
    return "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais"
  }
  return true
}

const validateURL = (url: string) => {
  try {
    new URL(url)
    if (url.length > 255) {
      return "URL deve ter no máximo 255 caracteres"
    }
    return true
  } catch {
    return "URL deve ter um formato válido"
  }
}

const ContratadosRegister: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TContratado>({
    mode: "onBlur"
  })

  async function criarContratado(data: TContratado) {
    const novoContratado = {
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      telefone: data.telefone,
      cargo: data.cargo,
      dtnasc: new Date(data.dtnasc).toISOString(),
      sobre: data.sobre,
      foto: data.foto
    }

    try {
      const response = await fetch("/api/contratado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoContratado),
      })

      if (response.status === 201 || response.status === 200) {
        alerts.success("Contratado criado com sucesso!")
        reset()
      } else {
        const errorData = await response.json()
        alerts.error(errorData.message || errorData.msg || 'Erro ao criar o contratado')
      }
    } catch (error) {
      alerts.error("Erro ao processar a criação. Tente novamente mais tarde.")
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6 font-bold text-gray-900">Cadastrar novo funcionário</h2>
      <form
        className="grid grid-cols-1 gap-6 max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit(criarContratado)}
      >
        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Informações básicas</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-800">Nome</label>
              <input
                {...register("nome", {
                  required: "Nome é obrigatório",
                  maxLength: { value: 100, message: "Nome deve ter no máximo 100 caracteres" },
                  minLength: { value: 2, message: "Nome deve ter pelo menos 2 caracteres" },
                  validate: validateNome
                })}
                type="text"
                id="nome"
                className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.nome ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
                placeholder="Digite o nome completo"
                maxLength={100}
              />
              {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-800">Email</label>
              <input
                {...register("email", {
                  required: "Email é obrigatório",
                  validate: validateEmail
                })}
                type="email"
                id="email"
                className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
                placeholder="Digite o email"
                maxLength={100}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="telefone" className="block mb-2 text-sm font-medium text-gray-800">Telefone</label>
              <input
                {...register("telefone", {
                  required: "Telefone é obrigatório",
                  validate: validateTelefone,
                  onChange: (e) => {
                    e.target.value = formatTelefone(e.target.value)
                  }
                })}
                type="text"
                id="telefone"
                className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.telefone ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
              {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone.message}</p>}
            </div>
            <div>
              <label htmlFor="cargo" className="block mb-2 text-sm font-medium text-gray-800">Cargo</label>
              <input
                {...register("cargo", {
                  required: "Cargo é obrigatório",
                  maxLength: { value: 50, message: "Cargo deve ter no máximo 50 caracteres" },
                  minLength: { value: 2, message: "Cargo deve ter pelo menos 2 caracteres" }
                })}
                type="text"
                id="cargo"
                className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.cargo ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
                placeholder="Digite o cargo"
                maxLength={50}
              />
              {errors.cargo && <p className="text-red-500 text-sm mt-1">{errors.cargo.message}</p>}
            </div>
            <div>
              <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-800">Senha</label>
              <input
                {...register("senha", {
                  required: "Senha é obrigatória",
                  minLength: { value: 8, message: "Senha deve ter pelo menos 8 caracteres" },
                  maxLength: { value: 100, message: "Senha deve ter no máximo 100 caracteres" },
                  validate: validateSenha
                })}
                type="password"
                id="senha"
                className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.senha ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
                placeholder="Digite a senha (mín. 8 caracteres)"
                maxLength={100}
              />
              {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>}
            </div>
            <div>
              <label htmlFor="dtnasc" className="block mb-2 text-sm font-medium text-gray-800">Data de nascimento</label>
              <input
                {...register("dtnasc", {
                  required: "Data de nascimento é obrigatória"
                })}
                type="date"
                id="dtnasc"
                className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.dtnasc ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
              />
              {errors.dtnasc && <p className="text-red-500 text-sm mt-1">{errors.dtnasc.message}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Foto</legend>
          <div className="mt-4">
            <label htmlFor="foto" className="block mb-2 text-sm font-medium text-gray-800">URL da foto</label>
            <input
              {...register("foto", {
                required: "URL da foto é obrigatória",
                validate: validateURL
              })}
              type="url"
              id="foto"
              className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.foto ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
              placeholder="Insira a URL da foto"
              maxLength={255}
            />
            {errors.foto && <p className="text-red-500 text-sm mt-1">{errors.foto.message}</p>}
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Sobre o funcionário</legend>
          <div className="mt-4">
            <label htmlFor="sobre" className="block mb-2 text-sm font-medium text-gray-800">Sobre</label>
            <textarea
              {...register("sobre", {
                required: "Descrição é obrigatória",
                maxLength: { value: 500, message: "Descrição deve ter no máximo 500 caracteres" },
                minLength: { value: 10, message: "Descrição deve ter pelo menos 10 caracteres" }
              })}
              id="sobre"
              className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.sobre ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
              placeholder="Escreva uma breve descrição sobre a pessoa contratada"
              maxLength={500}
            />
            {errors.sobre && <p className="text-red-500 text-sm mt-1">{errors.sobre.message}</p>}
          </div>
        </fieldset>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <button type="submit" className="bg-yellow-400 text-black font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-200 ease-in-out shadow-md">
            Cadastrar funcionário
          </button>
          <button type="button" className="bg-gray-500 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 ease-in-out shadow-md" onClick={() => reset()}>
            Limpar
          </button>
        </div>
      </form>

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

export default ContratadosRegister
