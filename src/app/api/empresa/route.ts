import { NextResponse, NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { authOptions } from "@/app/api/config/auth/authOptions"
import { getServerSession } from "next-auth"

// GET /api/empresa
export async function GET() {
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

        // if (!funcionario || (funcionario.cargo !== "PROPRIETARIA" && funcionario .cargo !== "RH")) {
        //     const empresas = await prisma.empresa.findMany({
        //         select: {
        //             cod: true,
        //             nome: true,
        //             email: true,
        //             setor: true,
        //             logotipo: true,
        //             ativa: true,
        //             createdAt: true,
        //             updatedAt: true,
        //         },
        //         where: {
        //             deletedAt: null
        //         }
        //     })
        //     return NextResponse.json(
        //         empresas,
        //         { status: 200 }
        //     )
        // }

        if (!funcionario || (funcionario.cargo !== "PROPRIETARIA" && funcionario.cargo !== "RH")) {
            const empresas = await prisma.empresa.findMany({
                select: {
                    cod: true,
                    cnpj: true,
                    nome: true,
                    email: true,
                    setor: true,
                    logotipo: true,
                    ativa: true,
                    createdAt: true,
                    updatedAt: true,
                    feedbacks: true
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

        if (funcionario.cargo === "PROPRIETARIA" || funcionario.cargo === "RH") {
            const empresas = await prisma.empresa.findMany({
                select: {
                    cod: true,
                    cnpj: true,
                    nome: true,
                    email: true,
                    setor: true,
                    logotipo: true,
                    ativa: true,
                    createdAt: true,
                    updatedAt: true,
                    deletedAt: true,
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

        // if (!funcionario || (funcionario.cargo !== "PROPRIETARIA" && funcionario.cargo !== "REDATORA")) {
        //     return NextResponse.json(
        //         { message: "Acesso negado" },
        //         { status: 403 }
        //     )
        // }

        const data = await _request.json()

        const { cnpj, nome, email, senha, setor, logotipo, ativa } = data
        if (!cnpj || !nome || !email || !senha || !setor) {
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

        const existingEmail = await prisma.empresa.findUnique({
            where: { email }
        })

        if (existingEmail) {
            return NextResponse.json(
                { message: "Já existe uma empresa com este email" },
                { status: 400 }
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
                logotipo: logotipo || '/uploads/empresas/default.png',
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