import { NextResponse, NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { authOptions } from "../config/auth/authOptions"
import { getServerSession } from "next-auth"

// GET /api/empresa
export async function GET() {
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

        if (!colaborador || (colaborador.cargo !== "PROPRIETARIA" && colaborador.cargo !== "RH")) {
            const empresas = await prisma.empresa.findMany({
                select: {
                    cnpj: true,
                    nome: true,
                    email: true,
                    setor: true,
                    logotipo: true,
                    ativa: true,
                    feedbacks: true
                }
            })
            return NextResponse.json(
                empresas,
                { status: 200 }
            )
        }

        if (colaborador.cargo === "PROPRIETARIA" || colaborador.cargo === "RH") {
            const empresas = await prisma.empresa.findMany({
                select: {
                    cnpj: true,
                    nome: true,
                    email: true,
                    setor: true,
                    logotipo: true,
                    ativa: true,
                    feedbacks: true,
                    contratos: true
                },
            })
            return NextResponse.json(
                empresas,
                { status: 200 }
            )
        }
    } catch (error) {
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

        const { cnpj, nome, email, senha, setor, logotipo, ativa } = data
        if (!cnpj || !nome || !email || !senha || !setor || !logotipo) {
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
                { status: 400 }
            )
        }

        const existingEmpresa = await prisma.empresa.findUnique({
            where: { email }
        })

        if (existingEmpresa) {
            return NextResponse.json(
                { message: "Já existe uma empresa com este email" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(senha, 10)

        const newEmpresa = await prisma.empresa.create({
            data: {
                cnpj,
                nome,
                email,
                senha: hashedPassword,
                setor,
                logotipo,
                ativa
            },
        })

        return NextResponse.json(
            { empresa: newEmpresa },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao criar empresa" },
            { status: 500 }
        )
    }
}