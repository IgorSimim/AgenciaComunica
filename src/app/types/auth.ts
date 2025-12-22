import { Cargo } from "@prisma/client";

export type EmpresaLogin = {
    email: string;
    senha: string;
}

export type FuncionarioLogin = {
    email: string;
    senha: string;
}

export interface EmpresaSession {
    cod: number;
    cnpj: string;
    nome: string;
    email: string;
    logotipo: string;
}

export interface FuncionarioSession {
    id: number;
    nome: string;
    email: string;
    cargo: Cargo;
}