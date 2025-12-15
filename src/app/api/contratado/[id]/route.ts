import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/config/auth/authOptions";

// PUT /api/contratado/:id
export async function PUT(
    _request: NextRequest,
    { params }: { params: Promise<{ id: number }> }
) {
    try {
        const id = await params?.then((c) => c.id);
        if (!id) {
            return NextResponse.json(
                { error: "id do contratado é obrigatório" },
                { status: 400 }
            );
        }

        const contratado = await prisma.contratado.findUnique({
            where: {
                id: id
            },
        });

        if (!contratado) {
            return NextResponse.json(
                { error: "Contratado não encontrado" },
                { status: 404 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session?.contratado?.email) {
            return NextResponse.json(
                { message: "Contratado não autenticado" },
                { status: 401 }
            );
        }

        const contratadoLogado = await prisma.contratado.findUnique({
            where: { email: session.contratado.email }
        });

        if (!contratadoLogado || contratado.cargo !== "RH") {
            return NextResponse.json(
                { message: "Acesso negado para atualizar os dados do contratado" },
                { status: 403 }
            );
        }

        const dadosAtualizados = await _request.json();

        const { nome, email, telefone, sobre, foto, cargo } = dadosAtualizados;
        if (!nome || !email || !telefone || !sobre || !foto || !cargo) {
            return NextResponse.json(
                { error: "Todos os campos são obrigatórios" },
                { status: 400 }
            );
        }

        await prisma.contratado.update({
            where: { id },
            data: {
                nome,
                email,
                telefone,
                sobre,
                foto,
                cargo
            },
        });

        return NextResponse.json(
            { message: "contratado atualizado com sucesso!" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao atualizar contratado" },
            { status: 500 }
        );
    }
}

// DELETE /api/contratado/:id
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = await params?.then((c) => c.id);
        if (!id) {
            return NextResponse.json(
                { error: "ID do contratado é obrigatório" },
                { status: 400 }
            );
        }

        const contratado = await prisma.contratado.findUnique({
            where: {
                id: parseInt(id)
            },
        });

        if (!contratado) {
            return NextResponse.json(
                { error: "Contratado não encontrado" },
                { status: 404 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session?.contratado?.email) {
            return NextResponse.json(
                { message: "Contratado não autenticado" },
                { status: 401 }
            );
        }

        if (!contratado || (contratado.cargo !== "PROPRIETARIA" && contratado.cargo !== "RH")) {
            return NextResponse.json(
                { message: "Acesso negado para deletar contratado" },
                { status: 403 }
            );
        }

        await prisma.contratado.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json(
            { message: "Contratado deletado com sucesso!" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao excluir contratado" },
            { status: 500 }
        );
    }
}