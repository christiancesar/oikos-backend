import { MaterialEntity } from "@modules/material/entities/MaterialRegistration";
import { randomUUID } from "crypto";

export type Measurement = {
  name: string;
  symbol: string;
};

export enum WasteType {
  RECYCLABLE = "RECYCLABLE",
  GARBAGE = "GARBAGE",
}

type ItemConstructor = {
  waste: MaterialEntity;
  amount: number;
  unit: Measurement;
  wasteType: WasteType;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export class ItemEntity {
  id: string;
  waste: MaterialEntity;
  amount: number;
  unit: Measurement;
  wasteType: WasteType;
  createdAt: Date;
  updatedAt?: Date | null;

  constructor(item: ItemConstructor, id?: string) {
    this.id = id ?? randomUUID();
    this.waste = item.waste;
    this.amount = item.amount;
    this.unit = item.unit;
    this.wasteType = WasteType.RECYCLABLE;
    this.createdAt = item.createdAt ?? new Date();
    this.updatedAt = item.updatedAt;
  }
}
