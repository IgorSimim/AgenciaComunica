import { Cargo } from "@prisma/client"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/config/auth/authOptions"
import prisma from "@/lib/prisma"

export async function authorizeFuncionario(cargosPermitidos?: readonly Cargo[]) {
    const session = await getServerSession(authOptions)
    if (!session?.funcionario?.email) {
        return {
            response: NextResponse.json(
                { message: "Funcionário não autenticado" },
                { status: 401 }
            ),
        }
    }

    const funcionario = await prisma.funcionario.findFirst({
        where: {
            email: session.funcionario.email,
            deletedAt: null,
        },
        select: {
            id: true,
            email: true,
            cargo: true,
        },
    })

    if (!funcionario) {
        return {
            response: NextResponse.json(
                { message: "Funcionário não encontrado" },
                { status: 401 }
            ),
        }
    }

    if (cargosPermitidos && !cargosPermitidos.includes(funcionario.cargo)) {
        return {
            response: NextResponse.json(
                { message: "Acesso negado" },
                { status: 403 }
            ),
        }
    }

    return { funcionario }
}

export const cargosGestao = [Cargo.PROPRIETARIA, Cargo.RH] as const
export const cargosServico = [Cargo.PROPRIETARIA, Cargo.REDATORA] as const
