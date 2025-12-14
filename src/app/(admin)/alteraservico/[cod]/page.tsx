'use client'
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

type Inputs = {
    nome: string
    descricao: string
    foto: string
}

export default function AlteracaoServico() {
    const params = useParams()
    const { register, handleSubmit, reset } = useForm<Inputs>()

    useEffect(() => {
        async function getServico() {
            try {
                const response = await fetch("http://localhost:3004/servicos/pesq/" + params.cod)
                const dado = await response.json()

                if (response.ok) {
                    reset({
                        nome: dado.nome,
                        descricao: dado.descricao,
                        foto: dado.foto
                    })
                } else {
                    toast.error("Não foi possível carregar os dados do serviço")
                }
            } catch (error) {
                toast.error("Erro ao carregar os dados do serviço")
            }
        }
        getServico()
    }, [])

    async function alteraDados(data: Inputs) {
        try {
            const response = await fetch("http://localhost:3004/servicos/" + params.cod, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data }),
            })

            if (response.status === 200) {
                toast.success("Serviço alterado com sucesso!")
            } else {
                const errorData = await response.json()

                if (errorData.id === 6) {
                    toast.error("A URL da foto fornecida não é válida.")
                } else {
                    toast.error(`Erro ao alterar o serviço: ${errorData.msg || 'Tente novamente.'}`)
                }
            }
        } catch (error) {
            console.error("Erro ao processar a alteração:", error)
            toast.error("Erro ao processar a alteração. Tente novamente mais tarde.")
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
                                Nome do serviço
                            </label>
                            <input
                                {...register("nome")}
                                type="text"
                                id="nome"
                                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                                placeholder="Digite o nome do serviço"
                                required
                            />
                        </div>

                        <div className="w-full mb-4">
                            <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-800">
                                Descrição
                            </label>
                            <textarea
                                {...register("descricao")}
                                id="descricao"
                                className="border border-gray-300 rounded-md p-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                                placeholder="Digite a descrição do serviço"
                                required
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Foto */}
                <fieldset className="border border-gray-300 rounded-md p-4">
                    <legend className="text-lg font-bold text-gray-700 px-2">Foto</legend>
                    <div className="mt-4">
                        <label htmlFor="foto" className="block mb-2 text-sm font-medium text-gray-800">
                            URL da foto
                        </label>
                        <input
                            {...register("foto")}
                            type="url"
                            id="foto"
                            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                            placeholder="Insira a URL da foto"
                            required
                        />
                    </div>
                </fieldset>

                {/* Ações */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <button
                        type="submit"
                        className="bg-yellow-400 text-black font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-200 ease-in-out shadow-md"
                    >
                        Alterar Serviço
                    </button>
                    <button
                        type="button"
                        className="bg-gray-500 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 ease-in-out shadow-md"
                        onClick={() =>
                            reset({
                                nome: "",
                                descricao: "",
                                foto: "",
                            })
                        }
                    >
                        Limpar
                    </button>
                </div>
            </form>

            <div className="flex justify-start mt-6">
                <Link href="/principal/cadservico">
                    <button className="bg-gray-600 text-white font-bold rounded-md py-4 px-8 w-full sm:w-auto hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 transition-all duration-200 ease-in-out shadow-md">
                        Voltar
                    </button>
                </Link>
            </div>
        </div>
    )
}
