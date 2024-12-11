import { Measurement, WasteType } from "@modules/companies/entities/Item";
import { randomUUID } from "crypto";

export enum CollectionType {
  APPOINTMENT = "APPOINTMENT", // coleta realizada atraves de agendamentos
  COLLECTION = "COLLECTION", // coleta realizada por coleta padrão
  POINT = "POINT", // usuario entrega o material em um ponto de coleta
}
export enum TradingType {
  BUY = "BUY",
  SELL = "SELL",
  COLLECTION = "COLLECTION",
}

export enum TransactionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CANCELED = "CANCELED",
}

type CompanyCollectionTransaction = {
  id: string;
  name: string;
};

type MaterialCollectionTransaction = {
  id: string;
  name: string;
};

type CollectionTransactionEntityConstructor = {
  id?: string;
  status?: TransactionStatus;
  company: CompanyCollectionTransaction;
  collectionType: CollectionType;
  waste: MaterialCollectionTransaction;
  wasteType: WasteType;
  tradingType: TradingType;
  measurement: Measurement;
  quantity: number;
  unitAmount?: number;
  grossAmount?: number;
  discountAmount?: number;
  netAmount?: number;
  latitude?: number;
  longitude?: number;
  createdAt?: Date;
  updatedAt?: Date | null;
};

export class CollectionTransactionEntity {
  id: string;
  status: TransactionStatus;
  company: CompanyCollectionTransaction;
  collectionType: CollectionType;
  waste: MaterialCollectionTransaction;
  wasteType: WasteType;
  tradingType: TradingType;
  measurement: Measurement;
  quantity: number;
  unitAmount: number;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt?: Date | null;

  constructor(data: CollectionTransactionEntityConstructor) {
    this.id = data.id ?? randomUUID();
    this.status = data.status ?? TransactionStatus.ACTIVE;
    this.company = data.company;
    this.collectionType = data.collectionType;
    this.waste = data.waste;
    this.wasteType = data.wasteType;
    this.tradingType = data.tradingType;
    this.measurement = data.measurement;
    this.quantity = data.quantity;
    this.unitAmount = data.unitAmount ?? 0;
    this.grossAmount = data.grossAmount ?? 0;
    this.discountAmount = data.discountAmount ?? 0;
    this.netAmount = data.netAmount ?? 0;
    this.latitude = data.latitude ?? 0;
    this.longitude = data.longitude ?? 0;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt;

    this.calculate();
  }

  protected calculate(): void {
    this.grossAmount = this.quantity * this.unitAmount;
    this.netAmount = this.grossAmount - this.discountAmount;
  }
}
