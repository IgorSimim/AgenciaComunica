import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import cloudinary from "@/lib/cloudinary"
import { authorizeFuncionario, cargosServico } from "@/lib/api/funcionario-auth"

// GET /api/servico/:cod
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ cod: string }> }
) {
    try {
        const auth = await authorizeFuncionario(cargosServico)
        if (auth.response) {
            return auth.response
        }

        const codStr = await params?.then((e) => e.cod)
        if (!codStr) {
            return NextResponse.json(
                { message: "Código do serviço é obrigatório" },
                { status: 400 }
            )
        }

        const cod = Number(codStr)
        if (!Number.isInteger(cod) || cod <= 0) {
            return NextResponse.json(
                { message: "Código do serviço deve ser um número válido" },
                { status: 400 }
            )
        }

        const servico = await prisma.servico.findFirst({
            where: {
                cod: cod
            },
            select: {
                cod: true,
                nome: true,
                descricao: true,
                preco: true,
                simboloUrl: true,
                simboloPublicId: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        if (!servico) {
            return NextResponse.json(
                { message: "Serviço não encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json(servico, { status: 200 })
    } catch (error) {
        console.error("Erro ao buscar serviço:", error)
        return NextResponse.json(
            { message: "Erro ao buscar serviço" },
            { status: 500 }
        )
    }
}

// PUT /api/servico/:cod
export async function PUT(
    _request: NextRequest,
    { params }: { params: Promise<{ cod: string }> }
) {
    try {
        const auth = await authorizeFuncionario(cargosServico)
        if (auth.response) {
            return auth.response
        }

        const codStr = await params?.then((e) => e.cod)
        if (!codStr) {
            return NextResponse.json(
                { message: "Código do serviço é obrigatório" },
                { status: 400 }
            )
        }

        const cod = Number(codStr)
        if (!Number.isInteger(cod) || cod <= 0) {
            return NextResponse.json(
                { message: "Código do serviço deve ser um número válido" },
                { status: 400 }
            )
        }

        const servico = await prisma.servico.findFirst({
            where: {
                cod: cod
            },
        })

        if (!servico) {
            return NextResponse.json(
                { message: "Serviço não encontrado" },
                { status: 404 }
            )
        }

        const dadosAtualizados = await _request.json()
        const { nome, descricao, preco, simboloUrl, simboloPublicId } = dadosAtualizados
        const precoNumerico = Number(preco)
        if (
            !nome || !descricao
            || !Number.isFinite(precoNumerico) || precoNumerico <= 0
        ) {
            return NextResponse.json(
                { message: "Nome, descrição e preço positivo são obrigatórios" },
                { status: 400 }
            )
        }

        const servicoComNome = await prisma.servico.findFirst({
            where: { nome, cod: { not: cod } },
            select: { cod: true },
        })
        if (servicoComNome) {
            return NextResponse.json(
                { message: "Já existe um serviço com este nome" },
                { status: 409 }
            )
        }

        // Se uma nova foto foi enviada, deletar a antiga do Cloudinary
        if (simboloPublicId && servico.simboloPublicId && simboloPublicId !== servico.simboloPublicId) {
            try {
                await cloudinary.uploader.destroy(servico.simboloPublicId)
            } catch (error) {
                console.error("Erro ao remover símbolo antigo do serviço:", error)
                return NextResponse.json(
                    { message: "Erro ao deletar a imagem antiga do serviço" },
                    { status: 500 }
                )
            }
        }

        await prisma.servico.update({
            where: { cod: cod },
            data: {
                nome,
                descricao,
                preco: precoNumerico,
                ...(simboloUrl && { simboloUrl }),
                ...(simboloPublicId && { simboloPublicId }),
            },
        })

        return NextResponse.json(
            { message: "Serviço atualizado com sucesso!" },
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
            { message: "Erro ao atualizar serviço" },
            { status: 500 }
        )
    }
}

// DELETE /api/servico/:cod
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ cod: string }> }
) {
    try {
        const auth = await authorizeFuncionario(cargosServico)
        if (auth.response) {
            return auth.response
        }

        const codStr = await params?.then((e) => e.cod)
        if (!codStr) {
            return NextResponse.json(
                { message: "Código do serviço é obrigatório" },
                { status: 400 }
            )
        }

        const cod = Number(codStr)
        if (!Number.isInteger(cod) || cod <= 0) {
            return NextResponse.json(
                { message: "Código do serviço deve ser um número válido" },
                { status: 400 }
            )
        }

        const servico = await prisma.servico.findFirst({
            where: {
                cod: cod
            },
        })

        if (!servico) {
            return NextResponse.json(
                { message: "Serviço não encontrado" },
                { status: 404 }
            )
        }

        const contratos = await prisma.contrato.count({
            where: { servicoId: cod },
        })
        if (contratos > 0) {
            return NextResponse.json(
                { message: "Não é possível excluir um serviço vinculado a contratos" },
                { status: 409 }
            )
        }

        // Deletar a foto do Cloudinary antes de fazer o delete
        if (servico.simboloPublicId) {
            try {
                await cloudinary.uploader.destroy(servico.simboloPublicId)
            } catch (error) {
                console.error("Erro ao remover símbolo do serviço:", error)
                return NextResponse.json(
                    { message: "Erro ao deletar a imagem do serviço" },
                    { status: 500 }
                )
            }
        }

        await prisma.servico.delete({
            where: { cod: cod }
        })

        return NextResponse.json(
            { message: "Serviço deletado com sucesso!" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Erro ao excluir serviço:", error)
        return NextResponse.json(
            { message: "Erro ao excluir serviço" },
            { status: 500 }
        )
    }
}