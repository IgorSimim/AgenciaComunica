import { Cargo } from "@prisma/client";

export interface TEmpresa {
    cod: number;
    contratoId: number;
    cnpj: string;
    nome: string;
    email: string;
    senha: string;
    setor: string;
    logotipoUrl: string;
    logotipoPublicId: string;
    ativa: boolean;
    createdAt: Date;
    deletedAt: Date | null;
    updatedAt: Date;
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
        servico: TServico;
    }[];
}

export interface TFeedback {
    id: number;
    empresaCnpj: string;
    titulo: string;
    avaliacao: number;
    comentario: string;
    data: Date;
}

export interface TFuncionario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    sobre: string;
    dtnasc: Date;
    fotoUrl: string;
    fotoPublicId: string;
    cargo: Cargo;
    createdAt: Date;
    deletedAt: Date | null;
    updatedAt: Date;
    atividades: {
        id: number;
        funcionarioId: number;
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
            funcionarioId: number;
            descricao: string;
            data: Date;
        }[] | null;
    }[] | null;
}

export interface TServico {
    cod: number;
    funcionarioId: number;
    nome: string;
    descricao: string;
    preco: number;
    simboloUrl: string;
    simboloPublicId: string;
    createdAt: Date;
    updatedAt: Date;
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

export interface ContatoForm {
    nome: string;
    email: string;
    mensagem: string;
}

export interface DashboardType {
    empresas: number;
    funcionarios: number;
    servicos: number;
}