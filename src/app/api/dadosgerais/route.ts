import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const [empresas, contratados, servicos] = await Promise.all([
            prisma.empresa.count({ where: { ativa: { not: false } } }),
            prisma.contratado.count(),
            prisma.servico.count()
        ]);

        return NextResponse.json({
            empresas,
            contratados,
            servicos
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar dados gerais" },
            { status: 500 }
        );
    }
}