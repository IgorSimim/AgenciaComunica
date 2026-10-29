import { NextResponse, NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { Cargo } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/config/auth/authOptions"
import { authorizeFuncionario, cargosGestao } from "@/lib/api/funcionario-auth"

// GET /api/funcionario
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        const currentFuncionario = session?.funcionario?.email
            ? await prisma.funcionario.findFirst({
                where: { email: session.funcionario.email, deletedAt: null },
                select: { cargo: true },
            })
            : null
        const isGestor = currentFuncionario?.cargo === Cargo.PROPRIETARIA
            || currentFuncionario?.cargo === Cargo.RH

        const funcionarioEncontrado = await prisma.funcionario.findMany({
            select: {
                id: true,
                nome: true,
                sobre: true,
                fotoUrl: true,
                cargo: true,
                ...(isGestor && {
                    email: true,
                    telefone: true,
                    dtnasc: true,
                    fotoPublicId: true,
                }),
            },
            where: {
                deletedAt: null
            },
            orderBy: { id: 'asc' },
        })

        return NextResponse.json(funcionarioEncontrado)
    } catch (error) {
        console.error("Erro ao buscar funcionários:", error)
        return NextResponse.json(
            { message: "Erro ao buscar funcionários" },
            { status: 500 }
        )
    }
}

// POST /api/funcionario
export async function POST(
    _request: NextRequest
) {
    try {
        const auth = await authorizeFuncionario(cargosGestao)
        if (auth.response) {
            return auth.response
        }
        const { funcionario: actor } = auth

        const data = await _request.json()

        const { nome, email, senha, telefone, sobre, dtnasc, fotoUrl, fotoPublicId, cargo } = data
        if (
            !nome || !email || !senha || !telefone
            || !sobre || !dtnasc || !fotoUrl || !fotoPublicId
            || !cargo
        ) {
            return NextResponse.json(
                { message: "Todos os campos são obrigatórios" },
                { status: 400 }
            )
        }

        if (!Object.values(Cargo).includes(cargo)) {
            return NextResponse.json(
                { message: "Cargo inválido" },
                { status: 400 }
            )
        }

        const dataNascimento = new Date(dtnasc)
        if (Number.isNaN(dataNascimento.getTime())) {
            return NextResponse.json(
                { message: "Data de nascimento inválida" },
                { status: 400 }
            )
        }

        if (actor.cargo === Cargo.RH && cargo === Cargo.PROPRIETARIA) {
            return NextResponse.json(
                { message: "Somente a proprietária pode atribuir este cargo" },
                { status: 403 }
            )
        }

        const existingEmail = await prisma.funcionario.findUnique({
            where: { email }
        })

        if (existingEmail) {
            return NextResponse.json(
                { message: "Já existe um funcionário com este email" },
                { status: 409 }
            )
        }

        const existingTelefone = await prisma.funcionario.findUnique({
            where: { telefone }
        })

        if (existingTelefone) {
            return NextResponse.json(
                { message: "Já existe um funcionário com este telefone" },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(senha, 10)

        const newFuncionario = await prisma.funcionario.create({
            data: {
                nome,
                email,
                senha: hashedPassword,
                telefone,
                sobre,
                dtnasc: dataNascimento,
                fotoUrl,
                fotoPublicId,
                cargo,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                sobre: true,
                dtnasc: true,
                fotoUrl: true,
                fotoPublicId: true,
                cargo: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return NextResponse.json(
            { funcionario: newFuncionario },
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
            { message: "Erro ao criar funcionário" },
            { status: 500 }
        )
    }
}