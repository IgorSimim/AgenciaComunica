import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma";
import { Atividade, Cargo, Comentario } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/config/auth/authOptions";

// GET /api/contratado
export async function GET() {
    try {
        // const session = await getServerSession(authOptions);
        // if (!session?.contratado?.email) {
        //     return NextResponse.json(
        //         { message: "Contratado não autenticado" },
        //         { status: 401 }
        //     );
        // }
        
        // const contratado = await prisma.contratado.findUnique({
        //     where: { email: session.contratado.email }
        // })

        // if (!contratado || (contratado.cargo !== "PROPRIETARIA" && contratado.cargo !== "RH")) {
        //     return NextResponse.json(
        //         { message: "Somente a proprietária e os contratadoes do RH" },
        //         { status: 403 }
        //     );
        // }

        const contratadoEncontrado = await prisma.contratado.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                sobre: true,
                dtnasc: true,
                foto: true,
                cargo: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
                atividades: true,
                comentarios: true
            },
            where: {
                deletedAt: null
            },
            orderBy: { id: 'asc' },
        });

        if (!contratadoEncontrado) {
            return NextResponse.json(
                { message: "Não existe contratadoes cadastrados" },
                { status: 404 }
            );
        }

        return NextResponse.json(contratadoEncontrado);
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar contratadoes" },
            { status: 500 }
        );
    }
}

// POST /api/contratado
export async function POST(
    _request: NextRequest
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.contratado?.email) {
            return NextResponse.json(
                { message: "Contratado não autenticado" },
                { status: 401 }
            )
        }

        const contratado = await prisma.contratado.findUnique({
            where: { email: session.contratado.email },
        })

        // if (!contratado || (contratado.cargo !== "PROPRIETARIA" && contratado.cargo !== "RH")) {
        //     return NextResponse.json(
        //         { message: "Acesso negado" },
        //         { status: 403 }
        //     )
        // }

        const data = await _request.json()

        const { nome, email, senha, telefone, sobre, dtnasc, foto, cargo } = data
        if (!nome || !email || !senha || !telefone || !sobre || !dtnasc || !foto || !cargo) {
            return NextResponse.json(
                { message: "Todos os campos são obrigatórios" },
                { status: 400 }
            )
        }

        const existingEmail = await prisma.contratado.findUnique({
            where: { email }
        })

        if (existingEmail) {
            return NextResponse.json(
                { message: "Já existe um contratado com este email" },
                { status: 400 }
            )
        }

        const existingTelefone = await prisma.contratado.findUnique({
            where: { telefone }
        })

        if (existingTelefone) {
            return NextResponse.json(
                { message: "Já existe um contratado com este telefone" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(senha, 10)

        const newContratado = await prisma.contratado.create({
            data: {
                nome,
                email,
                senha: hashedPassword,
                telefone,
                sobre,
                dtnasc,
                foto,
                cargo,
            },
        })

        return NextResponse.json(
            { contratado: newContratado },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao criar contratado" },
            { status: 500 }
        )
    }
}