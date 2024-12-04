import { MaterialDTO } from "../dtos/MaterialDTO";
import { MaterialEntity } from "../entities/MaterialRegistration";

export interface IMaterialRepository {
  create(materialData: MaterialEntity): Promise<MaterialDTO>;
  findAll(): Promise<MaterialDTO[]>;
  findById(id: string): Promise<MaterialDTO | null>;
  update(id: string, materialData: MaterialEntity): Promise<MaterialDTO | null>;
  delete(id: string): Promise<void>;
}
