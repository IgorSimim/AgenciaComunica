import Link from "next/link";

export default function SobreNos() {
    return (
        <div className="bg-black">
            {/* Seção sobre nós */}
            <div className="py-12 text-center font-sans">
                <h2 className="text-white text-5xl mb-12">Sobre nós</h2>

                {/* Seção de texto */}
                <div className="bg-yellow-400 mx-auto p-10 rounded-xl shadow-lg max-w-6xl">
                    <div className="text-center">
                        <p className="text-xl text-gray-800 mb-6">
                            Somos a sua parceria ideal em estratégia e criatividade.
                            Nossa missão é transformar ideias em marcas únicas e memoráveis, alinhadas aos seus objetivos e essência.
                        </p>
                        <p className="text-xl text-gray-800 mb-6">
                            Desenvolvemos identidades visuais e um posicionamento de marca que ressoe com seu público e se destaque no mercado.
                            Gerenciamos redes sociais com estratégias personalizadas para criar uma comunidade fiel para o seu negócio.
                            E trabalhamos com anúncios online para empresas que desejam expandir sua presença e alcançar melhores resultados,
                            de forma criativa, estratégica e rentável.
                        </p>
                        <p className="text-xl text-gray-800 mb-6">
                            Com uma equipe engajada e qualificada, garantimos um serviço próximo, claro e seguro.
                            Estamos aqui para tornar sua marca inesquecível e ajudar seu negócio a crescer de forma sustentável.
                        </p>
                    </div>
                </div>

                {/* Missão, Visão e Valores */}
                <div className="mt-12 px-4">
                    <h3 className="text-white text-4xl mb-6">Missão, Visão e Valores</h3>
                    <div className="flex flex-col md:flex-row justify-between gap-12">

                        {/* Card Missão */}
                        <div className="bg-yellow-300 p-8 rounded-xl shadow-lg w-full md:w-1/3 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                            <div className="flex justify-center mb-4">
                                <img src="/sobre-nos/icon-missao.png" alt="Missão" className="w-16 h-16 text-white" />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-800 mb-4">Missão</h4>
                            <p className="text-lg text-gray-900">
                                Capacitar empresas a prosperar no ambiente digital,
                                oferecendo soluções inovadoras e estratégicas em redes sociais e tráfego pago.
                            </p>
                        </div>

                        {/* Card Visão */}
                        <div className="bg-yellow-300 p-8 rounded-xl shadow-lg w-full md:w-1/3 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                            <div className="flex justify-center mb-4">
                                <img src="/sobre-nos/icon-visao.png" alt="Visão" className="w-16 h-16 text-white" />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-800 mb-4">Visão</h4>
                            <p className="text-lg text-gray-900">
                                Ser uma agência de referência em marketing digital em todo o Brasil,
                                com atuações em trabalhos criativos e estratégicos para marcas, através meio digital.
                            </p>
                        </div>

                        {/* Card Valores */}
                        <div className="bg-yellow-300 p-8 rounded-xl shadow-lg w-full md:w-1/3 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                            <div className="flex justify-center mb-4">
                                <img src="/sobre-nos/icon-valores.png" alt="Valores" className="w-16 h-16 text-white" />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-800 mb-4">Valores</h4>
                            <p className="text-lg text-gray-900">
                                - Inovação<br />
                                - Transparência<br />
                                - Colaboração<br />
                                - Excelência<br />
                                - Criatividade<br />
                            </p>
                        </div>

                    </div>
                </div>

                {/* Contato */}
                <div className="mt-12">
                    <Link href="/contate-nos">
                        <button className="bg-orange-600 hover:bg-orange-700 text-white text-xl px-12 py-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md">
                            Fale conosco
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
