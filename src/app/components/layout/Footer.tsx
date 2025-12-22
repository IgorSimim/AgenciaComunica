import Link from "next/link";

const Footer = () => (
    <footer className="bg-black text-white p-4">
        <div className="container mx-auto flex flex-col md:flex-row gap-6">
            {/* Primeira coluna */}
            <div className="md:basis-1/2 flex items-center">
                <img
                    src="/logo.png"
                    alt="Logo da Agência Comunica"
                    className="h-20 w-auto mr-4"
                />
                <div className="text-base">
                    <p>
                        Transformamos ideias em realidades criativas. Nossa equipe é especializada em branding,
                        identidade visual, gestão de redes sociais e anúncios online.
                    </p>
                </div>
            </div>

            {/* Segunda coluna */}
            <div className="md:basis-1/4 flex flex-col items-center">
                <p className="text-center text-xl font-semibold mb-3 mr-9">Redes sociais:</p>
                <div className="flex space-x-4">
                    <a
                        href="https://api.whatsapp.com/send?phone=5553991393855"
                        className="hover:opacity-80 transition-opacity"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="/footer/icon-wpp.png" alt="Icon do WhatsApp" width="45" height="45" />
                    </a>
                    <a
                        href="https://www.instagram.com/agenciacomunicatime"
                        className="hover:opacity-80 transition-opacity"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="/footer/icon-instagram.png" alt="Icon do Instagram" width="45" height="45" />
                    </a>
                    <a
                        href="mailto:agenciacomunicamktdigital@gmail.com"
                        className="hover:opacity-80 transition-opacity"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="/footer/icon-gmail.png" alt="Icon do Gmail" width="45" height="45" />
                    </a>
                </div>
            </div>

            {/* Terceira coluna */}
            <div className="md:basis-1/4 space-y-2">
                <p className="text-xl font-semibold mb-3">Acesso rápido:</p>
                <div className="space-y-2">
                    <Link
                        href="/loginempresa"
                        className="block text-white hover:text-orange-400 transition-colors"
                    >
                        Área da empresa
                    </Link>
                    <Link
                        href="/loginfuncionario"
                        className="block text-white hover:text-yellow-400 transition-colors"
                    >
                        Área do funcionário
                    </Link>
                </div>
            </div>

            {/* Quarta coluna */}
            <div className="md:basis-1/3 space-y-2">
                <p className="text-xl font-semibold mb-3">Contato:</p>
                <p className="text-base">(053) 99139-3855</p>
                <p className="text-base">agenciacomunicamktdigital@gmail.com</p>
                <Link
                    href="https://linktr.ee/agenciacomunicamktdigital"
                    className="text-white hover:text-orange-400 transition-colors inline-block"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    linktr.ee/agenciacomunicamktdigital
                </Link>
            </div>
        </div>
    </footer>
);

export default Footer;
