export type ContratadoCargo = 'PROPRIETARIA' | 'RH' | 'DESIGNER' | 'REDATORA' | 'VIDEOMAKER' | 'GESTORTRAFEGO';

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