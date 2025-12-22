import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EmpresasData = [
  {
    cnpj: '12.345.678/0001-90',
    nome: 'Empresa A',
    email: 'empresaA@example.com',
    senha: '-Senha123',
    setor: 'Comércio',
    logotipo: 'http://example.com/logoA.png',
    ativa: true,
  },
]

const ServicosData = [
  {
    nome: 'Marketing Digital',
    descricao: 'Serviços completos de marketing digital',
    preco: 1500.00,
    simbolo: 'http://example.com/logoA.png',
  },
  {
    nome: 'Design Gráfico',
    descricao: 'Criação de materiais visuais',
    preco: 800.00,
    simbolo: 'http://example.com/logoA.png',
  },
]

const FuncionariosData = [
  {
    nome: 'Funcionário A',
    email: 'funcionarioA@example.com',
    senha: '-Senha123',
    telefone: '11999999999', 
    sobre: 'Profissional experiente em diversas áreas.',
    dtnasc: new Date('1990-01-01'),
    foto: 'http://example.com/logoA.png',
    cargo: 'RH' as const,
  },

  {
    nome: 'Funcionário B',
    email: 'funcionarioB@example.com',
    senha: '-Senha123',
    telefone: '11988888888', 
    sobre: 'Especialista em tecnologia e desenvolvimento de software.',
    dtnasc: new Date('1992-05-15'),
    foto: 'http://example.com/logoB.png',
    cargo: 'REDATORA' as const,
  },
]

export async function main() {
  const funcionarios = []
  for (const c of FuncionariosData) {
    const hashedPassword = await bcrypt.hash(c.senha, 10);
    const funcionario = await prisma.funcionario.create({
      data: {
        ...c,
        senha: hashedPassword,
      },
    })
    funcionarios.push(funcionario)
  }

  for (const e of EmpresasData) {
    const hashedPassword = await bcrypt.hash(e.senha, 10);
    await prisma.empresa.create({
      data: {
        ...e,
        senha: hashedPassword,
        funcionario_id: funcionarios[0].id, 
      },
    })
  }

  for (const s of ServicosData) {
    await prisma.servico.create({
      data: {
        ...s,
        funcionario_id: funcionarios[1].id, 
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