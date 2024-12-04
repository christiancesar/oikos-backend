import { MaterialEntity } from "../entities/MaterialRegistration";

export class MaterialDTO {
  id: string;
  name: string;
  category: string;
  createdAt: Date;
  updatedAt?: Date | null;

  constructor(material: MaterialEntity) {
    this.id = material.id;
    this.name = material.name;
    this.category = material.category;
    this.createdAt = material.createdAt;
    this.updatedAt = material.updatedAt ?? null;
  }
}
