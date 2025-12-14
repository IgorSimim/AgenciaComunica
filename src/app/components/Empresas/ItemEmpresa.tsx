'use client'
import { empresaProps } from "@/app/(admin)/cadempresa/page"
import { Dispatch, SetStateAction } from "react"
import { HiOutlineXCircle, HiOutlinePencilAlt, HiOutlineEye } from "react-icons/hi"
import Swal from 'sweetalert2'
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

interface listaEmpresaProps {
  empresa: empresaProps,
  empresas: empresaProps[],
  setEmpresas: Dispatch<SetStateAction<empresaProps[]>>
}

function ItemEmpresa({ empresa, empresas, setEmpresas }: listaEmpresaProps) {
  const router = useRouter()

  async function excluirEmpresa() {
    const result = await Swal.fire({
      title: empresa.nome,
      text: `Confirmar a exclusão da empresa ${empresa.nome}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      const response = await fetch(`http://localhost:3004/empresas/${empresa.cod}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + (Cookies.get("contr_logado_token") as string),
        },
      })

      if (response.status == 200) {
        const empresas2 = empresas.filter((x) => x.cod != empresa.cod)
        setEmpresas(empresas2)

        Swal.fire({
          title: "Empresa Excluída com sucesso",
          text: empresa.nome,
          icon: "success",
        })
      } else {
        Swal.fire({
          title: "Erro... Empresa não excluída",
          text: "Pode haver comentários para esta empresa",
          icon: "error",
        })
      }
    }
  }

  function alteraEmpresa() {
    router.push(`alteraempresa/${empresa.cod}`)
  }

  function consultaEmpresa() {
    router.push(`consultaempresa/${empresa.cod}`)
  }


  return (
    <tr
      key={empresa.cod}
      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
    >
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        <img
          src={empresa.logotipo}
          alt="Logotipo da empresa"
          className="w-20 h-20 object-contain rounded-lg"
        />
      </th>
      <td className="px-6 py-4">{empresa.nome}</td>
      <td className="px-6 py-4">{empresa.atuacao}</td>
      <td className="px-6 py-4">{empresa.email}</td>
      <td className="px-6 py-4">
        <HiOutlineEye
          className="text-3xl text-blue-700 inline-block cursor-pointer hover:text-blue-700 transition-colors"
          title="Consulta"
          onClick={consultaEmpresa}
        />
        <HiOutlinePencilAlt
          className="text-3xl text-yellow-500 inline-block cursor-pointer hover:text-yellow-700 transition-colors"
          title="Alteração"
          onClick={alteraEmpresa}
        />
        <HiOutlineXCircle
          className="text-3xl text-red-600 inline-block cursor-pointer hover:text-red-800 transition-colors"
          title="Excluir"
          onClick={excluirEmpresa}
        />
      </td>
    </tr>
  )
}

export default ItemEmpresa
