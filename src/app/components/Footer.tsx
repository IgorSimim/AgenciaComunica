import Link from "next/link";

const Footer = () => (
    <footer className="bg-black text-white font-nunito p-2 mb-1">
        <div className="flex flex-col md:flex-row gap-6">
            {/* Primeira coluna */}
            <div className="md:basis-1/2 flex items-center mt-3">
                <img
                    src="/logo.png"
                    width="179"
                    height="141"
                    alt="Agência Comunica Logo"
                    className="mr-5"
                />
                <div className="text-base">
                    <p>
                        Transformamos ideias em realidades criativas. Nossa equipe é especializada em branding,
                        identidade visual, gestão de redes sociais e anúncios online.
                    </p>
                </div>
            </div>

            {/* Segunda coluna */}
            <div className="md:basis-1/4 flex flex-col items-center mt-3">
                <p className="text-center text-base mb-2"><b>Redes Sociais:</b></p>
                <div className="flex space-x-2 ms-11">
                    <a
                        href="https://api.whatsapp.com/send?phone=5553991393855"
                        className="hover:opacity-80"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="/footer/icon-wpp.png" alt="WhatsApp" width="45" height="45" />
                    </a>
                    <a
                        href="https://www.instagram.com/agenciacomunicatime"
                        className="hover:opacity-80"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="/footer/icon-instagram.png" alt="Instagram" width="45" height="45" />
                    </a>
                    <a
                        href="mailto:agenciacomunicamktdigital@gmail.com"
                        className="hover:opacity-80"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="/footer/icon-gmail.png" alt="Gmail" width="45" height="45" />
                    </a>
                </div>
            </div>

            {/* Terceira coluna */}
            <div className="md:basis-1/3 space-y-2 mt-3">
                <p className="text-base"><b>Contato:</b> (053) 99139-3855</p>
                <p className="text-base"><b>Email:</b> agenciacomunicamktdigital@gmail.com</p>
                <p className="text-base">
                    <Link
                        href="https://linktr.ee/agenciacomunicamktdigital"
                        className="text-white hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        linktr.ee/agenciacomunicamktdigital
                    </Link>

                </p>
            </div>
        </div>
    </footer>
);

export default Footer;
