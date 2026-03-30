# HexaShop: E-commerce Fullstack

> **Status:** 🚀 Completo (Estudo de Caso / MVP)
> 
> Um ecossistema de e-commerce completo, focado em performance e UX, construído para validar fluxos complexos de checkout, gestão de inventário e logística em tempo real.

---

## ⚽ O Projeto
O **HexaShop** não é apenas uma loja virtual; é um estudo de engenharia de software focado em **Next.js 15+**. O objetivo foi construir uma experiência de compra "zero fricção" aliada a um painel administrativo que conversa diretamente com um banco de dados relacional.

### 🛠️ Core Stack
* **Framework:** Next.js (App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS (Arquitetura Offwhite/Disruptiva)
* **Banco de Dados:** SQLite (via Prisma ORM)
* **Animações:** Framer Motion (Checkouts fluidos)

---

## ⚡ Funcionalidades Principais

### 🛒 Experiência do Usuário (Frontend)
- **Checkout Modal:** Fluxo de 3 etapas (Dados -> Pix -> Sucesso) com validação de campos em tempo real.
- **Integração ViaCEP:** Autopreenchimento de endereço via API para reduzir o churn no carrinho.
- **Vitrine Dinâmica:** Produtos consumidos diretamente do banco de dados, garantindo estoque atualizado.

### 🖥️ Painel Administrativo (Back-office)
- **Dashboard de Gestão:** Visão geral de receita total, pedidos pendentes e métricas de conversão.
- **CRUD de Produtos:** Gestão completa de catálogo (Criar, Editar, Deletar e Gerenciar Estoque).
- **Logística (ERP Light):** Fluxo de despacho de pedidos com inserção de código de rastreio e atualização automática de status.
- **Server Actions:** Todas as mutações de dados ocorrem no servidor, garantindo segurança e performance.

---

## 🏗️ Arquitetura Técnica
O projeto utiliza uma abordagem **Server-First**, onde a maior parte da lógica de dados é resolvida no servidor antes de chegar ao cliente, utilizando:
- **Server Components:** Para buscas rápidas e seguras no banco.
- **Server Actions:** Para processamento de formulários e lógica de negócio.
- **SQLite + Prisma:** Persistência de dados local leve e eficiente.

---

## 🚀 Como rodar o estudo

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/seu-user/hexashop-prototipo.git](https://github.com/seu-user/hexashop-prototipo.git)

### 2. Configurar Banco de Dados (Prisma + SQLite)
Siga esta ordem exata para garantir a sincronização:

```bash
# Sincroniza o Schema com o arquivo dev.db local
npx prisma db push

# Gera o Client dentro da pasta src/generated (Solução Anti-Bug)
npx prisma generate

# Alimenta o banco com o produto inicial
npx tsx --env-file=.env prisma/seed/seed-product.ts
```

### 3. Executar em Desenvolvimento

```bash
npm run dev
```

### 🧠 Estudo de Caso: Desafios Vencidos
Este repositório documenta a superação de desafios reais de engenharia:

Resolução de Caminhos: Implementação de um bypass para o Prisma Client no ambiente Windows/Next.js 15.
Estado Dinâmico: Gerenciamento de Promises em rotas dinâmicas (params assíncronos no Next 15).
Revalidation: Uso de revalidatePath para garantir que o dashboard atualize os números em tempo real após ações do admin.