import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { apiController } from "@/lib/api/api-controller"

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
        return apiController.handleError(error, "Erro ao buscar dados gerais")
    }
}