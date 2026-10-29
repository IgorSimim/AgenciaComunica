import { NextResponse, NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { cargosGestao, authorizeFuncionario } from "@/lib/api/funcionario-auth"

// GET /api/empresa
export async function GET() {
    try {
        const auth = await authorizeFuncionario()
        if (auth.response) {
            return auth.response
        }

        if (
            auth.funcionario.cargo === "PROPRIETARIA"
            || auth.funcionario.cargo === "RH"
        ) {
            const empresas = await prisma.empresa.findMany({
                select: {
                    cod: true,
                    funcionario_id: true,
                    cnpj: true,
                    nome: true,
                    email: true,
                    setor: true,
                    logotipoUrl: true,
                    logotipoPublicId: true,
                    ativa: true,
                    createdAt: true,
                    updatedAt: true,
                    feedbacks: true,
                    contratos: true
                },
                where: {
                    deletedAt: null
                }
            })

            return NextResponse.json(
                empresas,
                { status: 200 }
            )
        }

        const empresas = await prisma.empresa.findMany({
            select: {
                cod: true,
                nome: true,
                setor: true,
                logotipoUrl: true,
                ativa: true,
                createdAt: true,
                updatedAt: true,
            },
            where: { deletedAt: null },
        })

        return NextResponse.json(empresas, { status: 200 })

    } catch (error) {
        console.error("Erro ao buscar empresas:", error)
        return NextResponse.json(
            { mensagem: "Erro ao buscar empresas" },
            { status: 500 }
        )
    }
}

// POST /api/empresa
export async function POST(
    _request: NextRequest
) {
    try {
        const auth = await authorizeFuncionario(cargosGestao)
        if (auth.response) {
            return auth.response
        }
        const { funcionario } = auth

        const data = await _request.json()

        const { cnpj, nome, email, senha, setor, logotipoUrl, logotipoPublicId, ativa } = data
        if (
            !cnpj || !nome || !email || !senha
            ||             !setor || !logotipoUrl || !logotipoPublicId
        ) {
            return NextResponse.json(
                { message: "Todos os campos são obrigatórios" },
                { status: 400 }
            )
        }

        const existingCnpj = await prisma.empresa.findUnique({
            where: { cnpj }
        })

        if (existingCnpj) {
            return NextResponse.json(
                { message: "Já existe uma empresa com este CNPJ" },
                { status: 409 }
            )
        }

        const existingEmail = await prisma.empresa.findUnique({
            where: { email }
        })

        if (existingEmail) {
            return NextResponse.json(
                { message: "Já existe uma empresa com este email" },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(senha, 10)

        const newEmpresa = await prisma.empresa.create({
            data: {
                funcionario_id: funcionario.id,
                cnpj,
                nome,
                email,
                senha: hashedPassword,
                setor,
                logotipoUrl,
                logotipoPublicId,
                ...(ativa !== undefined && { ativa })
            },
            select: {
                cod: true,
                funcionario_id: true,
                cnpj: true,
                nome: true,
                email: true,
                setor: true,
                logotipoUrl: true,
                logotipoPublicId: true,
                ativa: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return NextResponse.json(
            { empresa: newEmpresa },
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
            { message: "Erro ao criar empresa" },
            { status: 500 }
        )
    }
}