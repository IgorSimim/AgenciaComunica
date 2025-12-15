'use client';

import { sendGTMEvent } from '@next/third-parties/google'
import { stringify } from 'querystring'
import { useState, FormEvent } from 'react'
import { alerts } from '@/lib/alerts'

type FormData = {
    nome: string
    email: string
    mensagem: string
}

export default function Contato() {
    const [formData, setFormData] = useState<FormData>({
        nome: '',
        email: '',
        mensagem: ''
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target

        if (name === 'nome') {
            // Aceita apenas letras (maiúsculas/minúsculas), acentos e espaços
            const somenteLetras = value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')
            setFormData(prev => ({ ...prev, [name]: somenteLetras }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        // Validação simples de Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            alerts.warning('Por favor, informe um Email válido.')
            return
        }

        try {
            const res = await fetch('/api/contato', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (!res.ok) throw new Error('Erro ao enviar o formulário')

            sendGTMEvent({ event: 'buttonClicked', value: stringify({ email: formData.email, mensagem: formData.mensagem }) });

            alerts.success('Formulário enviado com sucesso!')
            setFormData({ nome: '', email: '', mensagem: '' })
        } catch (err) {
            alerts.error('Não foi possível enviar sua mensagem. Tente novamente mais tarde.')
        }
    }


    return (
        <>

            <div className="bg-black py-12">
                {/* Título da página */}
                <div className="text-center font-sans mb-12">
                    <h2 className="text-white text-5xl">Fale conosco</h2>
                    <p className="text-gray-400 text-xl mt-4">
                        Estamos aqui para ajudar! Preencha o formulário abaixo e entraremos em contato.
                    </p>
                </div>

                {/* Formulário de Contato */}
                <div className="max-w-4xl mx-auto bg-yellow-400 p-10 rounded-xl shadow-lg">
                    <form onSubmit={handleSubmit}>
                        {/* Nome */}
                        <div className="mb-6">
                            <label
                                htmlFor="nome"
                                className="block text-gray-800 text-xl font-semibold mb-2"
                            >
                                Nome
                            </label>
                            <input
                                id="nome"
                                type="text"
                                name="nome"
                                placeholder="Seu nome completo"
                                aria-label="Nome completo"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                className="w-full p-4 rounded-lg border-2 border-gray-300 text-gray-800"
                            />
                        </div>

                        {/* E-mail */}
                        <div className="mb-6">
                            <label
                                htmlFor="email"
                                className="block text-gray-800 text-xl font-semibold mb-2"
                            >
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Seu e-mail"
                                aria-label="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full p-4 rounded-lg border-2 border-gray-300 text-gray-800"
                            />
                        </div>

                        {/* Mensagem */}
                        <div className="mb-6">
                            <label
                                htmlFor="mensagem"
                                className="block text-gray-800 text-xl font-semibold mb-2"
                            >
                                Mensagem
                            </label>
                            <textarea
                                id="mensagem"
                                name="mensagem"
                                placeholder="Escreva sua mensagem aqui"
                                aria-label="Mensagem"
                                value={formData.mensagem}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="w-full p-4 rounded-lg border-2 border-gray-300 text-gray-800"
                            ></textarea>
                        </div>

                        {/* Botão de envio */}
                        <div className="text-center">
                            <button
                                type="submit"
                                className="bg-orange-600 hover:bg-orange-700 text-white text-xl px-10 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md"
                            >
                                Enviar mensagem
                            </button>
                        </div>
                    </form>
                </div>

                {/* Informações adicionais */}
                <div className="text-center mt-12">
                    <p className="text-white text-xl">Ou entre em contato diretamente com nosso time:</p>
                    <p className="text-gray-400 text-lg mt-2">Telefone: (053) 99139-3855</p>
                </div>
            </div>
        </>
    );
}
