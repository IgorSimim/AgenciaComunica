import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../../config/auth/authOptions";

// PUT /api/servico/:cod
export async function PUT(
    _request: NextRequest,
    { params }: { params: Promise<{ cod: string }> }
) {
    try {
        const cod = await params?.then((c) => c.cod);
        if (!cod) {
            return NextResponse.json(
                { error: "Código do serviço é obrigatório" },
                { status: 400 }
            );
        }

        const servico = await prisma.servico.findUnique({
            where: {
                cod: parseInt(cod)
            },
        });

        if (!servico) {
            return NextResponse.json(
                { error: "Serviço não encontrado" },
                { status: 404 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session?.colaborador?.email) {
            return NextResponse.json(
                { message: "Colaborador não autenticado" },
                { status: 401 }
            );
        }

        const colaborador = await prisma.colaborador.findUnique({
            where: { email: session.colaborador.email }
        });

        if (!colaborador || (colaborador.cargo !== "PROPRIETARIA" && colaborador.cargo !== "REDATORA")) {
            return NextResponse.json(
                { message: "Acesso negado para atualizar os dados da serviço" },
                { status: 403 }
            );
        }

        const dadosAtualizados = await _request.json();

        const { nome, descricao, preco, simbolo } = dadosAtualizados;
        if (!nome || !descricao || !preco || !simbolo) {
            return NextResponse.json(
                { error: "Todos os campos são obrigatórios" },
                { status: 400 }
            );
        }

        await prisma.servico.update({
            where: { cod: parseInt(cod) },
            data: {
                nome,
                descricao,
                preco,
                simbolo
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
        const cod = await params?.then((s) => s.cod);
        if (!cod) {
            return NextResponse.json(
                { error: "Código do serviço é obrigatório" },
                { status: 400 }
            );
        }

        const servico = await prisma.servico.findUnique({
            where: {
                cod: parseInt(cod)
            },
        });

        if (!servico) {
            return NextResponse.json(
                { error: "Serviço não encontrado" },
                { status: 404 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session?.colaborador?.email) {
            return NextResponse.json(
                { message: "Colaborador não autenticado" },
                { status: 401 }
            );
        }

        const colaborador = await prisma.colaborador.findUnique({
            where: { email: session.colaborador.email }
        });

        if (!colaborador || (colaborador.cargo !== "PROPRIETARIA" && colaborador.cargo !== "REDATORA")) {
            return NextResponse.json(
                { message: "Acesso negado para deletar o serviço" },
                { status: 403 }
            );
        }

        await prisma.servico.delete({
            where: { cod: parseInt(cod) }
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