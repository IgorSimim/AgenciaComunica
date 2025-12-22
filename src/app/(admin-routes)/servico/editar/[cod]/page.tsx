'use client'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import { alerts } from "@/lib/alerts"
import Link from "next/link"
import { TServico } from "@/app/types/index"
import ImageUpload from "@/app/components/ImageUpload"
import { useImageUpload } from "@/app/components/useImageUpload"

const validateNome = (nome: string) => {
    const nomeRegex = /^[A-Za-zÀ-ú\s]+$/
    if (!nomeRegex.test(nome)) {
        return "Nome não pode conter números ou caracteres especiais"
    }
    return true
}

export default function AlteracaoServico() {
    const params = useParams()
    const { register, handleSubmit, reset, watch, formState: { errors }, setValue } = useForm<TServico>({
        mode: "onBlur"
    })

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [currentImage, setCurrentImage] = useState<string>('')
    const { uploading, uploadImage, uploadError } = useImageUpload()

    useEffect(() => {
        async function getServico() {
            try {
                const response = await fetch("/api/servico/" + params.cod)
                const dado = await response.json()

                if (response.ok) {
                    setCurrentImage(dado.simboloUrl)
                    reset({
                        nome: dado.nome,
                        descricao: dado.descricao,
                        simboloUrl: dado.simboloUrl,
                        preco: dado.preco
                    })
                    setCurrentImage(dado.simboloUrl)
                } else {
                    alerts.error("Não foi possível carregar os dados do serviço")
                }
            } catch (error) {
                alerts.error("Erro ao carregar os dados do serviço")
            }
        }
        getServico()
    }, [params.cod, reset])

    async function alteraDados(data: TServico) {
        try {
            let simboloUrl = data.simboloUrl || currentImage
            let simboloPublicId: string = ''

            // Validar se há imagem
            if (!simboloUrl && !selectedFile) {
                alerts.error('Símbolo é obrigatório')
                return
            }

            // Se há uma nova imagem selecionada, fazer upload
            if (selectedFile) {
                const uploadResult = await uploadImage(selectedFile, 'servicos')
                if (!uploadResult) {
                    alerts.error('Erro no upload da imagem')
                    return
                }
                simboloUrl = uploadResult.url
                simboloPublicId = uploadResult.publicId
            }
            const response = await fetch("/api/servico/" + params.cod, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    simboloUrl: simboloUrl,
                    simboloPublicId: simboloPublicId
                }),
            })

            if (response.status === 200) {
                alerts.success("Serviço alterado com sucesso!")
            } else {
                const errorData = await response.json()
                alerts.error(errorData.message || "Erro ao alterar o serviço")
            }
        } catch (error) {
            alerts.error("Erro ao processar a edição. Tente novamente mais tarde.")
        }
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl mb-6 font-bold text-gray-900">Editar informações do serviço</h2>

            <form
                className="grid grid-cols-1 gap-6 max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg"
                onSubmit={handleSubmit(alteraDados)}
            >
                <fieldset className="border border-gray-300 rounded-md p-4">
                    <legend className="text-lg font-bold text-gray-700 px-2">Informações básicas</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                        <div className="sm:col-span-1">
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
                                placeholder="Digite o nome do serviço"
                                maxLength={100}
                            />
                            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="preco" className="block mb-2 text-sm font-medium text-gray-800">Preço</label>
                            <input
                                {...register("preco", {
                                    required: "Preço é obrigatório",
                                    valueAsNumber: true,
                                    min: { value: 0.01, message: "Preço deve ser maior que zero" },
                                    max: { value: 999999.99, message: "Preço deve ser menor que R$ 999.999,99" }
                                })}
                                type="number"
                                step="0.01"
                                min="0"
                                id="preco"
                                className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.preco ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'
                                    }`}
                                placeholder="Digite o preço do serviço"
                            />
                            {errors.preco && <p className="text-red-500 text-sm mt-1">{errors.preco.message}</p>}
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-800">Descrição</label>
                            <textarea
                                {...register("descricao", {
                                    required: "Descrição é obrigatória",
                                    maxLength: { value: 500, message: "Descrição deve ter no máximo 500 caracteres" },
                                    minLength: { value: 10, message: "Descrição deve ter pelo menos 10 caracteres" }
                                })}
                                id="descricao"
                                className={`border rounded-md p-3 w-full h-40 focus:outline-none focus:ring-2 shadow-sm ${errors.descricao ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'
                                    }`}
                                placeholder="Digite a descrição do serviço"
                                maxLength={500}
                            />
                            {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>}
                        </div>
                    </div>
                </fieldset>

                <fieldset className="border border-gray-300 rounded-md p-4">
                    <legend className="text-lg font-bold text-gray-700 px-2">Símbolo</legend>
                    <div className="mt-4">
                        <ImageUpload
                            currentImage={currentImage}
                            onImageChange={(file) => {
                                setSelectedFile(file)
                                if (file) {
                                    setValue('simboloUrl', 'uploading...')
                                } else {
                                    setValue('simboloUrl', '')
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
                        {uploading ? 'Enviando...' : 'Alterar serviço'}
                    </button>
                    <button
                        type="button"
                        className="bg-gray-500 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 ease-in-out shadow-md"
                        onClick={() => {
                            reset({
                                nome: "",
                                descricao: "",
                                simboloUrl: "",
                                preco: 0
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
                <Link href="/servico">
                    <button className="bg-gray-600 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 transition-all duration-200 ease-in-out shadow-md">
                        Voltar
                    </button>
                </Link>
            </div>
        </div>
    )
}