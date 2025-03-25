import { MaterialEntity } from "@modules/material/entities/MaterialRegistration";
import { IMaterialRepository } from "../IMaterialRegistrationRepository";

export class MaterialsRepositoryInMemory implements IMaterialRepository {
  private material: MaterialEntity[] = [];
  async create(materialData: MaterialEntity): Promise<MaterialEntity> {
    const material = new MaterialEntity({
      name: materialData.name,
      category: materialData.category,
      createdAt: new Date(),
    });

    this.material.push(material);

    return material;
  }

  async findAll(): Promise<MaterialEntity[]> {
    return this.material;
  }

  async findById(id: string): Promise<MaterialEntity | null> {
    const material = this.material.find((material) => material.id === id);
    return material || null;
  }

  async update(
    id: string,
    materialData: MaterialEntity,
  ): Promise<MaterialEntity | null> {
    const materialIndex = this.material.findIndex(
      (material) => material.id === id,
    );

    Object.assign(this.material[materialIndex]!, {
      ...materialData,
      updatedAt: new Date(),
    });

    return this.material[materialIndex]!;
  }

  async delete(id: string): Promise<void> {
    const materialIndex = this.material.findIndex(
      (material) => material.id === id,
    );

    this.material.splice(materialIndex, 1);
  }
}
