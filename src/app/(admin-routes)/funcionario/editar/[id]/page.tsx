'use client'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import { alerts } from "@/lib/alerts"
import Link from "next/link"
import { TFuncionario } from "@/app/types/index"
import ImageUpload from "@/app/components/shared/ImageUpload"
import { useImageUpload } from "@/hooks/useImageUpload"

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

export default function AlteracaoFuncionario() {
  const params = useParams()
  const { register, reset, handleSubmit, formState: { errors }, setValue } = useForm<TFuncionario>({
    mode: "onBlur"
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [currentImage, setCurrentImage] = useState<string>('')
  const { uploading, uploadImage, uploadError } = useImageUpload()

  useEffect(() => {
    async function getFuncionario() {
      try {
        const response = await fetch("/api/funcionario/" + params.id)
        const dado = await response.json()

        if (response.ok) {
          setCurrentImage(dado.fotoUrl)
          reset({
            nome: dado.nome,
            email: dado.email,
            senha: dado.senha,
            telefone: dado.telefone,
            cargo: dado.cargo,
            sobre: dado.sobre,
            fotoUrl: dado.fotoUrl
          })
        } else {
          alerts.error("Não foi possível carregar os dados do funcionário")
        }
      } catch (error) {
        alerts.error("Erro ao carregar os dados do funcionário")
      }
    }
    getFuncionario()
  }, [params.id])

  async function alteraDados(data: TFuncionario) {
    try {
      let fotoUrl: string = data.fotoUrl || currentImage
      let fotoPublicId: string = ''

      if (!fotoUrl && !selectedFile) {
        alerts.error('Foto é obrigatória')
        return
      }

      if (selectedFile) {
        const uploadResult = await uploadImage(selectedFile, 'funcionarios')
        if (!uploadResult) {
          alerts.error('Erro no upload da imagem')
          return
        }
        fotoUrl = uploadResult.url
        fotoPublicId = uploadResult.publicId
      }

      const response = await fetch("/api/funcionario/" + params.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          fotoUrl: fotoUrl,
          fotoPublicId: fotoPublicId
        }),
      })

      if (response.status === 200) {
        alerts.success("Funcionário alterado com sucesso!")
      } else {
        const errorData = await response.json()
        alerts.error(errorData.message || 'Erro ao alterar o funcionário')
      }
    } catch (error) {
      alerts.error("Erro ao processar a edição. Tente novamente mais tarde.")
    }
  }


  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6 font-bold text-gray-900">Editar informações do funcionário</h2>
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
                {...register("nome", {
                  required: "Nome é obrigatório",
                  maxLength: { value: 100, message: "Nome deve ter no máximo 100 caracteres" },
                  minLength: { value: 2, message: "Nome deve ter pelo menos 2 caracteres" },
                  validate: validateNome
                })}
                type="text"
                id="nome"
                className={`border rounded-md p-3 w-full focus:outline-hidden focus:ring-2 shadow-xs ${errors.nome ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
                placeholder="Digite o nome completo"
                maxLength={100}
              />
              {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email é obrigatório",
                  validate: validateEmail
                })}
                type="email"
                id="email"
                className={`border rounded-md p-3 w-full focus:outline-hidden focus:ring-2 shadow-xs ${errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
                placeholder="Digite o email"
                maxLength={100}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="telefone" className="block mb-2 text-sm font-medium text-gray-800">
                Telefone
              </label>
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
                className={`border rounded-md p-3 w-full focus:outline-hidden focus:ring-2 shadow-xs ${errors.telefone ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
              {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone.message}</p>}
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="cargo" className="block mb-2 text-sm font-medium text-gray-800">
                Cargo
              </label>
              <input
                {...register("cargo", {
                  required: "Cargo é obrigatório",
                  maxLength: { value: 50, message: "Cargo deve ter no máximo 50 caracteres" },
                  minLength: { value: 2, message: "Cargo deve ter pelo menos 2 caracteres" }
                })}
                type="text"
                id="cargo"
                className={`border rounded-md p-3 w-full focus:outline-hidden focus:ring-2 shadow-xs ${errors.cargo ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
                placeholder="Digite o cargo"
                maxLength={50}
              />
              {errors.cargo && <p className="text-red-500 text-sm mt-1">{errors.cargo.message}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Foto</legend>
          <div className="mt-4">
            <ImageUpload
              currentImage={currentImage}
              onImageChange={(file) => {
                setSelectedFile(file)
                if (file) {
                  setValue('fotoUrl', 'uploading...')
                } else {
                  setValue('fotoUrl', '')
                  setCurrentImage('')
                }
              }}
              label=""
            />
            {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Sobre o funcionário</legend>
          <div className="mt-4">
            <label htmlFor="sobre" className="block mb-2 text-sm font-medium text-gray-800">
              Sobre
            </label>
            <textarea
              {...register("sobre", {
                required: "Descrição é obrigatória",
                maxLength: { value: 500, message: "Descrição deve ter no máximo 500 caracteres" },
                minLength: { value: 10, message: "Descrição deve ter pelo menos 10 caracteres" }
              })}
              id="sobre"
              className={`border rounded-md p-3 w-full focus:outline-hidden focus:ring-2 shadow-xs ${errors.sobre ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
              placeholder="Escreva uma breve descrição sobre a pessoa contratada"
              maxLength={500}
            />
            {errors.sobre && <p className="text-red-500 text-sm mt-1">{errors.sobre.message}</p>}
          </div>
        </fieldset>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <button
            type="submit"
            disabled={uploading}
            className="bg-yellow-400 text-black font-bold rounded-md py-4 px-8 w-full sm:w-auto cursor-pointer hover:bg-yellow-500 focus:outline-hidden focus:ring-4 focus:ring-yellow-300 transition-all duration-200 ease-in-out shadow-md disabled:opacity-50"
          >
            {uploading ? 'Enviando...' : 'Alterar funcionário'}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto cursor-pointer hover:bg-gray-600 focus:outline-hidden focus:ring-4 focus:ring-gray-300 transition-all duration-200 ease-in-out shadow-md"
            onClick={() => {
              reset({
                nome: "",
                email: "",
                telefone: "",
                sobre: "",
                fotoUrl: ""
              })
              setSelectedFile(null)
              setCurrentImage('')
            }}
          >
            Limpar
          </button>
        </div>
      </form>

      <div className="flex justify-start mt-6">
        <Link href="/funcionario">
          <button className="bg-gray-600 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto cursor-pointer hover:bg-gray-700 focus:outline-hidden focus:ring-4 focus:ring-gray-500 transition-all duration-200 ease-in-out shadow-md">
            Voltar
          </button>
        </Link>
      </div>
    </div>
  )
}
