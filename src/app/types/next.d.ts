import { NextApiRequest } from 'next/server';

declare module 'next/server' {
    interface NextRequest {
        colaborador?: {
            id: string;
            email: string;
            cargo: 'PROPRIETARIA' | 'RH' | 'DESIGNER' | 'REDATORA' | 'VIDEOMAKER' | 'GESTORTRAFEGO';
        };

        empresa?: {
            cnpj: string;
            email: string;
        };
    }
}