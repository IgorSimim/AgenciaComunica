import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import cloudinary from "@/lib/cloudinary"
import { Cargo } from "@prisma/client"
import { authorizeFuncionario, cargosGestao } from "@/lib/api/funcionario-auth"

// GET /api/funcionario/:id
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await authorizeFuncionario(cargosGestao)
        if (auth.response) {
            return auth.response
        }

        const idStr = await params?.then((e) => e.id)
        if (!idStr) {
            return NextResponse.json(
                { message: "ID do funcionário é obrigatório" },
                { status: 400 }
            )
        }

        const id = Number(idStr)
        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json(
                { message: "ID do funcionário deve ser um número válido" },
                { status: 400 }
            )
        }

        const funcionario = await prisma.funcionario.findFirst({
            where: {
                id: id,
                deletedAt: null
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

        if (!funcionario) {
            return NextResponse.json(
                { message: "Funcionário não encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json(funcionario, { status: 200 })
    } catch (error) {
        console.error("Erro ao buscar funcionário:", error)
        return NextResponse.json(
            { message: "Erro ao buscar funcionário" },
            { status: 500 }
        )
    }
}


// PUT /api/funcionario/:id
export async function PUT(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await authorizeFuncionario(cargosGestao)
        if (auth.response) {
            return auth.response
        }
        const { funcionario: actor } = auth

        const idStr = await params?.then((c) => c.id)
        if (!idStr) {
            return NextResponse.json(
                { message: "ID do funcionário é obrigatório" },
                { status: 400 }
            )
        }

        const id = Number(idStr)
        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json(
                { message: "ID deve ser um número válido" },
                { status: 400 }
            )
        }

        const funcionario = await prisma.funcionario.findUnique({
            where: {
                id: id,
                deletedAt: null
            },
        })

        if (!funcionario) {
            return NextResponse.json(
                { message: "Funcionário não encontrado" },
                { status: 404 }
            )
        }

        const dadosAtualizados = await _request.json()
        const { nome, email, telefone, sobre, fotoUrl, fotoPublicId, cargo } = dadosAtualizados
        if (
            !nome || !email || !telefone || !sobre
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

        if (
            actor.cargo === Cargo.RH
            && (cargo === Cargo.PROPRIETARIA || funcionario.cargo === Cargo.PROPRIETARIA)
        ) {
            return NextResponse.json(
                { message: "Somente a proprietária pode gerenciar funcionários com este cargo" },
                { status: 403 }
            )
        }

        const funcionarioComEmail = await prisma.funcionario.findFirst({
            where: { email, id: { not: id } },
            select: { id: true },
        })
        if (funcionarioComEmail) {
            return NextResponse.json(
                { message: "Já existe um funcionário com este email" },
                { status: 409 }
            )
        }

        const funcionarioComTelefone = await prisma.funcionario.findFirst({
            where: { telefone, id: { not: id } },
            select: { id: true },
        })
        if (funcionarioComTelefone) {
            return NextResponse.json(
                { message: "Já existe um funcionário com este telefone" },
                { status: 409 }
            )
        }

        // Se uma nova foto foi enviada, deletar a antiga do Cloudinary
        if (fotoPublicId && funcionario.fotoPublicId && fotoPublicId !== funcionario.fotoPublicId) {
            try {
                await cloudinary.uploader.destroy(funcionario.fotoPublicId)
            } catch (error) {
                console.error("Erro ao remover foto antiga do funcionário:", error)
                return NextResponse.json(
                    { message: "Erro ao deletar a imagem antiga do funcionário" },
                    { status: 500 }
                )
            }
        }

        await prisma.funcionario.update({
            where: { id },
            data: {
                nome,
                email,
                telefone,
                sobre,
                ...(fotoUrl && { fotoUrl }),
                ...(fotoPublicId && { fotoPublicId }),
                cargo
            },
        })

        return NextResponse.json(
            { message: "Funcionário atualizado com sucesso!" },
            { status: 200 }
        )
    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { message: "Corpo da requisição inválido" },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { message: "Erro ao atualizar funcionário" },
            { status: 500 }
        )
    }
}

// DELETE /api/funcionario/:id
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await authorizeFuncionario(cargosGestao)
        if (auth.response) {
            return auth.response
        }
        const { funcionario: actor } = auth

        const id = await params?.then((c) => c.id)
        if (!id) {
            return NextResponse.json(
                { message: "ID do funcionário é obrigatório" },
                { status: 400 }
            )
        }

        const parsedId = Number(id)
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return NextResponse.json(
                { message: "ID deve ser um número válido" },
                { status: 400 }
            )
        }

        const funcionario = await prisma.funcionario.findFirst({
            where: {
                id: parsedId,
                deletedAt: null,
            },
        })

        if (!funcionario) {
            return NextResponse.json(
                { message: "Funcionário não encontrado" },
                { status: 404 }
            )
        }

        if (actor.cargo === Cargo.RH && funcionario.cargo === Cargo.PROPRIETARIA) {
            return NextResponse.json(
                { message: "Somente a proprietária pode gerenciar funcionários com este cargo" },
                { status: 403 }
            )
        }

        // Deletar a foto do Cloudinary antes de fazer o delete
        if (funcionario.fotoPublicId) {
            try {
                await cloudinary.uploader.destroy(funcionario.fotoPublicId)
            } catch (error) {
                console.error("Erro ao remover foto do funcionário:", error)
                return NextResponse.json(
                    { message: "Erro ao deletar a imagem do funcionário" },
                    { status: 500 }
                )
            }
        }

        await prisma.funcionario.update({
            where: { id: parsedId },
            data: {
                deletedAt: new Date()
            }
        })

        return NextResponse.json(
            { message: "Funcionário removido com sucesso!" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Erro ao excluir funcionário:", error)
        return NextResponse.json(
            { message: "Erro ao excluir funcionário" },
            { status: 500 }
        )
    }
}