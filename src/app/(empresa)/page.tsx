'use client'
import { useEffect, useState } from "react";
import Link from "next/link";

// interface Servico {
//     nome: string;
//     descricao: string;
//     foto: string;
// }

export default function HomeDeslogado() {
    // const [servicos, setServicos] = useState<Servico[]>([]);

    // useEffect(() => {
    //     async function getServicos() {
    //         const response = await fetch("http://localhost:3004/servicos");
    //         const dados = await response.json();
    //         setServicos(dados);
    //     }
    //     getServicos();
    // }, []);

    return (
        <div className="bg-yellow-400">
            <div className="flex">
                <div className="w-[60%] flex justify-center items-center">
                    <img src="/home-deslogado/img-slogan.jpg" alt="Imagem" className="w-full h-auto" />
                </div>

                <div className="w-[40%] flex justify-center items-center">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center w-full">
                        <p className="text-4xl text-black">Nossa paixão é impulsionar sua marca com criatividade e resultados excepcionais.</p>
                        <img src="/logo2.png" alt="Logo" className="max-w-full" />

                        <div className="flex justify-center w-full space-x-2">
                            <ul className="flex space-x-2 w-full justify-center mt-6">
                                <li className="flex justify-center items-center bg-orange-600 hover:bg-orange-700 text-white rounded-full text-3xl font-normal w-[267px] h-[75px] cursor-pointer">
                                    <Link href="/sobre-nos" className="w-full text-center">Sobre nós</Link>
                                </li>
                                <li className="flex justify-center items-center bg-purple-700 hover:bg-purple-800 text-white rounded-full text-3xl font-normal w-[267px] h-[75px] cursor-pointer">
                                    <Link href="/contate-nos" className="w-full text-center">Contate-nos</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

{/*             <div className="bg-black py-12 text-center font-sans">
                <h2 className="text-white text-5xl mb-12">Nossos serviços</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {servicos.map((servico, index) => (
                        <div key={index} className="w-full h-[480px] bg-yellow-400 rounded-[90px] relative p-6">
                            <img src={servico.foto} alt={servico.nome} className="absolute top-6 left-6 w-14 h-14" />
                            <h2 className="text-center text-3xl text-black mt-16">{servico.nome}</h2>
                            <p className="text-left text-2xl text-black mt-6">{servico.descricao}</p>
                            <button className="absolute bottom-10 right-8 bg-orange-600 hover:bg-orange-700 text-white text-xl px-6 py-3 rounded-full flex items-center gap-3">
                                Ver mais <span>&rarr;</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div> */}


            <div className="bg-yellow-400 py-12 text-center font-sans">
                <div className="flex justify-around gap-7 flex-wrap">
                    <div className="flex flex-col items-center">
                        <h3 className="text-black text-5xl font-bold">112</h3>
                        <p className="text-black text-2xl mt-2">Empresas atendidas</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h3 className="text-black text-5xl font-bold">506</h3>
                        <p className="text-black text-2xl mt-2">Serviços contratados</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h3 className="text-black text-5xl font-bold">1K+</h3>
                        <p className="text-black text-2xl mt-2">Atividades entregues</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h3 className="text-black text-5xl font-bold">65</h3>
                        <p className="text-black text-2xl mt-2">Feedbacks recebidos</p>
                    </div>
                </div>
            </div>


            <div className="bg-black flex w-full">
                <div className="w-1/2 flex flex-col justify-start p-5">
                    <h2 className="text-white text-5xl text-center mb-5">Conheça nossa equipe</h2>
                    <p className="text-white text-2xl">
                        Contamos com profissionais dedicados e talentosos, especialistas em suas áreas, unidos pela criatividade e inovação.
                        Conheça as pessoas que fazem nossos projetos acontecerem!
                    </p>
                    <div className="flex flex-col items-center gap-4 mt-[6rem]">
                        <div className="flex gap-16">
                            <img src="/home-deslogado/img-equipe-larissa.png" alt="Foto Larissa" className="rounded-3xl" />
                            <img src="/home-deslogado/img-equipe-paulo.png" alt="Foto Paulo" className="rounded-3xl" />
                        </div>
                        <div className="mt-[-4rem]">
                            <img src="/home-deslogado/img-equipe-kbelo.png" alt="Foto Kbelo" className=" rounded-3xl" />
                        </div>
                    </div>
                    <ul className="flex space-x-2 w-full justify-end mt-[4rem]">
                        <li className="flex justify-center items-center bg-orange-600 hover:bg-orange-700 text-white rounded-full text-3xl font-normal w-[267px] h-[75px] cursor-pointer">
                            <Link href="/contratados" className="w-full text-center">Saiba mais</Link>
                        </li>
                    </ul>
                </div>
                <div className="w-1/2 flex justify-center items-center overflow-hidden">
                    <img src="/home-deslogado/img-equipe.jpg" alt="Foto da Equipe" className="w-full h-full object-cover" />
                </div>
            </div>
        </div >
    );
}
