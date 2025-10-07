'use client'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="container mx-auto">
        {/* Título da tela */}
        <h1 className="text-4xl font-semibold text-white text-center mb-8">
          Quadro de entregas
        </h1>

        <div className="flex space-x-8">
          {/* Coluna "A Fazer" */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-1/3">
            <h2 className="text-xl font-semibold text-white mb-4">A Fazer</h2>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-md text-white">Tarefa 1</div>
              <div className="bg-gray-700 p-4 rounded-md text-white">Tarefa 2</div>
              <div className="bg-gray-700 p-4 rounded-md text-white">Tarefa 3</div>
            </div>
          </div>

          {/* Coluna "Em Andamento" */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-1/3">
            <h2 className="text-xl font-semibold text-white mb-4">Em Andamento</h2>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-md text-white">Tarefa 4</div>
              <div className="bg-gray-700 p-4 rounded-md text-white">Tarefa 5</div>
            </div>
          </div>

          {/* Coluna "Finalizado" */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-1/3">
            <h2 className="text-xl font-semibold text-white mb-4">Finalizado</h2>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-md text-white">Tarefa 6</div>
              <div className="bg-gray-700 p-4 rounded-md text-white">Tarefa 7</div>
            </div>
          </div>
        </div>

        {/* Adicionar nova tarefa */}
        <div className="flex justify-center mt-8">
          <button className="bg-blue-600 text-white px-10 py-5 rounded-full text-xl hover:bg-blue-700 transition">
            Adicionar novo pedido
          </button>
        </div>
      </div>
    </div>
  )
}
