'use client'
import { contratadoProps } from "@/app/(admin)/admin/page"
import { Dispatch, SetStateAction } from "react"
import { HiOutlineXCircle, HiOutlineEye, HiOutlinePencilAlt } from "react-icons/hi"
import Swal from 'sweetalert2'
import { useRouter } from "next/navigation"

interface listaContratadoProps {
  contratado: contratadoProps,
  contratados: contratadoProps[],
  setContratados: Dispatch<SetStateAction<contratadoProps[]>>
}

function ItemContratado({ contratado, contratados, setContratados }: listaContratadoProps) {
  const router = useRouter()

  async function excluirContratado() {

    const result = await Swal.fire({
      title: contratado.nome,
      text: `Confirmar a Exclusão do ${contratado.nome}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar"
    })

    if (result.isConfirmed) {

      const response = await fetch(`http://localhost:3004/contratados/${contratado.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        },
      )

      if (response.status == 200) {
        const contratados2 = contratados.filter(x => x.id != contratado.id)
        setContratados(contratados2)

        Swal.fire({
          title: "Funcionário Excluído com Sucesso",
          text: contratado.nome,
          icon: "success"
        })
      } else {
        Swal.fire({
          title: "Erro... Funcionário Não Excluído",
          text: "Pode haver comentários para este funcionário",
          icon: "error"
        })
      }
    }
  }


  function alteraContratado() {
    router.push(`alteracontratado/${contratado.id}`)
  }

  function consultaContratado() {
    router.push(`consultacontratado/${contratado.id}`)
  }

  return (
    <tr
      key={contratado.id}
      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
    >
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        <img
          src={contratado.foto}
          alt="Foto do Funcionário"
          className="w-25 h-24 object-cover rounded-lg"
        />
      </th>
      <td className="px-6 py-4">{contratado.nome}</td>
      <td className="px-6 py-4">{contratado.atuacao}</td>
      <td className="px-6 py-4">{contratado.email}</td>
      <td className="px-6 py-4">
        <HiOutlineEye
          className="text-3xl text-blue-700 inline-block cursor-pointer hover:text-blue-700 transition-colors"
          title="Consulta"
          onClick={consultaContratado}
        />
        <HiOutlinePencilAlt
          className="text-3xl text-yellow-500 inline-block cursor-pointer hover:text-yellow-700 transition-colors"
          title="Alteração"
          onClick={alteraContratado}
        />
        <HiOutlineXCircle
          className="text-3xl text-red-600 inline-block cursor-pointer hover:text-red-800 transition-colors"
          title="Excluir"
          onClick={excluirContratado}
        />
      </td>
    </tr>

  )
}

export default ItemContratado