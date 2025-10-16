import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { authOptions } from "../config/auth/authOptions"
import { getServerSession } from "next-auth"

// GET /api/servico
export async function GET() {
    try {
        const servicos = await prisma.servico.findMany({
            select: {
                cod: true,
                nome: true,
                descricao: true,
                preco: true,
                simbolo: true
            }
        })

        return NextResponse.json(
            { servicos },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { mensagem: "Erro ao buscar servicos" },
            { status: 500 }
        )
    }
}

// POST /api/servico
export async function POST(
    _request: NextRequest
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.colaborador?.email) {
            return NextResponse.json(
                { message: "Colaborador não autenticado" },
                { status: 401 }
            )
        }

        const colaborador = await prisma.colaborador.findUnique({
            where: { email: session.colaborador.email },
        })

        if (!colaborador || (colaborador.cargo !== "REDATORA" && colaborador.cargo !== "PROPRIETARIA")) {
            return NextResponse.json(
                { message: "Acesso negado" },
                { status: 403 }
            )
        }

        const data = await _request.json()

        const { cod, nome, descricao, preco, simbolo } = data
        if (!cod || !nome || !descricao || !preco || !simbolo) {
            return NextResponse.json(
                { message: "Todos os campos são obrigatórios" },
                { status: 400 }
            )
        }

        const existingServico = await prisma.servico.findFirst({
            where: { nome }
        })

        if (existingServico) {
            return NextResponse.json(
                { message: "Já existe um serviço com este nome" },
                { status: 400 }
            )
        }

        const newServico = await prisma.servico.create({
            data: {
                cod,
                nome,
                descricao,
                preco,
                simbolo
            },
        })

        return NextResponse.json(
            { servico: newServico },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao criar serviço" },
            { status: 500 }
        )
    }
}