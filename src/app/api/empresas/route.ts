import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
// import { authOptions } from "../config/auth/authOptions";
// import { getServerSession } from "next-auth";

export async function GET() {
    try {
        const empresas = await prisma.empresa.findMany({
            include: {
                feedbacks: true,
                contratos: {
                    include: {
                        servico: true,
                    },
                },
            },
        });

        return NextResponse.json(empresas, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar empresas:", error);
        return NextResponse.json(
            { message: "Erro ao buscar empresas" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // const session = await getServerSession(authOptions);
        // if (!session?.user?.email) {
        //     return NextResponse.json(
        //         { message: "Usuário não autenticado" },
        //         { status: 401 }
        //     );
        // }

        // const colaborador = await prisma.colaborador.findUnique({
        //     where: { email: session.user.email },
        // });
        
        // if (!colaborador || colaborador.cargo !== "REDATORA" || colaborador.cargo !== "PROPRIETARIA") {
        //     return NextResponse.json(
        //         { message: "Acesso negado" },
        //         { status: 403 }
        //     );
        // }

        const data = await request.json();
        const { cnpj, nome, email, senha, setor, logotipo } = data;

        if (!cnpj || !nome || !email || !senha || !setor || !logotipo) {
            return NextResponse.json(
                { message: "Todos os campos são obrigatórios" },
                { status: 400 }
            );
        }

        const existingEmpresa = await prisma.empresa.findUnique({
            where: { email },
        });

        if (existingEmpresa) {
            return NextResponse.json(
                { message: "Empresa com este email já existe" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const newEmpresa = await prisma.empresa.create({
            data: {
                cnpj,
                nome,
                email,
                senha: hashedPassword,
                setor,
                logotipo,
            },
        });

        return NextResponse.json({ empresa: newEmpresa }, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar empresa:", error);
        return NextResponse.json(
            { message: "Erro ao criar empresa" },
            { status: 500 }
        );
    }
}