'use client'
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import { alerts } from "@/lib/alerts"
import Link from "next/link"
import { TServico } from "@/app/types/index"

export default function AlteracaoServico() {
    const params = useParams()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<TServico>({
        mode: "onBlur"
    })

    const validateNome = (nome: string) => {
        const nomeRegex = /^[A-Za-zÀ-ú\s]+$/
        if (!nomeRegex.test(nome)) {
            return "Nome não pode conter números ou caracteres especiais"
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
                    alerts.error("Não foi possível carregar os dados do serviço")
                }
            } catch (error) {
                alerts.error("Erro ao carregar os dados do serviço")
            }
        }
        getServico()
    }, [])

    async function alteraDados(data: TServico) {
        try {
            const response = await fetch("/api/servico/" + params.cod, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data }),
            })

            if (response.status === 200) {
                alerts.success("Serviço alterado com sucesso!")
            } else {
                const errorData = await response.json()
                alerts.error(errorData.message || "Erro ao alterar o serviço")
            }
        } catch (error) {
            console.error("Erro ao processar a alteração:", error)
            alerts.error("Erro ao processar a alteração. Tente novamente mais tarde.")
        }
    }


    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl mb-6 font-bold text-gray-900">Alteração das informações do serviço</h2>
            <form
                className="grid grid-cols-1 gap-6 max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg"
                onSubmit={handleSubmit(alteraDados)}
            >
                <fieldset className="border border-gray-300 rounded-md p-4">
                    <legend className="text-lg font-bold text-gray-700 px-2">Informações básicas</legend>
                    <div className="mt-4">
                        <div className="w-full mb-4">
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
                                className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.nome ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
                                placeholder="Digite o nome do serviço"
                                maxLength={100}
                            />
                            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
                        </div>

                        <div className="w-full mb-4">
                            <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-800">
                                Descrição
                            </label>
                            <textarea
                                {...register("descricao", {
                                    required: "Descrição é obrigatória",
                                    maxLength: { value: 500, message: "Descrição deve ter no máximo 500 caracteres" },
                                    minLength: { value: 10, message: "Descrição deve ter pelo menos 10 caracteres" }
                                })}
                                id="descricao"
                                className={`border rounded-md p-3 w-full h-32 focus:outline-none focus:ring-2 shadow-sm ${errors.descricao ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
                                placeholder="Digite a descrição do serviço"
                                maxLength={500}
                            />
                            {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>}
                        </div>

                        <div className="w-full mb-4">
                            <label htmlFor="preco" className="block mb-2 text-sm font-medium text-gray-800">
                                Preço
                            </label>
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
                                className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.preco ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
                                placeholder="Digite o preço do serviço"
                            />
                            {errors.preco && <p className="text-red-500 text-sm mt-1">{errors.preco.message}</p>}
                        </div>
                    </div>
                </fieldset>

                <fieldset className="border border-gray-300 rounded-md p-4">
                    <legend className="text-lg font-bold text-gray-700 px-2">Símbolo</legend>
                    <div className="mt-4">
                        <label htmlFor="simbolo" className="block mb-2 text-sm font-medium text-gray-800">
                            URL do símbolo
                        </label>
                        <input
                            {...register("simbolo", {
                                required: "URL do símbolo é obrigatória",
                                validate: validateURL
                            })}
                            type="url"
                            id="simbolo"
                            className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 shadow-sm ${errors.simbolo ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'}`}
                            placeholder="Insira a URL do símbolo"
                            maxLength={255}
                        />
                        {errors.simbolo && <p className="text-red-500 text-sm mt-1">{errors.simbolo.message}</p>}
                    </div>
                </fieldset>

                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <button
                        type="submit"
                        className="bg-yellow-400 text-black font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-200 ease-in-out shadow-md"
                    >
                        Alterar serviço
                    </button>
                    <button
                        type="button"
                        className="bg-gray-500 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 ease-in-out shadow-md"
                        onClick={() =>
                            reset({
                                nome: "",
                                descricao: "",
                                simbolo: "",
                                preco: 0
                            })
                        }
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
