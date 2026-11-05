import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {

        const [empresas, funcionarios, servicos] = await Promise.all([
            prisma.empresa.count({ where: { ativa: true, deletedAt: null } }),
            prisma.funcionario.count({ where: { deletedAt: null } }),
            prisma.servico.count()
        ])

        return NextResponse.json({
            empresas,
            funcionarios,
            servicos
        })
    } catch (error) {
        console.error("Erro ao buscar dados gerais:", error)
        return NextResponse.json(
            { message: "Erro ao buscar dados gerais" },
            { status: 500 }
        )
    }
}