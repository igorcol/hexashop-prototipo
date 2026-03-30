// ! APENAS PARA TESTES - PRODUTOS FALSOS

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados...')

  const kit = await prisma.product.upsert({
    where: { slug: 'kit-resgate-do-hexa' },
    update: {}, 
    create: {
      slug: 'kit-resgate-do-hexa',
      name: 'Kit Resgate do Hexa',
      description: 'Tudo o que você precisa pra transformar sua sala em um estádio. A corneta que acorda o bairro, a bandeira que une a rua e o trec-trec que faz o coração bater no ritmo do gol.',
      shortDescription: 'O kit completo pra reviver 2010.',
      price: 8790,
      originalPrice: 14990,
      images: '/images/kit-hero.jpg', 
      category: 'kit',
      badge: 'MAIS VENDIDO',
      isKit: true,
      kitItems: 'Bandeira de Janela,Corneta de Ar,Reco-reco (Trec-trec),Bastão de Pintura Facial', 
      stock: 47,
      sold: 82,
    },
  })

  console.log('\n✅ Produto Injetado com Sucesso!')
  console.log('--------------------------------------------------')
  console.log(`📦 NOME: ${kit.name}`)
  console.log(`🔑 ID:   ${kit.id}`)
  console.log('--------------------------------------------------')
  console.log('⚠️ AÇÃO OBRIGATÓRIA: Copie o ID acima e substitua no mock (src/data/products.ts)!\n')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })