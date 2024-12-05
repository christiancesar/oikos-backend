// manipulação dos dados de cronograma do BD

import { prisma } from "prisma";
import { CollectionScheduleEntity } from "../entities/CollectionScheduleEntity";

export class CollectionScheduleRepository {
  // Método para criar um cronograma de coleta
  public async create(
    bairro: string,
    dia: string,
    periodo: string,
    materiais: string[],
  ): Promise<CollectionScheduleEntity> {
    // Passo 1: Criar ou encontrar os materiais, associando-os ao cronograma
    const materialRecords = await Promise.all(
      materiais.map(async (materialName) => {
        // Verifica se o material já existe
        let material = await prisma.material.findUnique({
          where: { id: materialName }, // Aqui, usamos o 'id' para buscar
        });

        // Caso o material não exista, cria um novo
        if (!material) {
          material = await prisma.material.create({
            data: {
              name: materialName,
              category: "Desconhecido", // Adaptar conforme necessário
            },
          });
        }

        return material;
      }),
    );

    // Passo 2: Criar o cronograma de coleta e associar os materiais encontrados/criados
    const result = await prisma.collectionSchedule.create({
      data: {
        bairro,
        dia,
        periodo,
        materiais: {
          connect: materialRecords.map((material) => ({ id: material.id })), // Conectar os materiais usando o ID
        },
      },
      include: {
        materiais: true, // Incluir os materiais associados ao cronograma
      },
    });

    // Criar e retornar a instância da CollectionScheduleEntity
    return new CollectionScheduleEntity({
      id: result.id,
      bairro: result.bairro,
      dia: result.dia,
      periodo: result.periodo,
      materiais: result.materiais, // Extrair os nomes dos materiais, ou outras propriedades que você precisar
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  // Método para obter cronogramas de coleta por bairro
  public async getByBairro(
    bairro: string,
  ): Promise<CollectionScheduleEntity[]> {
    const result = await prisma.collectionSchedule.findMany({
      where: {
        bairro,
      },
      include: {
        materiais: true, // Incluir os materiais associados
      },
    });

    // Mapear os resultados para instâncias de CollectionScheduleEntity
    return result.map(
      (schedule) =>
        new CollectionScheduleEntity({
          id: schedule.id,
          bairro: schedule.bairro,
          dia: schedule.dia,
          periodo: schedule.periodo,
          materiais: schedule.materiais, // Extrair apenas os nomes dos materiais
          createdAt: schedule.createdAt,
          updatedAt: schedule.updatedAt,
        }),
    );
  }
}
