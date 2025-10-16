import { Cargo } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    colaborador: {
      id: string;
      email: string;
      nome: string;
      cargo: Cargo;
    };

    empresa: {
      cnpj: string;
      email: string;
      nome: string;
      logotipo: string;
    };
  }
}