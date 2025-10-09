-- CreateEnum
CREATE TYPE "Cargo" AS ENUM ('PROPRIETARIA', 'RH', 'DESIGNER', 'REDATORA', 'VIDEOMAKER', 'GESTORTRAFEGO');

-- CreateTable
CREATE TABLE "Empresa" (
    "cnpj" VARCHAR(18) NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha" VARCHAR(100) NOT NULL,
    "atuacao" VARCHAR(100) NOT NULL,
    "logotipo" VARCHAR(255) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("cnpj")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "empresaCnpj" VARCHAR(18) NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" VARCHAR(255) NOT NULL,
    "data" DATE NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Colaborador" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha" VARCHAR(100) NOT NULL,
    "telefone" VARCHAR(15) NOT NULL,
    "sobre" VARCHAR(255) NOT NULL,
    "dtnasc" DATE NOT NULL,
    "foto" VARCHAR(255) NOT NULL,
    "cargo" "Cargo" NOT NULL,

    CONSTRAINT "Colaborador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servico" (
    "cod" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "simbolo" VARCHAR(255) NOT NULL,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("cod")
);

-- CreateTable
CREATE TABLE "Contrato" (
    "id" SERIAL NOT NULL,
    "empresaCnpj" VARCHAR(18) NOT NULL,
    "servicoId" INTEGER NOT NULL,
    "termos" VARCHAR(255) NOT NULL,
    "dataInicio" DATE NOT NULL,
    "dataFim" DATE NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atividade" (
    "id" SERIAL NOT NULL,
    "colaboradorId" INTEGER NOT NULL,
    "tarefa" VARCHAR(100) NOT NULL,
    "area" VARCHAR(100) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "prioridade" VARCHAR(60) NOT NULL,
    "status" VARCHAR(60) NOT NULL,
    "ultimaModificacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Atividade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arquivo" (
    "id" SERIAL NOT NULL,
    "atividadeId" INTEGER NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "uploadData" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Arquivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" SERIAL NOT NULL,
    "atividadeId" INTEGER NOT NULL,
    "colaboradorId" INTEGER NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projeto" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "categoria" VARCHAR(100) NOT NULL,
    "status" VARCHAR(60) NOT NULL,
    "prazo" DATE NOT NULL,
    "dataInicio" DATE NOT NULL,
    "dataFim" DATE NOT NULL,

    CONSTRAINT "Projeto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_email_key" ON "Empresa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Colaborador_email_key" ON "Colaborador"("email");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_empresaCnpj_fkey" FOREIGN KEY ("empresaCnpj") REFERENCES "Empresa"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_empresaCnpj_fkey" FOREIGN KEY ("empresaCnpj") REFERENCES "Empresa"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atividade" ADD CONSTRAINT "Atividade_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arquivo" ADD CONSTRAINT "Arquivo_atividadeId_fkey" FOREIGN KEY ("atividadeId") REFERENCES "Atividade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_atividadeId_fkey" FOREIGN KEY ("atividadeId") REFERENCES "Atividade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
