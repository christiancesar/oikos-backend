import { randomUUID } from "crypto";

type MaterialEntityConstructor = {
  name: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date | null;
};

export class MaterialEntity {
  id: string;
  name: string;
  category: string;
  createdAt: Date;
  updatedAt?: Date | null;

  constructor(
    { name, category, createdAt, updatedAt }: MaterialEntityConstructor,
    id?: string,
  ) {
    this.id = id ?? randomUUID();
    this.name = name;
    this.category = category;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? null;
  }
}
