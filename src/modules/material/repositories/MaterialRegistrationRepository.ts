import { prisma } from "prisma";
import { IMaterialRepository } from "./IMaterialRegistrationRepository";
import { MaterialEntity } from "../entities/MaterialRegistration";
import { MaterialDTO } from "../dtos/MaterialDTO";

export class MaterialRepository implements IMaterialRepository {
  // Método para criar um novo material
  async create(materialData: MaterialEntity): Promise<MaterialDTO> {
    const material = await prisma.material.create({
      data: {
        name: materialData.name,
        category: materialData.category,
      },
    });
    return new MaterialDTO(material);
  }

  // Método para obter todos os materiais
  async findAll(): Promise<MaterialDTO[]> {
    const materials = await prisma.material.findMany();
    return materials.map((material) => new MaterialDTO(material));
  }

  // Método para obter um material por ID
  async findById(id: string): Promise<MaterialDTO | null> {
    const material = await prisma.material.findUnique({
      where: { id },
    });
    return material ? new MaterialDTO(material) : null;
  }

  // Método para atualizar um material
  async update(
    id: string,
    materialData: MaterialEntity,
  ): Promise<MaterialDTO | null> {
    const material = await prisma.material.update({
      where: { id },
      data: {
        name: materialData.name,
        category: materialData.category,
      },
    });
    return new MaterialDTO(material);
  }

  // Método para excluir um material
  async delete(id: string): Promise<void> {
    await prisma.material.delete({
      where: { id },
    });
  }
}
