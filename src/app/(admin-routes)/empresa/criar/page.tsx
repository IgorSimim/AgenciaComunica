'use client'
import { useForm } from "react-hook-form"
import { alerts } from "@/lib/alerts"
import Link from "next/link"
import { TEmpresa } from "@/app/types/index"
import ImageUpload, { ImageUploadRef } from "@/app/components/ImageUpload"
import { useImageUpload } from "@/app/components/useImageUpload"
import { useState, useRef } from "react"

export default function CriarEmpresa() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TEmpresa>({
    mode: "onBlur"
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { uploading, uploadImage, uploadError } = useImageUpload()
  const imageUploadRef = useRef<ImageUploadRef>(null)

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

  const validateSenha = (senha: string) => {
    const senhaRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/

    if (!senhaRegex.test(senha)) {
      return "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais"
    }
    return true
  }

  async function criarEmpresa(data: TEmpresa) {
    // Validar se há imagem selecionada
    if (!selectedFile) {
      alerts.error('Logotipo é obrigatório')
      return
    }
    
    // Fazer upload da imagem
    const uploadedUrl = await uploadImage(selectedFile, 'empresas')
    if (!uploadedUrl) {
      alerts.error('Erro no upload da imagem')
      return
    }

    const novaEmpresa = {
      nome: data.nome,
      cnpj: data.cnpj,
      email: data.email,
      senha: data.senha,
      setor: data.setor,
      logotipo: uploadedUrl
    }

    try {
      const response = await fetch("/api/empresa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaEmpresa),
      })
      
      if (response.status === 201 || response.status === 200) {
        alerts.success("Empresa criada com sucesso!")
        reset()
        setSelectedFile(null)
        imageUploadRef.current?.clearImage()
      } else {
        const errorData = await response.json()
        alerts.error(errorData.message || 'Erro ao criar a empresa')
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
      alerts.error("Erro ao processar a criação. Tente novamente mais tarde.")
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6 font-bold text-gray-900">Criar nova empresa</h2>
      <form
        className="grid grid-cols-1 gap-6 max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit(criarEmpresa)}
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
                className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.nome ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'
                  }`}
                placeholder="Digite o nome da empresa"
              />
              {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
            </div>
            <div>
              <label htmlFor="cnpj" className="block mb-2 text-sm font-medium text-gray-800">CNPJ</label>
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
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-800">Email</label>
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
              <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-800">Senha</label>
              <input
                {...register("senha", {
                  required: "Senha é obrigatória",
                  minLength: { value: 8, message: "Senha deve ter pelo menos 8 caracteres" },
                  maxLength: { value: 100, message: "Senha deve ter no máximo 100 caracteres" },
                  validate: validateSenha
                })}
                type="TEXT"
                id="senha"
                className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.senha ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'
                  }`}
                placeholder="Digite a senha (mín. 8 caracteres)"
                maxLength={100}
              />
              {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>}
            </div>
            <div>
              <label htmlFor="setor" className="block mb-2 text-sm font-medium text-gray-800">Setor</label>
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
              ref={imageUploadRef}
              currentImage=""
              onImageChange={setSelectedFile}
              label=""
            />
            {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
          </div>
        </fieldset>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <button type="submit" disabled={uploading} className="bg-yellow-400 text-black font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-200 ease-in-out shadow-md disabled:opacity-50">
            {uploading ? 'Enviando...' : 'Cadastrar empresa'}
          </button>
          <button type="button" className="bg-gray-500 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 ease-in-out shadow-md" onClick={() => reset()}>
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