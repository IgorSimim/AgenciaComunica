import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/config/auth/authOptions";
import { deleteImageFile } from "@/lib/fileUtils";

// GET /api/servico/:cod
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ cod: string }> }
) {
    try {
        const codStr = await params?.then((e) => e.cod);
        if (!codStr) {
            return NextResponse.json(
                { message: "Código do serviço é obrigatório" },
                { status: 400 }
            );
        }

        const cod = parseInt(codStr, 10);
        if (isNaN(cod)) {
            return NextResponse.json(
                { message: "Código do serviço deve ser um número válido" },
                { status: 400 }
            );
        }

        const servico = await prisma.servico.findFirst({
            where: {
                cod: cod
            },
        });

        if (!servico) {
            return NextResponse.json(
                { message: "Serviço não encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(servico, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar serviço" },
            { status: 500 }
        );
    }
}

// PUT /api/servico/:cod
export async function PUT(
    _request: NextRequest,
    { params }: { params: Promise<{ cod: string }> }
) {
    try {
        const codStr = await params?.then((e) => e.cod);
        if (!codStr) {
            return NextResponse.json(
                { message: "Código do serviço é obrigatório" },
                { status: 400 }
            );
        }

        const cod = parseInt(codStr, 10);
        if (isNaN(cod)) {
            return NextResponse.json(
                { message: "Código do serviço deve ser um número válido" },
                { status: 400 }
            );
        }

        const servico = await prisma.servico.findFirst({
            where: {
                cod: cod
            },
        });

        if (!servico) {
            return NextResponse.json(
                { message: "Serviço não encontrado" },
                { status: 404 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session?.funcionario?.email) {
            return NextResponse.json(
                { message: "Funcionário não autenticado" },
                { status: 401 }
            );
        }

        const funcionario = await prisma.funcionario.findUnique({
            where: { email: session.funcionario.email }
        });

        // if (!funcionario || (funcionario.cargo !== "PROPRIETARIA" && funcionario.cargo !== "REDATORA")) {
        //     return NextResponse.json(
        //         { message: "Acesso negado para atualizar os dados da serviço" },
        //         { status: 403 }
        //     );
        // }

        const dadosAtualizados = await _request.json();

        const { nome, descricao, preco, simbolo } = dadosAtualizados;
        if (!nome || !descricao || !preco) {
            return NextResponse.json(
                { message: "Todos os campos são obrigatórios" },
                { status: 400 }
            );
        }

        // Se um novo símbolo foi enviado, deletar o antigo
        if (simbolo && servico.simbolo && simbolo !== servico.simbolo) {
            await deleteImageFile(servico.simbolo);
        }

        await prisma.servico.update({
            where: { cod: cod },
            data: {
                nome,
                descricao,
                preco,
                ...(simbolo && { simbolo })
            },
        });

        return NextResponse.json(
            { message: "Serviço atualizado com sucesso!" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao atualizar serviço" },
            { status: 500 }
        );
    }
}

// DELETE /api/servico/:cod
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ cod: string }> }
) {
    try {
        const codStr = await params?.then((e) => e.cod);
        if (!codStr) {
            return NextResponse.json(
                { message: "Código do serviço é obrigatório" },
                { status: 400 }
            );
        }

        const cod = parseInt(codStr, 10);
        if (isNaN(cod)) {
            return NextResponse.json(
                { message: "Código do serviço deve ser um número válido" },
                { status: 400 }
            );
        }

        const servico = await prisma.servico.findFirst({
            where: {
                cod: cod
            },
        });

        if (!servico) {
            return NextResponse.json(
                { message: "Serviço não encontrado" },
                { status: 404 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session?.funcionario?.email) {
            return NextResponse.json(
                { message: "Funcionário não autenticado" },
                { status: 401 }
            );
        }

        const funcionario = await prisma.funcionario.findUnique({
            where: { email: session.funcionario.email }
        });

        // if (!funcionario || (funcionario.cargo !== "PROPRIETARIA" && funcionario.cargo !== "REDATORA")) {
        //     return NextResponse.json(
        //         { message: "Acesso negado para deletar o serviço" },
        //         { status: 403 }
        //     );
        // }

        // Deletar a imagem antes de deletar o serviço
        if (servico.simbolo) {
            await deleteImageFile(servico.simbolo);
        }

        await prisma.servico.delete({
            where: { cod: cod }
        });

        return NextResponse.json(
            { message: "Serviço deletado com sucesso!" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao excluir serviço" },
            { status: 500 }
        );
    }
}