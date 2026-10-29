import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import cloudinary from "@/lib/cloudinary"
import { authorizeFuncionario, cargosGestao } from "@/lib/api/funcionario-auth"

// GET /api/empresa/:cod
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ cod: string }> }
) {
    try {
        const { cod: codStr } = await params
        if (!codStr) {
            return NextResponse.json(
                { message: "Código da empresa é obrigatório" },
                { status: 400 }
            )
        }

        const cod = Number(codStr)
        if (!Number.isInteger(cod) || cod <= 0) {
            return NextResponse.json(
                { message: "Código da empresa deve ser um número válido" },
                { status: 400 }
            )
        }

        const auth = await authorizeFuncionario(cargosGestao)
        if (auth.response) {
            return auth.response
        }

        const empresa = await prisma.empresa.findFirst({
            where: {
                cod: cod,
                deletedAt: null
            },
            select: {
                cod: true,
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

        if (!empresa) {
            return NextResponse.json(
                { message: "Empresa não encontrada" },
                { status: 404 }
            )
        }

        return NextResponse.json(empresa, { status: 200 })
    } catch (error) {
        console.error("Erro ao buscar empresa:", error)
        return NextResponse.json(
            { message: "Erro ao buscar empresa" },
            { status: 500 }
        )
    }
}


// PUT /api/empresa/:cod
export async function PUT(
    _request: NextRequest,
    { params }: { params: Promise<{ cod: string }> }
) {
    try {
        const codStr = await params?.then((e) => e.cod)
        if (!codStr) {
            return NextResponse.json(
                { message: "Código da empresa é obrigatório" },
                { status: 400 }
            )
        }

        const cod = Number(codStr)
        if (!Number.isInteger(cod) || cod <= 0) {
            return NextResponse.json(
                { message: "Código da empresa deve ser um número válido" },
                { status: 400 }
            )
        }

        const auth = await authorizeFuncionario(cargosGestao)
        if (auth.response) {
            return auth.response
        }

        const empresa = await prisma.empresa.findFirst({
            where: {
                cod: cod,
                deletedAt: null,
            },
        })

        if (!empresa) {
            return NextResponse.json(
                { message: "Empresa não encontrada" },
                { status: 404 }
            )
        }

        const dadosAtualizados = await _request.json()
        const { nome, email, setor, logotipoUrl, logotipoPublicId, ativa } = dadosAtualizados
        if (
            !nome || !email || !setor
        ) {
            return NextResponse.json(
                { message: "Dados obrigatórios ou status da empresa inválidos" },
                { status: 400 }
            )
        }

        const empresaComEmail = await prisma.empresa.findFirst({
            where: { email, cod: { not: cod } },
            select: { cod: true },
        })
        if (empresaComEmail) {
            return NextResponse.json(
                { message: "Já existe uma empresa com este email" },
                { status: 409 }
            )
        }

        // Se uma nova foto foi enviada, deletar a antiga do Cloudinary
        if (logotipoPublicId && empresa.logotipoPublicId && logotipoPublicId !== empresa.logotipoPublicId) {
            try {
                await cloudinary.uploader.destroy(empresa.logotipoPublicId)
            } catch (error) {
                console.error("Erro ao remover logotipo antigo da empresa:", error)
                return NextResponse.json(
                    { message: "Erro ao deletar a imagem antiga da empresa" },
                    { status: 500 }
                )
            }
        }

        await prisma.empresa.update({
            where: { cod },
            data: {
                nome,
                email,
                setor,
                ...(logotipoUrl && { logotipoUrl }),
                ...(logotipoPublicId && { logotipoPublicId }),
                ativa
            },
        })

        return NextResponse.json(
            { message: "Empresa atualizada com sucesso!" },
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
            { message: "Erro ao atualizar empresa" },
            { status: 500 }
        )
    }
}