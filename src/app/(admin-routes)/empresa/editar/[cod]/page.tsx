'use client'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import { alerts } from "@/lib/alerts"
import Link from "next/link"
import { TEmpresa } from "@/app/types/index"
import ImageUpload from "@/app/components/ImageUpload"
import { useImageUpload } from "@/app/components/useImageUpload"

export default function AlteracaoEmpresa() {
  const params = useParams()
  const { register, reset, handleSubmit, formState: { errors }, setValue } = useForm<TEmpresa>({
    mode: "onBlur"
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [currentImage, setCurrentImage] = useState<string>('')
  const { uploading, uploadImage, uploadError } = useImageUpload()

  const validateNome = (nome: string) => {
    const nomeRegex = /^[A-Za-zÀ-ú\s]+$/
    if (!nomeRegex.test(nome)) {
      return "Nome não pode conter números ou caracteres especiais"
    }
    return true
  }

  const validateCNPJ = (cnpj: string) => {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '')
    if (cleanCNPJ.length !== 14) {
      return "CNPJ deve ter 14 dígitos"
    }
    return true
  }

  const formatCNPJ = (value: string) => {
    const cleanValue = value.replace(/\D/g, '')
    return cleanValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
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

  useEffect(() => {
    async function getEmpresa() {
      try {
        const response = await fetch("/api/empresa/" + params.cod)
        const dado = await response.json()

        if (response.ok) {
          setCurrentImage(dado.logotipoUrl)
          reset({
            nome: dado.nome,
            cnpj: dado.cnpj,
            email: dado.email,
            senha: dado.senha,
            setor: dado.setor,
            logotipo: dado.logotipoUrl
          })
        } else {
          alerts.error("Não foi possível carregar os dados da empresa")
        }
      } catch (error) {
        alerts.error("Erro ao carregar os dados da empresa")
      }
    }
    getEmpresa()
  }, [])

  async function alteraDados(data: TEmpresa) {
    try {
      let logotipoUrl: string = data.logotipo || currentImage
      let logotipoPublicId: string = ''

      // Validar se há imagem
      if (!logotipoUrl && !selectedFile) {
        alerts.error('Logotipo é obrigatório')
        return
      }

      if (selectedFile) {
        const uploadResult = await uploadImage(selectedFile, 'empresas')
        if (!uploadResult) {
          alerts.error('Erro no upload da imagem')
          return
        }
        logotipoUrl = uploadResult.url
        logotipoPublicId = uploadResult.publicId
      }

      const response = await fetch("/api/empresa/" + params.cod, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          logotipoUrl: logotipoUrl,
          logotipoPublicId: logotipoPublicId
        }),
      })

      if (response.status === 200) {
        alerts.success("Empresa alterada com sucesso!")
      } else {
        const errorData = await response.json()
        alerts.error(errorData.message || 'Erro ao alterar a empresa')
      }
    } catch (error) {
      alerts.error("Erro ao processar a edição. Tente novamente mais tarde.")
    }
  }


  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6 font-bold text-gray-900">Editar informações da empresa</h2>
      <form
        className="grid grid-cols-1 gap-6 max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit(alteraDados)}
      >
        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Informações básicas</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
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
                className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.nome ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'
                  }`}
                placeholder="Digite o nome da empresa"
                maxLength={100}
              />
              {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
            </div>
            <div>
              <label htmlFor="cnpj" className="block mb-2 text-sm font-medium text-gray-800">
                CNPJ
              </label>
              <input
                {...register("cnpj", {
                  required: "CNPJ é obrigatório",
                  validate: validateCNPJ,
                  onChange: (e) => {
                    e.target.value = formatCNPJ(e.target.value)
                  }
                })}
                type="text"
                id="cnpj"
                className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.cnpj ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'
                  }`}
                placeholder="00.000.000/0000-00"
                maxLength={18}
              />
              {errors.cnpj && <p className="text-red-500 text-sm mt-1">{errors.cnpj.message}</p>}
            </div>
            <div>
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
                className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'
                  }`}
                placeholder="Digite o email"
                maxLength={100}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="setor" className="block mb-2 text-sm font-medium text-gray-800">
                Setor
              </label>
              <input
                {...register("setor", {
                  required: "Setor é obrigatório",
                  maxLength: { value: 100, message: "Setor deve ter no máximo 100 caracteres" },
                  minLength: { value: 2, message: "Setor deve ter pelo menos 2 caracteres" }
                })}
                type="text"
                id="setor"
                className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.setor ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'
                  }`}
                placeholder="Setor de atuação da empresa"
                maxLength={100}
              />
              {errors.setor && <p className="text-red-500 text-sm mt-1">{errors.setor.message}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-bold text-gray-700 px-2">Logotipo</legend>
          <div className="mt-4">
            <ImageUpload
              currentImage={currentImage}
              onImageChange={(file) => {
                setSelectedFile(file)
                if (file) {
                  setValue('logotipo', 'uploading...')
                } else {
                  setValue('logotipo', '')
                  setCurrentImage('')
                }
              }}
              label=""
            />
            {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
          </div>
        </fieldset>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <button
            type="submit"
            disabled={uploading}
            className="bg-yellow-400 text-black font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-200 ease-in-out shadow-md disabled:opacity-50"
          >
            {uploading ? 'Enviando...' : 'Alterar empresa'}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 ease-in-out shadow-md"
            onClick={() => {
              reset({
                nome: "",
                cnpj: "",
                email: "",
                senha: "",
                setor: "",
                logotipo: "",
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
        <Link href="/empresa">
          <button className="bg-gray-600 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 transition-all duration-200 ease-in-out shadow-md">
            Voltar
          </button>
        </Link>
      </div>
    </div>
  )
}