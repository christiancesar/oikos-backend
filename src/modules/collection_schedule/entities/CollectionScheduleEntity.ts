import { MaterialEntity } from "@modules/material/entities/MaterialRegistration";
import { randomUUID } from "crypto";

type CollectionScheduleEntityConstructor = {
  bairro: string;
  dia: string;
  periodo: string;
  materiais: MaterialEntity[];
  createdAt?: Date;
  updatedAt?: Date | null;
};

export class CollectionScheduleEntity {
  id: string;
  bairro: string;
  dia: string;
  periodo: string;
  materiais: MaterialEntity[];
  createdAt: Date;
  updatedAt?: Date | null;

  constructor(
    {
      id,
      bairro,
      dia,
      periodo,
      materiais,
      createdAt,
      updatedAt,
    }: CollectionScheduleEntityConstructor,
    id?: string,
  ) {
    this.id = id ?? randomUUID();
    this.bairro = bairro;
    this.dia = dia;
    this.periodo = periodo;
    this.materiais = materiais;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? null;
  }
}
