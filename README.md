<div align="center">
  <img src="public/logo.png" alt="Agência Comunica Logo" width="150" height="auto">
  <h1>Agência Comunica — Sistema de Gestão</h1>
  <p>Plataforma web para gestão de agência de marketing digital</p>

  ![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-336791?logo=postgresql)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
</div>

---

## Visão Geral

Sistema completo que conecta a equipe interna da agência com empresas clientes, centralizando gestão de contratos, atividades, projetos, feedbacks e arquivos em uma única plataforma.

## Funcionalidades

| Área | Funcionalidades |
|------|----------------|
| **Funcionários** | Gestão de equipe, atividades, comentários, upload de arquivos, dashboard com métricas |
| **Empresas** | Visualização de contratos, envio de feedbacks, acompanhamento de projetos |
| **Serviços** | Catálogo de serviços com preços e símbolos |
| **Contratos** | Relacionamento empresa-serviço com termos e vigência |

## Stack

- **Framework**: Next.js 15 com Turbopack e App Router
- **Linguagem**: TypeScript 5
- **Banco de dados**: PostgreSQL + Prisma 6
- **Autenticação**: NextAuth.js 4 + JWT + bcryptjs
- **Estilização**: Tailwind CSS 4
- **Upload de mídia**: Cloudinary
- **Formulários**: React Hook Form
- **Notificações**: Sonner + SweetAlert2
- **Gráficos**: React Google Charts
- **Email**: Nodemailer

## Pré-requisitos

- Node.js 18+
- PostgreSQL
- Conta no [Cloudinary](https://cloudinary.com)

## Instalação

```bash
# 1. Clone e instale dependências
git clone <repository-url>
cd AgenciaComunica
npm install

# 2. Configure as variáveis de ambiente
cp .env.example .env
```

Edite o `.env`:

```env
# Banco de dados
DATABASE_URL=postgresql://user:password@localhost:5432/agenciacomunica_db

# NextAuth
NEXTAUTH_URL=http://localhost:4000
NEXTAUTH_SECRET=sua_chave_secreta_32_caracteres

# JWT
JWT_SECRET=sua_chave_jwt

# Email
EMAIL=seu_email@gmail.com
GMAIL_APP_PASSWORD=sua_senha_de_app

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
```

```bash
# 3. Configure o banco de dados
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed   # opcional — dados iniciais

# 4. Inicie o servidor (porta 4000)
npm run dev
```

## Docker

```bash
docker-compose up -d
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (porta 4000) |
| `npm run build` | Build para produção |
| `npm start` | Executa o build de produção |
| `npm run lint` | ESLint |
| `npm run prisma:generate` | Gera o cliente Prisma |
| `npm run prisma:migrate` | Executa migrations (dev) |
| `npm run prisma:migrate:prod` | Executa migrations (produção) |
| `npm run prisma:push` | Sincroniza schema sem migration |
| `npm run prisma:seed` | Popula dados iniciais |
| `npm run prisma:studio` | Interface visual do banco |
| `npm run prisma:migrate:reset` | Reseta o banco de dados |
| `npm run prisma:migrate:status` | Status das migrations |

## Estrutura de Pastas

```
src/
├── actions/               # Server actions (login de empresa e funcionário)
├── app/
│   ├── (admin-routes)/    # Área administrativa — funcionários
│   ├── (auth-routes)/     # Páginas de login
│   ├── (empresa-routes)/  # Área do cliente
│   ├── (index)/           # Páginas públicas
│   ├── api/               # API routes
│   ├── components/        # Componentes reutilizáveis
│   ├── providers/         # Context providers
│   ├── styles/            # Estilos globais
│   └── types/             # Tipos TypeScript
├── hooks/                 # Custom hooks (ex: useImageUpload)
├── lib/                   # Configurações (auth, prisma, cloudinary, alerts)
└── middleware.ts          # Proteção de rotas por tipo de usuário
```

## Rotas

### Públicas
| Rota | Descrição |
|------|-----------|
| `/` | Homepage |
| `/sobre-nos` | Sobre a agência |
| `/funcionarios` | Equipe |
| `/contate-nos` | Contato |

### Autenticação
| Rota | Descrição |
|------|-----------|
| `/loginfuncionario` | Login da equipe interna |
| `/loginempresa` | Login das empresas clientes |

### Área Administrativa (Funcionários)
| Rota | Descrição |
|------|-----------|
| `/dashboard` | Dashboard com métricas |
| `/funcionario` | Gestão de funcionários |
| `/empresa` | Gestão de empresas clientes |
| `/servico` | Gestão de serviços |

### Área do Cliente (Empresas)
| Rota | Descrição |
|------|-----------|
| `/home-empresa` | Dashboard da empresa |

## Modelo de Dados

```
Funcionario ──< Atividade ──< Arquivo
                           ──< Comentario >── Funcionario
           ──< Empresa ──< Contrato >── Servico
                       ──< Feedback
           ──< Servico

Projeto (independente)
```

**Cargos disponíveis**: `PROPRIETARIA` · `RH` · `DESIGNER` · `REDATORA` · `VIDEOMAKER` · `GESTORTRAFEGO`

## Autenticação e Segurança

- Dois fluxos de autenticação independentes: funcionários e empresas
- Tokens JWT verificados via middleware em todas as rotas protegidas
- Senhas armazenadas com hash bcryptjs
- Redirecionamento automático baseado no tipo de usuário

## Licença

MIT — veja o arquivo [LICENSE](LICENSE).

---

<div align="center">
  Desenvolvido com ❤️ pela equipe Agência Comunica<br>
  <a href="mailto:igorleonsimim@gmail.com">igorleonsimim@gmail.com</a> · (31) 98768-5091 · Pelotas, RS
</div>
