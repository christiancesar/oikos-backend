// manipulacao dos cronogramas, associando bairros, materiais e coletadores

import { CollectionScheduleRepository } from "../repositories/CollectionScheduleRepository";
import { CollectionScheduleEntity } from "../entities/CollectionScheduleEntity";

export class CollectionScheduleService {
  private collectionScheduleRepository: CollectionScheduleRepository;

  constructor() {
    this.collectionScheduleRepository = new CollectionScheduleRepository();
  }

  // Método para criar um cronograma de coleta
  public async create(
    bairro: string,
    dia: string,
    periodo: string,
    materiais: string[],
  ): Promise<CollectionScheduleEntity> {
    // Validação ou lógica adicional pode ser adicionada aqui
    const newSchedule = await this.collectionScheduleRepository.create(
      bairro,
      dia,
      periodo,
      materiais,
    );
    return newSchedule;
  }

  // Método para obter cronogramas por bairro
  public async getByBairro(
    bairro: string,
  ): Promise<CollectionScheduleEntity[]> {
    const schedules =
      await this.collectionScheduleRepository.getByBairro(bairro);
    return schedules;
  }
}
