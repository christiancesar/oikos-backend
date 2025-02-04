import { prisma } from "prisma";
import { IMaterialRepository } from "./IMaterialRegistrationRepository";
import { MaterialEntity } from "../entities/MaterialRegistration";
import { CreateMaterialDTO } from "../dtos/MaterialDTO";

export class MaterialRepository implements IMaterialRepository {
  // Método para criar um novo material
  async create(materialData: CreateMaterialDTO): Promise<MaterialEntity> {
    const material = await prisma.material.create({
      data: {
        name: materialData.name,
        category: materialData.category,
      },
    });
    return material;
  }

  // Método para obter todos os materiais
  async findAll(): Promise<MaterialEntity[]> {
    const materials = await prisma.material.findMany();
    return materials.map((material) => new MaterialEntity(material));
  }

  // Método para obter um material por ID
  async findById(id: string): Promise<MaterialEntity | null> {
    const material = await prisma.material.findUnique({
      where: { id },
    });
    return material ? new MaterialEntity(material) : null;
  }

  // Método para atualizar um material
  async update(
    id: string,
    materialData: CreateMaterialDTO,
  ): Promise<MaterialEntity | null> {
    const material = await prisma.material.update({
      where: { id },
      data: {
        name: materialData.name,
        category: materialData.category,
      },
    });
    return new MaterialEntity(material);
  }

  // Método para excluir um material
  async delete(id: string): Promise<void> {
    await prisma.material.delete({
      where: { id },
    });
  }
}
