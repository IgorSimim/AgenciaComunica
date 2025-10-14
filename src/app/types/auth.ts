export type ColaboradorCargo = 'PROPRIETARIA' | 'RH' | 'DESIGNER' | 'REDATORA' | 'VIDEOMAKER' | 'GESTORTRAFEGO';

export interface Empresa {
    cnpj: string;
    email: string;
    senha: string;
}

export interface Colaborador {
    id: number;
    email: string;
    senha: string;
    cargo: ColaboradorCargo;
}