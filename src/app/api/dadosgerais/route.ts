import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authorizeFuncionario } from "@/lib/api/funcionario-auth"

export async function GET() {
    try {
        const auth = await authorizeFuncionario()
        if (auth.response) {
            return auth.response
        }

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