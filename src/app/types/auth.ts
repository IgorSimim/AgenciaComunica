export type ContratadoCargo = 'PROPRIETARIA' | 'RH' | 'DESIGNER' | 'REDATORA' | 'VIDEOMAKER' | 'GESTORTRAFEGO';

export type EmpresaLogin = {
    email: string;
    senha: string;
}

export type ContratadoLogin = {
    email: string;
    senha: string;
}

export interface Empresa {
    cnpj: string;
    email: string;
    senha: string;
}

export interface Contratado {
    id: number;
    email: string;
    senha: string;
    cargo: ContratadoCargo;
}