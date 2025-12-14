'use client'
import { servicoProps } from "@/app/(admin)/cadservico/page"
import { Dispatch, SetStateAction } from "react"
import { HiOutlineXCircle, HiOutlinePencilAlt, HiOutlineEye } from "react-icons/hi"
import Swal from 'sweetalert2'
import { useRouter } from "next/navigation"

interface listaServicoProps {
    servico: servicoProps,
    servicos: servicoProps[],
    setServicos: Dispatch<SetStateAction<servicoProps[]>>
}

function ItemServico({ servico, servicos, setServicos }: listaServicoProps) {
    const router = useRouter()

    async function excluirServico() {

        const result = await Swal.fire({
            title: servico.nome,
            text: `Confirmar a exclusão do serviço ${servico.nome}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar"
        })

        if (result.isConfirmed) {

            const response = await fetch(`http://localhost:3004/servicos/${servico.cod}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json"
                    },
                },
            )

            if (response.status == 200) {
                const servicos2 = servicos.filter(x => x.cod != servico.cod)
                setServicos(servicos2)

                Swal.fire({
                    title: "Serviço excluído com sucesso",
                    text: servico.nome,
                    icon: "success"
                })
            } else {
                Swal.fire({
                    title: "Erro... Serviço não excluído",
                    text: "Pode haver comentários para este serviço",
                    icon: "error"
                })
            }
        }
    }

    function alteraServico() {
        router.push(`alteraservico/${servico.cod}`)
    }

    function consultaServico() {
        router.push(`consultaservico/${servico.cod}`)
    }

    return (
        <tr
            key={servico.cod}
            className="odd:bg-gray-100 odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700"
        >
            <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
                <img
                    src={servico.foto}
                    alt="Foto do serviço"
                    className="w-20 h-20 sm:w-16 sm:h-16 object-contain"
                />
            </th>
            <td className="px-6 py-4">{servico.nome}</td>
            <td className="px-6 py-4">{servico.descricao}</td>
            <td className="px-6 py-4 flex">
                <HiOutlineEye
                    className="text-3xl text-blue-700 cursor-pointer hover:text-blue-700 transition-colors"
                    title="Consulta"
                    onClick={consultaServico}
                />
                <HiOutlinePencilAlt
                    className="text-3xl text-yellow-500 cursor-pointer hover:text-yellow-700 transition-colors"
                    title="Alteração"
                    onClick={alteraServico}
                />
                <HiOutlineXCircle
                    className="text-3xl text-red-600 cursor-pointer hover:text-red-800 transition-colors"
                    title="Excluir"
                    onClick={excluirServico}
                />
            </td>
        </tr>
    )
}

export default ItemServico