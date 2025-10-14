import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'


export async function POST(request: NextRequest) {
    try {
        const { email, senha } = await request.json()

        if (!email || !senha) {
            return NextResponse.json({ msg: 'Erro! Email e senha são obrigatórios.' }, { status: 400 })
        }

        const empresa = await prisma.empresa.findUnique({
            where: { email }
        })

        if (!empresa) {
            return NextResponse.json({ msg: 'Erro! Empresa não encontrada.' }, { status: 404 })
        }

        const senhaValida = await bcryptjs.compare(senha, empresa.senha)
        if (!senhaValida) {
            return NextResponse.json({ msg: 'Erro! Email ou senha incorreta.' }, { status: 401 })
        }

        const token = jwt.sign(
            {
                cnpj: empresa.cnpj,
                email: empresa.email,
                nome: empresa.nome
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '2h' }
        )

        // Remover a senha do objeto retornado
        const { senha: _, ...empresaSemSenha } = empresa

        return NextResponse.json({
            empresa: empresaSemSenha,
            token
        })
    } catch (error: any) {
        console.error('Erro no login da empresa:', error)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
} 