import { AppError } from "@common/errors/AppError";
import { MaterialEntity } from "../entities/MaterialRegistration";
import { IMaterialRepository } from "../repositories/IMaterialRegistrationRepository";
import { CreateMaterialDTO } from "../dtos/MaterialDTO";

export class MaterialService {
  constructor(private materialRepository: IMaterialRepository) {}

  async create({ category, name }: CreateMaterialDTO): Promise<MaterialEntity> {
    const categoryIsEmpty = category.trim().length;
    const nameIsEmpty = name.trim().length;

    if ((categoryIsEmpty && nameIsEmpty) === 0) {
      throw new AppError("Categoria e nome são obrigatórios");
    }

    return await this.materialRepository.create({
      category,
      name,
    });
  }

  async findAll(): Promise<MaterialEntity[]> {
    return this.materialRepository.findAll();
  }

  async findById(id: string): Promise<MaterialEntity> {
    const material = await this.materialRepository.findById(id);
    if (!material) {
      throw new AppError("Material not found");
    }

    return material;
  }

  async update(
    id: string,
    materialData: CreateMaterialDTO,
  ): Promise<MaterialEntity> {
    const material = await this.materialRepository.findById(id);
    if (!material) {
      throw new AppError("Material not found");
    }
    await this.materialRepository.update(id, materialData);

    return material;
  }

  async delete(id: string): Promise<void> {
    const material = await this.materialRepository.findById(id);
    if (!material) {
      throw new AppError("Material not found");
    }

    await this.materialRepository.delete(id);
  }
}
