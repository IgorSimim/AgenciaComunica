'use client'
import React, { useEffect, useState } from 'react'
import { Chart } from 'react-google-charts'
import { useForm } from 'react-hook-form'

interface EmpresaAtuacaoType {
  atuacao: string
  totalEmpresas: number
}

interface ContratadoAtuacaoType {
  atuacao: string
  totalContratados: number
}

interface GeralType {
  empresas: number
  contratados: number
  servicos: number
}

const Home: React.FC = () => {
  const [dadosEmpresas, setDadosEmpresas] = useState<(string | number)[][]>([['Área de Atuação', 'Empresas']])
  const [dadosContratados, setDadosContratados] = useState<(string | number)[][]>([['Área de Atuação', 'Contratados']])
  const [coresEmpresas, setCoresEmpresas] = useState<string[]>([])
  const [coresContratados, setCoresContratados] = useState<string[]>([])
  const [geral, setGeral] = useState<GeralType>({ empresas: 0, contratados: 0, servicos: 0 })
  const { setFocus } = useForm()

  function generateRandomColor() {
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#E74C3C', '#3498DB', '#1ABC9C', '#9B59B6'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  async function fetchDados(
    url: string,
    setDados: React.Dispatch<React.SetStateAction<(string | number)[][]>>,
    titulo: string,
    setCores: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Erro ao buscar dados de ${titulo}`)

      const dados = await response.json()
      const formattedData: (string | number)[][] = [[titulo, 'Quantidade']]
      const cores: string[] = []

      dados.forEach((item: EmpresaAtuacaoType | ContratadoAtuacaoType) => {
        if (item.atuacao && typeof item.atuacao === 'string') {
          const total = 'totalEmpresas' in item ? (item as EmpresaAtuacaoType).totalEmpresas : (item as ContratadoAtuacaoType).totalContratados
          if (total) {
            formattedData.push([item.atuacao, total])
            cores.push(generateRandomColor())
          }
        }
      })

      setDados(formattedData)
      setCores(cores)
    } catch (error) {
      console.error(`Erro ao buscar dados de ${titulo}:`, error)
    }
  }

  useEffect(() => {
    async function getDadosGerais() {
      try {
        const response = await fetch('/api/dadosgerais')
        if (!response.ok) throw new Error(`Erro ao buscar dados gerais: ${response.statusText}`)
        const dados = await response.json()
        setGeral(dados)
      } catch (error) {
        console.error('Erro ao buscar dados gerais:', error)
      }
    }

    fetchDados('/api/empresa/atuacao', setDadosEmpresas, 'Área de Atuação', setCoresEmpresas)
    fetchDados('/api/contratado/atuacao', setDadosContratados, 'Área de Atuação', setCoresContratados)
    getDadosGerais()
    setFocus('nome')
  }, [setFocus])

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Visão geral do sistema</h2>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="shadow-lg p-6 rounded-lg border border-green-200 bg-green-50 text-center">
          <h3 className="text-5xl font-bold text-green-600">{geral.servicos}</h3>
          <p className="text-lg font-medium mt-2">Serviços oferecidos</p>
        </div>
        <div className="shadow-lg p-6 rounded-lg border border-blue-200 bg-blue-50 text-center">
          <h3 className="text-5xl font-bold text-blue-600">{geral.empresas}</h3>
          <p className="text-lg font-medium mt-2">Empresas cadastradas</p>
        </div>
        <div className="shadow-lg p-6 rounded-lg border border-red-200 bg-red-50 text-center">
          <h3 className="text-5xl font-bold text-red-600">{geral.contratados}</h3>
          <p className="text-lg font-medium mt-2">Funcionários cadastrados</p>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-700 mt-6 mb-4 text-center">Distribuição das empresas por área de atuação</h3>
      <div className="shadow-lg p-4 rounded-lg border border-gray-200 bg-white">
        {/* <Chart
          chartType="BarChart"
          width="100%"
          height="400px"
          data={dadosEmpresas}
          options={{
            title: 'Distribuição das empresas por área de atuação',
            chartArea: { width: '60%' },
            hAxis: {
              title: 'Empresas cadastradas',
              textStyle: { fontSize: 14 },
              format: '0',
            },
            vAxis: {
              title: 'Área de atuação',
              textStyle: { fontSize: 14 },
            },
            legend: { position: 'none' },
            bars: 'horizontal',
            axes: {
              x: {
                0: { side: 'top', label: 'Porcentagem' }
              }
            },
            bar: { groupWidth: "90%" },
            colors: coresEmpresas,
          }}
        /> */}
      </div>

      <h3 className="text-2xl font-bold text-gray-700 mt-6 mb-4 text-center">Distribuição dos funcionários por área de atuação</h3>
      <div className="shadow-lg p-4 rounded-lg border border-gray-200 bg-white">
        {/* <Chart
          chartType="BarChart"
          width="100%"
          height="400px"
          data={dadosContratados}
          options={{
            title: 'Distribuição dos funcionários por área de atuação',
            chartArea: { width: '60%' },
            hAxis: {
              title: 'Funcionários cadastrados',
              textStyle: { fontSize: 14 },
              format: '0',
            },
            vAxis: {
              title: 'Área de atuação',
              textStyle: { fontSize: 14 },
            },
            legend: { position: 'none' },
            bars: 'horizontal',
            axes: {
              x: {
                0: { side: 'top', label: 'Porcentagem' }
              }
            },
            bar: { groupWidth: "70%" },
            colors: coresContratados,
          }}
        /> */}
      </div>
    </div>
  )
}

export default Home
