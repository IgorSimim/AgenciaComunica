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
    logotipoUrl: 'http://example.com/logoA.png',
    logotipoPublicId: 'logoA',
    ativa: true,
  },
]

const ServicosData = [
  {
    nome: 'Marketing Digital',
    descricao: 'Serviços completos de marketing digital',
    preco: 1500.00,
    simboloUrl: 'http://example.com/logoA.png',
    simboloPublicId: 'logoA',
  },
  {
    nome: 'Design Gráfico',
    descricao: 'Criação de materiais visuais',
    preco: 800.00,
    simboloUrl: 'http://example.com/logoA.png',
    simboloPublicId: 'logoA',
  },
]

const FuncionariosData = [
  {
    nome: 'Proprietária da Empresa A',
    email: 'proprietaria@empresaA.com',
    senha: '-Senha123',
    telefone: '11999999999', 
    sobre: 'Proprietária e fundadora da empresa.',
    dtnasc: new Date('1985-03-15'),
    fotoUrl: 'http://example.com/logoA.png',
    fotoPublicId: 'logoA',
    cargo: 'PROPRIETARIA' as const,
  },
  {
    nome: 'Funcionário RH',
    email: 'funcionarioA@example.com',
    senha: '-Senha123',
    telefone: '11988888888', 
    sobre: 'Profissional experiente em recursos humanos.',
    dtnasc: new Date('1990-01-01'),
    fotoUrl: 'http://example.com/logoB.png',
    fotoPublicId: 'logoB',
    cargo: 'RH' as const,
  },
  {
    nome: 'Funcionário Redatora',
    email: 'funcionarioB@example.com',
    senha: '-Senha123',
    telefone: '11977777777', 
    sobre: 'Especialista em criação de conteúdo e redação.',
    dtnasc: new Date('1992-05-15'),
    fotoUrl: 'http://example.com/logoC.png',
    fotoPublicId: 'logoC',
    cargo: 'REDATORA' as const,
  },
]

export async function main() {
  const funcionarios = []
  
  // Criar funcionários
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

  // Criar empresas (usando o primeiro funcionário como proprietário)
  if (funcionarios.length > 0) {
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
  }

  // Criar serviços (usando o terceiro funcionário - redatora)
  if (funcionarios.length > 2) {
    for (const s of ServicosData) {
      await prisma.servico.create({
        data: {
          ...s,
          funcionario_id: funcionarios[2].id, 
        },
      })
    }
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