import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../../config/auth/authOptions";

// PUT /api/empresa/:cnpj
export async function PUT(
    _request: NextRequest,
    { params }: { params: Promise<{ cnpj: string }> }
) {
    try {
        const cnpj = await params?.then((e) => e.cnpj);
        if (!cnpj) {
            return NextResponse.json(
                { error: "CNPJ da empresa é obrigatório" },
                { status: 400 }
            );
        }

        const empresa = await prisma.empresa.findUnique({
            where: {
                cnpj: cnpj
            },
        });

        if (!empresa) {
            return NextResponse.json(
                { error: "Empresa não encontrada" },
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

        if (!colaborador || colaborador.cargo !== "RH") {
            return NextResponse.json(
                { message: "Acesso negado para atualizar os dados da empresa" },
                { status: 403 }
            );
        }

        const dadosAtualizados = await _request.json();

        const { nome, email, setor, logotipo, ativa } = dadosAtualizados;
        if (!nome || !email || !setor || !logotipo) {
            return NextResponse.json(
                { error: "Todos os campos são obrigatórios" },
                { status: 400 }
            );
        }

        await prisma.empresa.update({
            where: { cnpj },
            data: {
                nome,
                email,
                setor,
                logotipo,
                ativa
            },
        });

        return NextResponse.json(
            { message: "Empresa atualizada com sucesso!" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao atualizar empresa" },
            { status: 500 }
        );
    }
}

// SOFTDELETE /api/empresa/:cnpj
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ cnpj: string }> }
) {
    try {
        const cnpj = await params?.then((e) => e.cnpj);
        if (!cnpj) {
            return NextResponse.json(
                { error: "CNPJ da empresa é obrigatório" },
                { status: 400 }
            );
        }

        const empresa = await prisma.empresa.findUnique({
            where: {
                cnpj: cnpj
            },
        });

        if (!empresa) {
            return NextResponse.json(
                { error: "Empresa não encontrada" },
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

        if (!colaborador || colaborador.cargo !== "RH") {
            return NextResponse.json(
                { message: "Acesso negado para deletar a empresa" },
                { status: 403 }
            );
        }

        await prisma.empresa.update({
            where: { cnpj },
            data: {
                ativa: false
            },
        });

        return NextResponse.json(
            { message: "Empresa desativada com sucesso!" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao desativar empresa" },
            { status: 500 }
        );
    }
}