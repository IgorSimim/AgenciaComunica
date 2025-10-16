import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Atividade, Cargo, Comentario } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../config/auth/authOptions";

// GET /api/colaborador
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.colaborador?.email) {
            return NextResponse.json(
                { message: "Colaborador não autenticado" },
                { status: 401 }
            )
        }

        const colaborador = await prisma.colaborador.findUnique({
            where: { email: session.colaborador.email }
        })

        if (!colaborador || (colaborador.cargo !== "PROPRIETARIA" && colaborador.cargo !== "RH")) {
            return NextResponse.json(
                { message: "Somente a proprietária e os colaboradores do RH" },
                { status: 403 }
            );
        }

        let colaboradorEncontrado: Array<{ id: number; nome: string; email: string; telefone: string; sobre: string; dtnasc: Date; foto: string; cargo: Cargo; atividades: Atividade[]; comentarios: Comentario[] }> | null = null;
        colaboradorEncontrado = await prisma.colaborador.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                sobre: true,
                dtnasc: true,
                foto: true,
                cargo: true,
                atividades: true,
                comentarios: true
            },
            orderBy: { id: 'asc' },
        });

        if (!colaboradorEncontrado) {
            return NextResponse.json(
                { message: "Não existe colaboradores cadastrados" },
                { status: 404 }
            );
        }

        return NextResponse.json(colaboradorEncontrado);
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar colaboradores" },
            { status: 500 }
        );
    }
}