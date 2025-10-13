import { Cargo } from "@/generated/prisma";

export interface Empresa {
    cnpj: string;
    nome: string;
    email: string;
    senha: string;
    setor: string;
    logotipo: string;
    feedbacks: {
        id: number;
        empresaCnpj: string;
        titulo: string;
        avaliacao: number;
        comentario: string;
        data: Date;
    }[] | null;
    contratos: {
        id: number;
        empresaCnpj: string;
        servicoId: number;
        termos: string;
        dataInicio: Date;
        dataFim: Date;
        valorTotal: number;
        servico: Servico;
    }[];
}

export interface Feedback {
    id: number;
    empresaCnpj: string;
    titulo: string;
    avaliacao: number;
    comentario: string;
    data: Date;
}

export interface Colaborador {
    id: number;
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    sobre: string;
    dtnasc: Date;
    foto: string;
    cargo: Cargo;
    atividades: {
        id: number;
        colaboradorId: number;
        descricao: string;
        prioridade: string;
        status: string;
        ultimaModificacao: Date;
        arquivos: {
            id: number;
            atividadeId: number;
            nome: string;
            url: string;
            tipo: string;
            uploadData: Date;
        }[] | null;
        comentarios: {
            id: number;
            atividadeId: number;
            colaboradorId: number;
            descricao: string;
            data: Date;
        }[] | null;
    }[] | null;
}

export interface Servico {
    cod: number;
    nome: string;
    descricao: string;
    preco: number;
    simbolo: string;
    contratos: {
        id: number;
        empresaCnpj: string;
        servicoId: number;
        termos: string;
        dataInicio: Date;
        dataFim: Date;
        valorTotal: number;
    }[] | null;
}

export type EmpresaLogin = {
    email: string;
    senha: string;
};