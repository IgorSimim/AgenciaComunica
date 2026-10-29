import { Cargo } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    funcionario?: {
      id: string;
      email: string;
      nome: string;
      cargo: Cargo;
    };

    empresa?: {
      cod: number;
      cnpj: string;
      email: string;
      nome: string;
      logotipoUrl: string;
    };
  }

  interface User {
    funcionario?: {
      id: string;
      email: string;
      nome: string;
      cargo: Cargo;
    };
    empresa?: {
      cod: number;
      cnpj: string;
      email: string;
      nome: string;
      logotipoUrl: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    funcionario?: {
      id: string;
      email: string;
      nome: string;
      cargo: Cargo;
    };
    empresa?: {
      cod: number;
      cnpj: string;
      email: string;
      nome: string;
      logotipoUrl: string;
    };
  }
}