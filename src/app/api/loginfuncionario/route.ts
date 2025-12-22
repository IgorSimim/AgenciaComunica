import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

// POST /api/loginfuncionario (Funcionário)
export async function POST(
    _request: NextRequest
) {
    try {
        const { email, senha } = await _request.json()

        if (!email || !senha) {
            return NextResponse.json(
                { message: 'Email e senha são obrigatórios' },
                { status: 400 }
            )
        }

        const funcionario = await prisma.funcionario.findUnique({
            where: { email }
        })

        if (!funcionario) {
            return NextResponse.json(
                { message: 'Funcionário não encontrado' },
                { status: 404 }
            )
        }

        const senhaValida = await bcryptjs.compare(senha, funcionario.senha)
        if (!senhaValida) {
            return NextResponse.json(
                { message: 'Email ou senha incorreta' },
                { status: 401 })
        }

        const token = jwt.sign(
            {
                id: funcionario.id,
                email: funcionario.email,
                nome: funcionario.nome
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '2h' }
        )

        // Remover a senha do objeto retornado
        const { senha: _, ...funcionarioSemSenha } = funcionario

        return NextResponse.json({
            funcionario: funcionarioSemSenha,
            token
        })
    } catch (error) {
        return NextResponse.json(
            { message: 'Erro ao realizar login' },
            { status: 500 }
        )
    }
} 