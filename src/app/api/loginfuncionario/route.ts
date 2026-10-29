import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

// POST /api/loginfuncionario (Funcionário)
export async function POST(
    _request: NextRequest
) {
    try {
        const body = await _request.json()
        const { email, senha } = body

        if (!email || !senha) {
            return NextResponse.json(
                { message: 'Email e senha são obrigatórios' },
                { status: 400 }
            )
        }

        const funcionario = await prisma.funcionario.findUnique({
            where: { email },
        })

        if (!funcionario || funcionario.deletedAt) {
            return NextResponse.json(
                { message: 'Email ou senha incorretos' },
                { status: 401 }
            )
        }

        const senhaValida = await bcryptjs.compare(senha, funcionario.senha)
        if (!senhaValida) {
            return NextResponse.json(
                { message: 'Email ou senha incorreta' },
                { status: 401 })
        }

        const secret = process.env.JWT_SECRET
        if (!secret) {
            throw new Error("JWT_SECRET não configurado")
        }

        const token = jwt.sign(
            {
                id: funcionario.id,
                email: funcionario.email,
                nome: funcionario.nome
            },
            secret,
            { expiresIn: '2h' }
        )

        return NextResponse.json({
            funcionario: {
                id: funcionario.id,
                nome: funcionario.nome,
                email: funcionario.email,
                cargo: funcionario.cargo,
            },
            token
        })
    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { message: "Corpo da requisição inválido" },
                { status: 400 }
            )
        }
        console.error("Erro ao realizar login do funcionário:", error)
        return NextResponse.json(
            { message: 'Erro ao realizar login' },
            { status: 500 }
        )
    }
} 