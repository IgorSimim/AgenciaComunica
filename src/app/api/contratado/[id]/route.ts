import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/config/auth/authOptions";

// PUT /api/contratado/:id
export async function PUT(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const idStr = await params?.then((c) => c.id);
        if (!idStr) {
            return NextResponse.json(
                { message: "id do contratado é obrigatório" },
                { status: 400 }
            );
        }

        const id = parseInt(idStr, 10);
        if (isNaN(id)) {
            return NextResponse.json(
                { message: "ID deve ser um número válido" },
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
                { message: "Contratado não encontrado" },
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

        // if (!contratadoLogado || (contratado.cargo !== "PROPRIETARIA" && contratado.cargo !== "RH")) {
        //     return NextResponse.json(
        //         { message: "Acesso negado para atualizar os dados do contratado" },
        //         { status: 403 }
        //     );
        // }

        const dadosAtualizados = await _request.json();

        const { nome, email, telefone, sobre, foto, cargo } = dadosAtualizados;
        if (!nome || !email || !telefone || !sobre || !foto || !cargo) {
            return NextResponse.json(
                { message: "Todos os campos são obrigatórios" },
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
                { message: "ID do contratado é obrigatório" },
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
                { message: "Contratado não encontrado" },
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

        // if (!contratado || (contratado.cargo !== "PROPRIETARIA" && contratado.cargo !== "RH")) {
        //     return NextResponse.json(
        //         { message: "Acesso negado para deletar contratado" },
        //         { status: 403 }
        //     );
        // }

        await prisma.contratado.update({
            where: { id: parseInt(id) },
            data: {
                deletedAt: new Date()
            }
        });

        return NextResponse.json(
            { message: "Contratado removido com sucesso!" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao excluir contratado" },
            { status: 500 }
        );
    }
}

// GET /api/contratado/:id
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const idStr = await params?.then((e) => e.id);
        if (!idStr) {
            return NextResponse.json(
                { message: "ID da contratado é obrigatório" },
                { status: 400 }
            );
        }

        const id = parseInt(idStr, 10);
        if (isNaN(id)) {
            return NextResponse.json(
                { message: "ID da contratado deve ser um número válido" },
                { status: 400 }
            );
        }

        const contratado = await prisma.contratado.findFirst({
            where: {
                id: id,
                deletedAt: null
            },
        });

        if (!contratado) {
            return NextResponse.json(
                { message: "Contratado não encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(contratado, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar contratado" },
            { status: 500 }
        );
    }
}