import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcryptjs from "bcryptjs"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        senha: { label: "Senha", type: "password" },
        type: { label: "Type", type: "text" },
      },
      async authorize(credentials) {
        const { email, senha, type } = credentials || {}

        if (!email || !senha || !type) {
          throw new Error("Campos obrigatórios faltando")
        }

        try {
          // Login como empresa
          if (type === "empresa") {
            const empresa = await prisma.empresa.findFirst({
              where: { email, deletedAt: null, ativa: true },
            })

            if (!empresa) {
              throw new Error("Email ou senha incorretos")
            }

            const senhaValida = await bcryptjs.compare(senha, empresa.senha)
            if (!senhaValida) {
              throw new Error("Email ou senha incorreta")
            }

            return {
              id: empresa.cod.toString(),
              email: empresa.email,
              empresa: {
                cod: empresa.cod,
                cnpj: empresa.cnpj,
                nome: empresa.nome,
                email: empresa.email,
                logotipoUrl: empresa.logotipoUrl,
              },
            }
          } 
          
          // Login como funcionário
          if (type === "funcionario") {
            const funcionario = await prisma.funcionario.findUnique({
              where: { email, deletedAt: null },
            })

            if (!funcionario) {
              throw new Error("Email ou senha incorretos")
            }

            const senhaValida = await bcryptjs.compare(senha, funcionario.senha)
            if (!senhaValida) {
              throw new Error("Email ou senha incorreta")
            }

            return {
              id: funcionario.id.toString(),
              email: funcionario.email,
              funcionario: {
                id: funcionario.id.toString(),
                email: funcionario.email,
                nome: funcionario.nome,
                cargo: funcionario.cargo,
              },
            }
          } else {
            throw new Error("Tipo inválido")
          }
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Erro ao fazer login")
        }
      },
    }),
  ],

  pages: {
    signIn: "/",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },

  jwt: {
    maxAge: 24 * 60 * 60, // 24 horas
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (user.empresa) token.empresa = user.empresa
        if (user.funcionario) token.funcionario = user.funcionario
      }
      return token
    },
    async session({ session, token }) {
      if (token.empresa) {
        session.empresa = {
          cod: token.empresa.cod,
          cnpj: token.empresa.cnpj,
          nome: token.empresa.nome,
          email: token.empresa.email,
          logotipoUrl: token.empresa.logotipoUrl,
        }
      }
      if (token.funcionario) {
        session.funcionario = {
          id: token.funcionario.id,
          email: token.funcionario.email,
          nome: token.funcionario.nome,
          cargo: token.funcionario.cargo,
        }
      }
      return session
    },
  },
}