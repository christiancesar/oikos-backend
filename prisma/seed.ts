import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.material.createMany({
    data: [
      // Categoria: Papéis
      { name: "Jornal", category: "papéis, papel reciclável" },
      { name: "Papel de escritório", category: "papéis, papel reciclável" },
      { name: "Caixa de papelão", category: "papéis, papelão, embalagens" },
      { name: "Papel kraft", category: "papéis, papel reciclável" },

      // Categoria: Plásticos
      { name: "Garrafa PET de água", category: "plásticos, PET" },
      { name: "Garrafa PET de refrigerante", category: "plásticos, PET" },
      { name: "Galão de produtos químicos", category: "plásticos, PEAD" },
      { name: "Tampa de garrafa", category: "plásticos, PEAD" },
      { name: "Pote de margarina", category: "plásticos, PP" },
      { name: "Canos de PVC", category: "plásticos, PVC" },
      { name: "Embalagem de isopor", category: "plásticos, PS, embalagens" },

      // Categoria: Metais
      { name: "Lata de alumínio", category: "metais, alumínio, embalagens" },
      { name: "Lata de aço", category: "metais, aço, embalagens" },
      { name: "Cabo elétrico", category: "metais, cobre, eletrônicos" },
      { name: "Folha de alumínio", category: "metais, alumínio, embalagens" },

      // Categoria: Vidros
      { name: "Garrafa de vidro", category: "vidros, embalagens" },
      { name: "Frasco de perfume", category: "vidros, embalagens" },
      { name: "Vidro de janela", category: "vidros, construção civil" },

      // Categoria: Orgânicos
      { name: "Casca de banana", category: "orgânicos, resíduos alimentares" },
      { name: "Grama cortada", category: "orgânicos, resíduos verdes" },

      // Categoria: Eletrônicos
      { name: "Celular usado", category: "eletrônicos, dispositivos pessoais" },
      { name: "Placa mãe de computador", category: "eletrônicos, componentes" },
      { name: "Bateria de notebook", category: "eletrônicos, baterias" },

      // Categoria: Óleo
      {
        name: "Óleo de cozinha usado",
        category: "óleos, resíduos alimentares",
      },

      // Categoria: Têxteis
      { name: "Camiseta de algodão", category: "têxteis, roupas" },
      { name: "Tapete sintético", category: "têxteis, tecidos sintéticos" },

      // Categoria: Outros
      { name: "Pneu velho", category: "borracha, pneus" },
      { name: "Madeira tratada", category: "madeira, resíduos de construção" },
      { name: "Telha de zinco", category: "metais, zinco, construção civil" },
    ],
  });
}

main()
  .then(() => console.log("Seed data created successfully!"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
