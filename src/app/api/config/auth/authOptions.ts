import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentias, req) {
        try {
          const response = await fetch(
            process.env.NEXTAUTH_URL + "/api/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentias?.email,
                senha: credentias?.senha,
              }),
            }
          );

          const data = await response.json();

          if (response.ok && data.empresa) {
            (req as any).empr = data.empresa;
            return data;
          }

          throw new Error(data.error || "Erro ao fazer login");
        } catch (error: any) {
          if (!error.message) {
            throw new Error("Erro ao conectar com o servidor");
          }
          throw error;
        }
      },
    }),
  ],

  pages: {
    signIn: "/",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as any).empresa = (user as any).empresa;
      return token;
    },
    async session({ session, token }) {
      (session as any).empresa = (token as any).empresa;
      return session;
    },
  },
};