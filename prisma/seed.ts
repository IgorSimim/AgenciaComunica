import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EmpresasData: Prisma.EmpresaCreateInput[] = [
  {
    cnpj: '12.345.678/0001-90',
    nome: 'Empresa A',
    email: 'empresaA@example.com',
    senha: '-Senha123',
    setor: 'Comércio',
    logotipo: 'http://example.com/logoA.png',
    ativa: true,
    feedbacks: { create: [] },
    contratos: { create: [] },
  },
]

export async function main() {
  for (const e of EmpresasData) {
    const hashedPassword = await bcrypt.hash(e.senha, 10);
    await prisma.empresa.create({
      data: {
        ...e,
        senha: hashedPassword,
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })