import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma";
import { Atividade, Cargo, Comentario } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/config/auth/authOptions";

// GET /api/funcionario
export async function GET() {
    try {
        // const session = await getServerSession(authOptions);
        // if (!session?.funcionario?.email) {
        //     return NextResponse.json(
        //         { message: "Funcionário não autenticado" },
        //         { status: 401 }
        //     );
        // }
        
        // const funcionario = await prisma.funcionario.findUnique({
        //     where: { email: session.funcionario.email }
        // })

        // if (!funcionario || (funcionario.cargo !== "PROPRIETARIA" && funcionario.cargo !== "RH")) {
        //     return NextResponse.json(
        //         { message: "Somente a proprietária e os funcionários do RH" },
        //         { status: 403 }
        //     );
        // }

        const funcionarioEncontrado = await prisma.funcionario.findMany({
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

        if (!funcionarioEncontrado) {
            return NextResponse.json(
                { message: "Não existe funcionários cadastrados" },
                { status: 404 }
            );
        }

        return NextResponse.json(funcionarioEncontrado);
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar funcionários" },
            { status: 500 }
        );
    }
}

// POST /api/funcionario
export async function POST(
    _request: NextRequest
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.funcionario?.email) {
            return NextResponse.json(
                { message: "Funcionário não autenticado" },
                { status: 401 }
            )
        }

        const funcionario = await prisma.funcionario.findUnique({
            where: { email: session.funcionario.email },
        })

        // if (!funcionario || (funcionario.cargo !== "PROPRIETARIA" && funcionario.cargo !== "RH")) {
        //     return NextResponse.json(
        //         { message: "Acesso negado" },
        //         { status: 403 }
        //     )
        // }

        const data = await _request.json()

        const { nome, email, senha, telefone, sobre, dtnasc, foto, cargo } = data
        if (!nome || !email || !senha || !telefone || !sobre || !dtnasc || !cargo) {
            return NextResponse.json(
                { message: "Todos os campos são obrigatórios" },
                { status: 400 }
            )
        }

        const existingEmail = await prisma.funcionario.findUnique({
            where: { email }
        })

        if (existingEmail) {
            return NextResponse.json(
                { message: "Já existe um funcionário com este email" },
                { status: 400 }
            )
        }

        const existingTelefone = await prisma.funcionario.findUnique({
            where: { telefone }
        })

        if (existingTelefone) {
            return NextResponse.json(
                { message: "Já existe um funcionário com este telefone" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(senha, 10)

        const newFuncionario = await prisma.funcionario.create({
            data: {
                nome,
                email,
                senha: hashedPassword,
                telefone,
                sobre,
                dtnasc,
                foto: foto || '/uploads/funcionarios/default.png',
                cargo,
            },
        })

        return NextResponse.json(
            { funcionario: newFuncionario },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao criar funcionário" },
            { status: 500 }
        )
    }
}