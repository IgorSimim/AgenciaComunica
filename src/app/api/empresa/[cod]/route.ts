import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/config/auth/authOptions";

// PUT /api/empresa/:cod
export async function PUT(
    _request: NextRequest,
    { params }: { params: Promise<{ cod: string }> }
) {
    try {
        const codStr = await params?.then((e) => e.cod);
        if (!codStr) {
            return NextResponse.json(
                { message: "Código da empresa é obrigatório" },
                { status: 400 }
            );
        }

        const cod = parseInt(codStr, 10);
        if (isNaN(cod)) {
            return NextResponse.json(
                { message: "Código da empresa deve ser um número válido" },
                { status: 400 }
            );
        }

        const empresa = await prisma.empresa.findFirst({
            where: {
                cod: cod
            },
        });

        if (!empresa) {
            return NextResponse.json(
                { message: "Empresa não encontrada" },
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

        // const contratado = await prisma.contratado.findUnique({
        //     where: { email: session.contratado.email }
        // });

        // if (!contratado || contratado.cargo !== "RH") {
        //     return NextResponse.json(
        //         { message: "Acesso negado para atualizar os dados da empresa" },
        //         { status: 403 }
        //     );
        // }

        const dadosAtualizados = await _request.json();

        const { nome, email, setor, logotipo, ativa } = dadosAtualizados;
        if (!nome || !email || !setor || !logotipo) {
            return NextResponse.json(
                { message: "Todos os campos são obrigatórios" },
                { status: 400 }
            );
        }

        await prisma.empresa.update({
            where: { cod },
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

// SOFTDELETE /api/empresa/:cod
// export async function DELETE(
//     _request: NextRequest,
//     { params }: { params: Promise<{ cod: string }> }
// ) {
//     try {
//         const codStr = await params?.then((e) => e.cod);
//         if (!codStr) {
//             return NextResponse.json(
//                 { message: "Código da empresa é obrigatório" },
//                 { status: 400 }
//             );
//         }

//         const cod = parseInt(codStr, 10);
//         if (isNaN(cod)) {
//             return NextResponse.json(
//                 { message: "Código da empresa deve ser um número válido" },
//                 { status: 400 }
//             );
//         }

//         const empresa = await prisma.empresa.findFirst({
//             where: {
//                 cod: cod
//             },
//         });

//         if (!empresa) {
//             return NextResponse.json(
//                 { message: "Empresa não encontrada" },
//                 { status: 404 }
//             );
//         }

//         const session = await getServerSession(authOptions);
//         if (!session?.contratado?.email) {
//             return NextResponse.json(
//                 { message: "Contratado não autenticado" },
//                 { status: 401 }
//             );
//         }

//         // const contratado = await prisma.contratado.findUnique({
//         //     where: { email: session.contratado.email }
//         // });

//         // if (!contratado || contratado.cargo !== "RH") {
//         //     return NextResponse.json(
//         //         { message: "Acesso negado para deletar a empresa" },
//         //         { status: 403 }
//         //     );
//         // }

//         await prisma.empresa.update({
//             where: { cod },
//             data: {
//                 ativa: false
//             },
//         });

//         return NextResponse.json(
//             { message: "Empresa desativada com sucesso!" },
//             { status: 200 }
//         );
//     } catch (error) {
//         return NextResponse.json(
//             { message: "Erro ao desativar empresa" },
//             { status: 500 }
//         );
//     }
// }

// GET /api/empresa/:cod
export async function GET(
    _request: NextRequest,
    { params }: { params: { cod: string } }
) {
    try {
        const { cod: codStr } = params;
        if (!codStr) {
            return NextResponse.json(
                { message: "Código da empresa é obrigatório" },
                { status: 400 }
            );
        }

        const cod = parseInt(codStr, 10);
        if (isNaN(cod)) {
            return NextResponse.json(
                { message: "Código da empresa deve ser um número válido" },
                { status: 400 }
            );
        }

        const empresa = await prisma.empresa.findFirst({
            where: {
                cod: cod
            },
        });

        if (!empresa) {
            return NextResponse.json(
                { message: "Empresa não encontrada" },
                { status: 404 }
            );
        }

        return NextResponse.json(empresa, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar empresa" },
            { status: 500 }
        );
    }
}