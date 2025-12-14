'use client'
import { useEffect, useState } from "react"
import { toast } from 'sonner'

type Contratados = {
  id: number
  nome: string
  email: string
  senha: string
  atuacao: string
  dtnasc: Date
  sobre: string
  foto: string
}

type Empresas = {
  cod: number
  cnpj: string
  nome: string
  email: string
  senha: string
  atuacao: string
  logotipo: string
}

type Serviços = {
  cod: number
  nome: string
  descricao: string
  foto: string
}

export default function Listagem() {
  const [contratados, setContratados] = useState<Contratados[]>([])
  const [empresas, setEmpresas] = useState<Empresas[]>([])
  const [servicos, setServicos] = useState<any[]>([])

  useEffect(() => {
    async function fetchContratados() {
      try {
        const response = await fetch("http://localhost:3004/contratados")
        if (response.ok) {
          const data = await response.json()
          setContratados(data)
        } else {
          toast.error("Erro ao carregar os contratados.")
        }
      } catch (error) {
        toast.error("Erro ao carregar os contratados.")
      }
    }

    async function fetchEmpresas() {
      try {
        const response = await fetch("http://localhost:3004/empresas")
        if (response.ok) {
          const data = await response.json()
          setEmpresas(data)
        } else {
          toast.error("Erro ao carregar as empresas.")
        }
      } catch (error) {
        toast.error("Erro ao carregar as empresas.")
      }
    }

    async function fetchServicos() {
      try {
        const response = await fetch("http://localhost:3004/servicos")
        if (response.ok) {
          const data = await response.json()
          setServicos(data)
        } else {
          toast.error("Erro ao carregar os serviços.")
        }
      } catch (error) {
        toast.error("Erro ao carregar os serviços.")
      }
    }

    fetchContratados()
    fetchEmpresas()
    fetchServicos()
  }, [])

  return (
    <main className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Listagem de Empresas</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold">Contratados</h2>
        <ul className="list-disc list-inside mt-2">
          {contratados.map(contr => (
            <li key={contr.id}>
              {contr.nome} - {contr.email}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Empresas</h2>
        <ul className="list-disc list-inside mt-2">
          {empresas.map(empresa => (
            <li key={empresa.cod}>
              {empresa.nome} - {empresa.email}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Serviços</h2>
        <ul className="list-disc list-inside mt-2">
          {servicos.map(servico => (
            <li key={servico.cod}>
              {servico.nome} - {servico.descricao}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
