import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { authOptions } from "@/app/api/config/auth/authOptions"
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
                simboloUrl: true,
                simboloPublicId: true,
                createdAt: true,
                updatedAt: true
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
        if (!session?.funcionario?.email) {
            return NextResponse.json(
                { message: "Funcionário não autenticado" },
                { status: 401 }
            )
        }

        const funcionario = await prisma.funcionario.findUnique({
            where: { email: session.funcionario.email },
        })

        if (!funcionario) {
            return NextResponse.json(
                { message: "Funcionário não encontrado" },
                { status: 404 }
            )
        }

        // if (funcionario.cargo !== "PROPRIETARIA" && funcionario.cargo !== "REDATORA") {
        //     return NextResponse.json(
        //         { message: "Acesso negado" },
        //         { status: 403 }
        //     )
        // }

        const data = await _request.json()

        const { nome, descricao, preco, simboloUrl, simboloPublicId } = data
        if (!nome || !descricao || preco === undefined) {
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
                funcionario_id: funcionario.id,
                nome,
                descricao,
                preco: parseFloat(preco),
                simboloUrl,
                simboloPublicId
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