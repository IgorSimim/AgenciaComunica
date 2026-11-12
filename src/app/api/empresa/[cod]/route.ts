import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import cloudinary from "@/lib/cloudinary"
import { authorizeFuncionario, cargosGestao } from "@/lib/api/funcionario-auth"
import { apiController } from "@/lib/api/api-controller"

// GET /api/empresa/:cod
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ cod: string }> }
) {
    try {
        const { cod: codStr } = await params
        const parsedCode = apiController.parsePositiveInteger(codStr, {
            missingMessage: "Código da empresa é obrigatório",
            invalidMessage: "Código da empresa deve ser um número válido",
        })
        if ("response" in parsedCode) return parsedCode.response
        const cod = parsedCode.value

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
        return apiController.handleError(error, "Erro ao buscar empresa")
    }
}


// PUT /api/empresa/:cod
export async function PUT(
    _request: NextRequest,
    { params }: { params: Promise<{ cod: string }> }
) {
    try {
        const codStr = await params?.then((e) => e.cod)
        const parsedCode = apiController.parsePositiveInteger(codStr, {
            missingMessage: "Código da empresa é obrigatório",
            invalidMessage: "Código da empresa deve ser um número válido",
        })
        if ("response" in parsedCode) return parsedCode.response
        const cod = parsedCode.value

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
        
        if (!nome || !email || !setor) {
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
        return apiController.handleError(error, "Erro ao atualizar empresa")
    }
}