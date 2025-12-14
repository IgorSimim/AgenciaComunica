import React, { useState } from 'react'

interface ContratadoRegisterFormProps {
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

const ContratadoRegisterForm: React.FC<ContratadoRegisterFormProps> = ({ onSuccess, onError }) => {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [atuacao, setAtuacao] = useState('')
  const [dtnasc, setDtnasc] = useState('')
  const [sobre, setSobre] = useState('')
  const [foto, setFoto] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/contratados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, atuacao, dtnasc, sobre, foto }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        onError(errorData.erro || 'Erro ao criar contratado')
      } else {
        onSuccess('Contratado criado com sucesso!')
        setNome('')
        setEmail('')
        setSenha('')
        setAtuacao('')
        setDtnasc('')
        setSobre('')
        setFoto('')
      }
    } catch (error) {
      onError('Erro de conexão com a API')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-4 border border-gray-300 rounded shadow-md">
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="border p-2 mb-2 rounded"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 rounded"
        required
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className="border p-2 mb-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Área de Atuação"
        value={atuacao}
        onChange={(e) => setAtuacao(e.target.value)}
        className="border p-2 mb-2 rounded"
        required
      />

      <input
        type="date"
        value={dtnasc}
        onChange={(e) => setDtnasc(e.target.value)}
        className="border p-2 mb-2 rounded"
        required
      />

      <textarea
        placeholder="Descrição sobre o contratado"
        value={sobre}
        onChange={(e) => setSobre(e.target.value)}
        className="border p-2 mb-2 rounded"
        rows={4}
        required
      />

      <input
        type="url"
        placeholder="URL da foto"
        value={foto}
        onChange={(e) => setFoto(e.target.value)}
        className="border p-2 mb-2 rounded"
      />

      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
        Registrar Contratado
      </button>
    </form>
  )
}

export default ContratadoRegisterForm