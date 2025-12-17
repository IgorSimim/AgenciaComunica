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

const ContratadosData: Prisma.ContratadoCreateInput[] = [
  {
    nome: 'Contratado A',
    email: 'contratadoA@example.com',
    senha: '-Senha123',
    telefone: '11999999999', 
    sobre: 'Profissional experiente em diversas áreas.',
    dtnasc: new Date('1990-01-01'),
    foto: 'http://example.com/logoA.png',
    cargo: 'RH',
    atividades: { create: [] },
    comentarios: { create: [] },
  },

  {
    nome: 'Contratado B',
    email: 'contratadoB@example.com',
    senha: '-Senha123',
    telefone: '11988888888', 
    sobre: 'Especialista em tecnologia e desenvolvimento de software.',
    dtnasc: new Date('1992-05-15'),
    foto: 'http://example.com/logoB.png',
    cargo: 'REDATORA',
    atividades: { create: [] },
    comentarios: { create: [] },
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

  for (const c of ContratadosData) {
    const hashedPassword = await bcrypt.hash(c.senha, 10);
    await prisma.contratado.create({
      data: {
        ...c,
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