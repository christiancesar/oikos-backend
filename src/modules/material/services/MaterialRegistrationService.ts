import { AppError } from "@common/errors/AppError";
import { MaterialEntity } from "../entities/MaterialRegistration";
import { IMaterialRepository } from "../repositories/IMaterialRegistrationRepository";

export class MaterialService {
  constructor(private materialRepository: IMaterialRepository) {}

  // Criar um novo material
  async create(materialData: MaterialEntity): Promise<MaterialEntity> {
    return await this.materialRepository.create(materialData);
  }

  // Obter todos os materiais
  async findAll(): Promise<MaterialEntity[]> {
    return await this.materialRepository.findAll();
  }

  // Obter um material pelo id
  async findById(id: string): Promise<MaterialEntity> {
    const material = await this.materialRepository.findById(id);
    if (!material) {
      throw new AppError("Material not found");
    }

    return material;
  }

  // Atualizar um material
  async update(
    id: string,
    materialData: MaterialEntity,
  ): Promise<MaterialEntity> {
    const material = await this.materialRepository.findById(id);
    if (!material) {
      throw new AppError("Material not found");
    }
    await this.materialRepository.update(id, materialData);

    return material;
  }

  // Excluir um material
  async delete(id: string): Promise<void> {
    const material = await this.materialRepository.findById(id);
    if (!material) {
      throw new AppError("Material not found");
    }

    await this.materialRepository.delete(id);
  }
}
