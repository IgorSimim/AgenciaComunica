import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../config/auth/authOptions";

// DELETE /api/colaborador/:id
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = await params?.then((c) => c.id);
        if (!id) {
            return NextResponse.json(
                { error: "ID do colaborador é obrigatório" },
                { status: 400 }
            );
        }

        const colaborador = await prisma.colaborador.findUnique({
            where: {
                id: parseInt(id)
            },
        });

        if (!colaborador) {
            return NextResponse.json(
                { error: "Colaborador não encontrado" },
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

        if (!colaborador || (colaborador.cargo !== "PROPRIETARIA" && colaborador.cargo !== "RH")) {
            return NextResponse.json(
                { message: "Acesso negado para deletar colaborador" },
                { status: 403 }
            );
        }

        await prisma.colaborador.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json(
            { message: "Colaborador deletado com sucesso!" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao excluir colaborador" },
            { status: 500 }
        );
    }
}