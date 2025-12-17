'use client'
import React, { useEffect, useState } from 'react'
import { Chart } from 'react-google-charts'
import { useForm } from 'react-hook-form'
import { DashboardType } from '@/app/types/index'

const Home: React.FC = () => {
  const [dadosEmpresas, setDadosEmpresas] = useState<(string | number)[][]>([['Área de Atuação', 'Empresas']])
  const [dadosContratados, setDadosContratados] = useState<(string | number)[][]>([['Área de Atuação', 'Contratados']])
  const [coresEmpresas, setCoresEmpresas] = useState<string[]>([])
  const [coresContratados, setCoresContratados] = useState<string[]>([])
  const [geral, setGeral] = useState<DashboardType>({ empresas: 0, contratados: 0, servicos: 0 })
  const { setFocus } = useForm()

  function generateRandomColor() {
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#E74C3C', '#3498DB', '#1ABC9C', '#9B59B6'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  useEffect(() => {
    async function getDadosGerais() {
      try {
        const [empresasRes, contratadosRes, servicosRes] = await Promise.all([
          fetch('/api/empresa'),
          fetch('/api/contratado'),
          fetch('/api/servico')
        ])

        const empresas = empresasRes.ok ? await empresasRes.json() : []
        const contratados = contratadosRes.ok ? await contratadosRes.json() : []
        const servicosData = servicosRes.ok ? await servicosRes.json() : { servicos: [] }

        setGeral({
          empresas: Array.isArray(empresas) ? empresas.filter(e => e.ativa !== false).length : 0,
          contratados: Array.isArray(contratados) ? contratados.length : 0,
          servicos: Array.isArray(servicosData.servicos) ? servicosData.servicos.length : 0
        })

        if (Array.isArray(empresas)) {
          const empresasAtivas = empresas.filter(e => e.ativa !== false)
          const setorCount = empresasAtivas.reduce((acc, emp) => {
            acc[emp.setor] = (acc[emp.setor] || 0) + 1
            return acc
          }, {})

          const dadosEmpresasFormatted: (string | number)[][] = [['Setor', 'Empresas']]
          const coresEmp: string[] = []
          Object.entries(setorCount).forEach(([setor, count]) => {
            dadosEmpresasFormatted.push([setor, count as number])
            coresEmp.push(generateRandomColor())
          })
          setDadosEmpresas(dadosEmpresasFormatted)
          setCoresEmpresas(coresEmp)
        }

        if (Array.isArray(contratados)) {
          const cargoCount = contratados.reduce((acc, cont) => {
            acc[cont.cargo] = (acc[cont.cargo] || 0) + 1
            return acc
          }, {})

          const dadosContratadosFormatted: (string | number)[][] = [['Cargo', 'Contratados']]
          const coresCont: string[] = []
          Object.entries(cargoCount).forEach(([cargo, count]) => {
            dadosContratadosFormatted.push([cargo, count as number])
            coresCont.push(generateRandomColor())
          })
          setDadosContratados(dadosContratadosFormatted)
          setCoresContratados(coresCont)
        }

      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      }
    }

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
          <p className="text-lg font-medium mt-2">Empresas ativas</p>
        </div>
        <div className="shadow-lg p-6 rounded-lg border border-red-200 bg-red-50 text-center">
          <h3 className="text-5xl font-bold text-red-600">{geral.contratados}</h3>
          <p className="text-lg font-medium mt-2">Funcionários ativos</p>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-700 mt-6 mb-4 text-center">Distribuição das empresas por área de atuação</h3>
      <div className="shadow-lg p-4 rounded-lg border border-gray-200 bg-white">
        <Chart
          chartType="BarChart"
          width="100%"
          height="400px"
          data={dadosEmpresas}
          options={{
            title: 'Distribuição das empresas por setor',
            chartArea: { width: '60%' },
            hAxis: {
              title: 'Empresas ativas',
              textStyle: { fontSize: 14 },
              format: '0',
            },
            vAxis: {
              title: 'Setor',
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
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-700 mt-6 mb-4 text-center">Distribuição dos funcionários por área de atuação</h3>
      <div className="shadow-lg p-4 rounded-lg border border-gray-200 bg-white">
        <Chart
          chartType="BarChart"
          width="100%"
          height="400px"
          data={dadosContratados}
          options={{
            title: 'Distribuição dos funcionários por cargo',
            chartArea: { width: '60%' },
            hAxis: {
              title: 'Funcionários ativos',
              textStyle: { fontSize: 14 },
              format: '0',
            },
            vAxis: {
              title: 'Cargo',
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
        />
      </div>
    </div>
  )
}

export default Home
