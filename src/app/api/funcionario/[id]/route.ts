import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/config/auth/authOptions";
import cloudinary from "@/lib/cloudinary";

// GET /api/funcionario/:id
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const idStr = await params?.then((e) => e.id);
        if (!idStr) {
            return NextResponse.json(
                { message: "ID do funcionário é obrigatório" },
                { status: 400 }
            );
        }

        const id = parseInt(idStr, 10);
        if (isNaN(id)) {
            return NextResponse.json(
                { message: "ID do funcionário deve ser um número válido" },
                { status: 400 }
            );
        }

        const funcionario = await prisma.funcionario.findFirst({
            where: {
                id: id,
                deletedAt: null
            },
        });

        if (!funcionario) {
            return NextResponse.json(
                { message: "Funcionário não encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(funcionario, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar funcionário" },
            { status: 500 }
        );
    }
}


// PUT /api/funcionario/:id
export async function PUT(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const idStr = await params?.then((c) => c.id);
        if (!idStr) {
            return NextResponse.json(
                { message: "ID do funcionário é obrigatório" },
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

        const funcionario = await prisma.funcionario.findUnique({
            where: {
                id: id
            },
        });

        if (!funcionario) {
            return NextResponse.json(
                { message: "Funcionário não encontrado" },
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

        const funcionarioLogado = await prisma.funcionario.findUnique({
            where: { email: session.funcionario.email }
        });

        // if (!funcionarioLogado || (funcionario.cargo !== "PROPRIETARIA" && funcionario.cargo !== "RH")) {
        //     return NextResponse.json(
        //         { message: "Acesso negado para atualizar os dados do funcionário" },
        //         { status: 403 }
        //     );
        // }

        const dadosAtualizados = await _request.json();

        const { nome, email, telefone, sobre, fotoUrl, fotoPublicId, cargo } = dadosAtualizados;
        if (!nome || !email || !telefone || !sobre || !cargo) {
            return NextResponse.json(
                { message: "Todos os campos são obrigatórios" },
                { status: 400 }
            );
        }

        // Se uma nova foto foi enviada, deletar a antiga do Cloudinary
        if (fotoPublicId && funcionario.fotoPublicId && fotoPublicId !== funcionario.fotoPublicId) {
            try {
                await cloudinary.uploader.destroy(funcionario.fotoPublicId);
            } catch (error) {
                return NextResponse.json(
                    { message: "Erro ao deletar a imagem antiga do funcionário" },
                    { status: 500 }
                );
            }
        }

        await prisma.funcionario.update({
            where: { id },
            data: {
                nome,
                email,
                telefone,
                sobre,
                ...(fotoUrl && { fotoUrl }),
                ...(fotoPublicId && { fotoPublicId }),
                cargo
            },
        });

        return NextResponse.json(
            { message: "Funcionário atualizado com sucesso!" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao atualizar funcionário" },
            { status: 500 }
        );
    }
}

// DELETE /api/funcionario/:id
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = await params?.then((c) => c.id);
        if (!id) {
            return NextResponse.json(
                { message: "ID do funcionário é obrigatório" },
                { status: 400 }
            );
        }

        const funcionario = await prisma.funcionario.findUnique({
            where: {
                id: parseInt(id)
            },
        });

        if (!funcionario) {
            return NextResponse.json(
                { message: "Funcionário não encontrado" },
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

        // if (!funcionario || (funcionario.cargo !== "PROPRIETARIA" && funcionario.cargo !== "RH")) {
        //     return NextResponse.json(
        //         { message: "Acesso negado para deletar funcionário" },
        //         { status: 403 }
        //     );
        // }

        // Deletar a foto do Cloudinary antes de fazer o delete
        if (funcionario.fotoPublicId) {
            try {
                await cloudinary.uploader.destroy(funcionario.fotoPublicId);
            } catch (error) {
                return NextResponse.json(
                    { message: "Erro ao deletar a imagem do funcionário" },
                    { status: 500 }
                );
            }
        }

        await prisma.funcionario.update({
            where: { id: parseInt(id) },
            data: {
                deletedAt: new Date()
            }
        });

        return NextResponse.json(
            { message: "Funcionário removido com sucesso!" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao excluir funcionário" },
            { status: 500 }
        );
    }
}