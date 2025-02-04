import { CreateMaterialDTO } from "../dtos/MaterialDTO";
import { MaterialEntity } from "../entities/MaterialRegistration";

export interface IMaterialRepository {
  create(materialData: CreateMaterialDTO): Promise<MaterialEntity>;
  findAll(): Promise<MaterialEntity[]>;
  findById(id: string): Promise<MaterialEntity | null>;
  update(
    id: string,
    materialData: CreateMaterialDTO,
  ): Promise<MaterialEntity | null>;
  delete(id: string): Promise<void>;
}
