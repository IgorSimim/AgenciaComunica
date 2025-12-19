import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

// Validação do NEXTAUTH_SECRET
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET não está configurado nas variáveis de ambiente");
}

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
      async authorize(credentials, req) {
        const { email, senha, type } = credentials || {};

        if (!email || !senha || !type) {
          throw new Error("Campos obrigatórios faltando");
        }

        try {
          if (type === "empresa") {
            const empresa = await prisma.empresa.findUnique({
              where: { email },
            });

            if (!empresa) {
              throw new Error("Empresa não encontrada");
            }

            const senhaValida = await bcryptjs.compare(senha, empresa.senha);
            if (!senhaValida) {
              throw new Error("Email ou senha incorreta");
            }

            return {
              id: empresa.cod.toString(),
              email: empresa.email,
              empresa
            };
          } else if (type === "contratado") {
            const contratado = await prisma.contratado.findUnique({
              where: { email },
            });

            if (!contratado) {
              throw new Error("Contratado não encontrado");
            }

            const senhaValida = await bcryptjs.compare(senha, contratado.senha);
            if (!senhaValida) {
              throw new Error("Email ou senha incorreta");
            }

            return {
              id: contratado.id.toString(),
              email: contratado.email,
              contratado
            };
          } else {
            throw new Error("Tipo inválido");
          }
        } catch (error: any) {
          throw new Error(error.message || "Erro ao fazer login");
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
        if ((user as any).empresa) (token as any).empresa = (user as any).empresa;
        if ((user as any).contratado) (token as any).contratado = (user as any).contratado;
      }
      return token;
    },
    async session({ session, token }) {
      if ((token as any).empresa) (session as any).empresa = (token as any).empresa;
      if ((token as any).contratado) (session as any).contratado = (token as any).contratado;
      return session;
    },
  },
};