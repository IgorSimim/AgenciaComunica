import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

// POST /api/logincontratado (Contratado)
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

        const contratado = await prisma.contratado.findUnique({
            where: { email }
        })

        if (!contratado) {
            return NextResponse.json(
                { message: 'Contratado não encontrado' },
                { status: 404 }
            )
        }

        const senhaValida = await bcryptjs.compare(senha, contratado.senha)
        if (!senhaValida) {
            return NextResponse.json(
                { message: 'Email ou senha incorreta' },
                { status: 401 })
        }

        const token = jwt.sign(
            {
                id: contratado.id,
                email: contratado.email,
                nome: contratado.nome
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '2h' }
        )

        // Remover a senha do objeto retornado
        const { senha: _, ...contratadoSemSenha } = contratado

        return NextResponse.json({
            contratado: contratadoSemSenha,
            token
        })
    } catch (error) {
        return NextResponse.json(
            { message: 'Erro ao realizar login' },
            { status: 500 }
        )
    }
} 