'use client'
import { useEffect, useState } from "react";

export default function Contratados() {
    const [contratados, setContratados] = useState([]);

    useEffect(() => {
        async function getContratados() {
            const response = await fetch("http://localhost:3004/contratados");
            const dados = await response.json();
            setContratados(dados);
        }
        getContratados();
    }, []);

    return (
        <div className="bg-black">
            <div className="py-12 text-center font-sans">
                <h2 className="text-white text-5xl mb-20">Conheça a equipe</h2>
                {Array.from({ length: Math.ceil(contratados.length / 3) }).map((_, index) => (
                    <div key={index} className="bg-yellow-400 mx-auto p-10 rounded-xl shadow-lg max-w-6xl mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-1">
                            {contratados
                                .slice(index * 3, (index + 1) * 3)
                                .map((contratado, subIndex) => (
                                    <div key={subIndex} className="text-center relative">
                                        <div className="relative w-40 h-40 mx-auto -mt-20">
                                            <img
                                                src={contratado.foto}
                                                alt={contratado.nome}
                                                className="w-full h-full object-cover rounded-full border-4 border-yellow-400 shadow-md"
                                            />
                                        </div>
                                        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
                                            <h3 className="text-2xl font-bold text-gray-800">{contratado.nome}</h3>
                                            <p className="text-lg font-medium text-yellow-600 mt-2">{contratado.atuacao}</p>
                                            <p className="text-gray-700 mt-4 leading-relaxed">{contratado.sobre}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}
