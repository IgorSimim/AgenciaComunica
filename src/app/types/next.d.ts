import { NextApiRequest } from 'next/server';

declare module 'next/server' {
    interface NextRequest {
        empresa?: {
            cnpj: string;
            email: string;
        };
    }
}