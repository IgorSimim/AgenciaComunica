import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { authorizeFuncionario, cargosServico } from "@/lib/api/funcionario-auth"

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
                simboloPublicId: true
            }
        })

        return NextResponse.json(
            { servicos },
            { status: 200 }
        )
    } catch (error) {
        console.error("Erro ao buscar serviços:", error)
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
        const auth = await authorizeFuncionario(cargosServico)
        if (auth.response) {
            return auth.response
        }
        const { funcionario } = auth

        const data = await _request.json()

        const { nome, descricao, preco, simboloUrl, simboloPublicId } = data
        const precoNumerico = Number(preco)
        if (
            !nome || !descricao || !simboloUrl || !simboloPublicId
            || !Number.isFinite(precoNumerico) || precoNumerico <= 0
        ) {
            return NextResponse.json(
                { message: "Nome, descrição, símbolo e preço positivo são obrigatórios" },
                { status: 400 }
            )
        }

        const existingServico = await prisma.servico.findFirst({
            where: { nome }
        })

        if (existingServico) {
            return NextResponse.json(
                { message: "Já existe um serviço com este nome" },
                { status: 409 }
            )
        }

        const newServico = await prisma.servico.create({
            data: {
                funcionario_id: funcionario.id,
                nome,
                descricao,
                preco: precoNumerico,
                simboloUrl,
                simboloPublicId
            },
        })

        return NextResponse.json(
            { servico: newServico },
            { status: 201 }
        )
    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { message: "Corpo da requisição inválido" },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { message: "Erro ao criar serviço" },
            { status: 500 }
        )
    }
}