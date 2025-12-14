'use client';

import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';

export default function ContateNos() {
    const { register, handleSubmit, reset } = useForm<{
        nome: string;
        email: string;
        mensagem: string;
    }>();

    async function enviarContato(data: { nome: string; email: string; mensagem: string }) {
        try {
            const response = await fetch('http://localhost:3004/enviaemail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success('Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.');
                reset();
            } else {
                const responseData = await response.json();

                if (responseData.msg) {
                    toast.error(`Erro: ${responseData.msg}`);
                } else {
                    toast.error('Erro ao enviar a mensagem. Tente novamente mais tarde.');
                }
            }
        } catch (error) {
            console.error('Erro ao enviar a mensagem:', error);
            toast.error('Erro inesperado. Verifique sua conexão ou tente novamente mais tarde.');
        }
    }


    return (
        <>
            {/* Toaster para exibir notificações */}
            <Toaster position="top-right" richColors />

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
                    <form onSubmit={handleSubmit(enviarContato)}>
                        {/* Nome */}
                        <div className="mb-6">
                            <label
                                htmlFor="nome"
                                className="block text-gray-800 text-xl font-semibold mb-2"
                            >
                                Nome
                            </label>
                            <input
                                {...register('nome', { required: true })}
                                id="nome"
                                type="text"
                                className="w-full p-4 rounded-lg border-2 border-gray-300 text-gray-800"
                                placeholder="Seu nome completo"
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
                                {...register('email', { required: true })}
                                id="email"
                                type="email"
                                className="w-full p-4 rounded-lg border-2 border-gray-300 text-gray-800"
                                placeholder="Seu e-mail"
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
                                {...register('mensagem', { required: true })}
                                id="mensagem"
                                className="w-full p-4 rounded-lg border-2 border-gray-300 text-gray-800"
                                rows={6}
                                placeholder="Escreva sua mensagem aqui"
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
