import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

// POST /api/loginempresa (Empresa)
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

        const empresa = await prisma.empresa.findUnique({
            where: { email }
        })

        if (!empresa || empresa.deletedAt || !empresa.ativa) {
            return NextResponse.json(
                { message: 'Email ou senha incorretos' },
                { status: 401 }
            )
        }

        const senhaValida = await bcryptjs.compare(senha, empresa.senha)
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
                cod: empresa.cod,
                cnpj: empresa.cnpj,
                email: empresa.email,
                nome: empresa.nome
            },
            secret,
            { expiresIn: '2h' }
        )

        return NextResponse.json({
            empresa: {
                cod: empresa.cod,
                cnpj: empresa.cnpj,
                nome: empresa.nome,
                email: empresa.email,
                setor: empresa.setor,
                logotipoUrl: empresa.logotipoUrl,
                ativa: empresa.ativa,
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
        console.error("Erro ao realizar login da empresa:", error)
        return NextResponse.json(
            { message: 'Erro ao realizar login' },
            { status: 500 }
        )
    }
} 