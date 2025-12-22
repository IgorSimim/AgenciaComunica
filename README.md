<div align="center">
  <img src="public/logo.png" alt="Agência Comunica Logo" width="150" height="auto">
  <h1>Agência Comunica - Sistema de Gestão</h1>
</div>

Sistema completo de gestão para agência de marketing digital, desenvolvido com Next.js 15, oferecendo soluções integradas para empresas e funcionários.

## 📋 Visão Geral

A **Agência Comunica** é uma plataforma web que conecta empresas clientes com uma equipe especializada em marketing digital, oferecendo gestão de projetos, contratos, atividades e comunicação centralizada.

### 🎯 Principais Funcionalidades

- **Gestão de Empresas**: Cadastro e gerenciamento de empresas clientes
- **Gestão de Funcionários**: Controle de equipe com diferentes cargos e permissões
- **Sistema de Contratos**: Criação e acompanhamento de contratos de serviços
- **Gestão de Atividades**: Organização de tarefas com status e prioridades
- **Sistema de Feedbacks**: Avaliações e comentários dos clientes
- **Upload de Arquivos**: Integração com Cloudinary para gestão de mídia
- **Dashboard Analytics**: Visualização de dados e métricas

## 🏗️ Arquitetura do Sistema

### 🔐 Sistema de Autenticação

O sistema possui **dois tipos de usuários** com autenticação separada:

#### **Funcionários** (Área Administrativa)
- **Cargos disponíveis**: Proprietária, RH, Designer, Redatora, Videomaker, Gestor de Tráfego
- **Acesso**: Dashboard administrativo completo
- **Rotas protegidas**: `/dashboard/*`, `/funcionario/*`, `/empresa/*`, `/servico/*`
- **Login**: `/loginfuncionario`

#### **Empresas** (Área do Cliente)
- **Acesso**: Área restrita para clientes
- **Funcionalidades**: Visualização de contratos, envio de feedbacks, acompanhamento de projetos
- **Rotas protegidas**: `/home-empresa/*`
- **Login**: `/loginempresa`

### 🛡️ Middleware de Segurança

```typescript
// Proteção de rotas baseada em roles
- Verificação automática de tokens JWT
- Redirecionamento baseado no tipo de usuário
- Controle de acesso granular por área
```

### 🗄️ Estrutura do Banco de Dados

**Tecnologia**: PostgreSQL com Prisma ORM

#### Principais Entidades:

- **Funcionario**: Gestão da equipe interna
- **Empresa**: Cadastro de clientes
- **Servico**: Catálogo de serviços oferecidos
- **Contrato**: Relacionamento empresa-serviço
- **Atividade**: Tarefas e projetos
- **Feedback**: Avaliações dos clientes
- **Arquivo**: Gestão de documentos e mídias

## 🚀 Tecnologias Utilizadas

### **Frontend & Backend**
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **React Hook Form** - Gerenciamento de formulários

### **Autenticação & Segurança**
- **NextAuth.js** - Autenticação
- **JWT** - Tokens de sessão
- **bcryptjs** - Hash de senhas

### **Banco de Dados**
- **PostgreSQL** - Banco principal
- **Prisma** - ORM e migrations

### **Upload & Mídia**
- **Cloudinary** - Armazenamento de imagens
- **Custom hooks** - Gestão de uploads

### **UI/UX**
- **Lucide React** - Ícones
- **React Icons** - Biblioteca de ícones
- **SweetAlert2** - Alertas e modais
- **Sonner** - Notificações toast

### **Analytics & Charts**
- **React Google Charts** - Gráficos e relatórios

## 📦 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+
- PostgreSQL
- Conta Cloudinary (para uploads)

### **1. Clone o repositório**
```bash
git clone <repository-url>
cd AgenciaComunica
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/agenciacomunica_db

# NextAuth
NEXTAUTH_URL=http://localhost:4000
NEXTAUTH_SECRET=sua_chave_secreta_32_caracteres

# JWT
JWT_SECRET=sua_chave_jwt

# Email (para notificações)
EMAIL=seu_email@gmail.com
GMAIL_APP_PASSWORD=sua_senha_de_app

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
```

### **4. Configure o banco de dados**
```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Popular dados iniciais (opcional)
npm run prisma:seed
```

### **5. Execute o projeto**
```bash
# Desenvolvimento (porta 4000)
npm run dev

# Produção
npm run build
npm start
```

## 🐳 Docker

O projeto inclui configuração Docker para deploy simplificado:

```bash
# Build da imagem
docker build -t agencia-comunica .

# Executar com docker-compose
docker-compose up -d
```

## 📁 Estrutura de Pastas

```
src/
├── actions/           # Server actions para autenticação
├── app/
│   ├── (admin-routes)/    # Rotas administrativas
│   ├── (auth-routes)/     # Páginas de login
│   ├── (empresa-routes)/  # Área do cliente
│   ├── (index)/          # Páginas públicas
│   ├── api/              # API routes
│   ├── components/       # Componentes reutilizáveis
│   └── types/           # Definições TypeScript
├── hooks/            # Custom hooks
├── lib/              # Utilitários e configurações
└── middleware.ts     # Middleware de autenticação
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento (porta 4000)

# Build
npm run build           # Build para produção
npm start              # Executar build de produção

# Banco de dados
npm run prisma:studio      # Interface visual do banco
npm run prisma:migrate     # Executar migrations
npm run prisma:seed        # Popular dados iniciais
npm run prisma:generate    # Gerar cliente Prisma

# Qualidade de código
npm run lint              # ESLint
```

## 🌐 Rotas Principais

### **Públicas**
- `/` - Homepage
- `/sobre-nos` - Sobre a agência
- `/funcionarios` - Equipe
- `/contate-nos` - Contato

### **Autenticação**
- `/loginempresa` - Login de empresas
- `/loginfuncionario` - Login de funcionários

### **Área Administrativa** (Funcionários)
- `/dashboard` - Dashboard principal
- `/funcionario` - Gestão de funcionários
- `/empresa` - Gestão de empresas
- `/servico` - Gestão de serviços

### **Área do Cliente** (Empresas)
- `/home-empresa` - Dashboard da empresa

## 🔒 Segurança

- **Autenticação JWT** com NextAuth.js
- **Middleware de proteção** de rotas
- **Hash de senhas** com bcryptjs
- **Validação de tipos** com TypeScript
- **Sanitização de dados** nos formulários

## 📊 Funcionalidades por Perfil

### **Funcionários**
- ✅ Gestão completa de empresas clientes
- ✅ Criação e edição de serviços
- ✅ Controle de atividades e projetos
- ✅ Visualização de feedbacks
- ✅ Upload de arquivos e mídias
- ✅ Dashboard com métricas

### **Empresas**
- ✅ Visualização de contratos ativos
- ✅ Envio de feedbacks e avaliações
- ✅ Acompanhamento de projetos
- ✅ Comunicação com a equipe

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:
- 📧 Email: igorleonsimim@gmail.com
- 📱 WhatsApp: (31) 98768-5091
- 📍 Endereço: Pelotas, RS

---

**Desenvolvido com ❤️ pela equipe Agência Comunica**