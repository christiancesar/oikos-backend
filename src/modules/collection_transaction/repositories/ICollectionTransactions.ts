import { CollectionTransactionEntity } from "../entities/CollectionTransaction";

export type CreateCollectionTransactionDTO = {
  companyId: string;
  wasteId: string;
  collectionType: string;
  wasteType: string;
  tradingType: string;
  measurement: string;
  quantity: number;
  unitAmount: number;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  latitude: number;
  longitude: number;
};

export type UpdateTransactionDTO = {
  transactionId: string;
  companyId: string;
  collectionType: string;
  wasteId: string;
  wasteType: string;
  tradingType: string;
  measurement: string;
  quantity: number;
  unitAmount?: number;
  grossAmount?: number;
  discountAmount?: number;
  netAmount?: number;
  latitude?: number;
  longitude?: number;
};

export type CanceledTransactionDTO = {
  companyId: string;
  transactionId: string;
};

export interface ICollectionTransactionsRepository {
  createCollectionTransaction(
    data: CreateCollectionTransactionDTO,
  ): Promise<CollectionTransactionEntity>;

  listCollectionTransactionsByCompanyId(
    companyId: string,
  ): Promise<CollectionTransactionEntity[]>;

  findCollectionTransactionById(
    transactionId: string,
  ): Promise<CollectionTransactionEntity | null>;

  updateCollectionTransaction(
    data: UpdateTransactionDTO,
  ): Promise<CollectionTransactionEntity>;

  cancelCollectionTransaction(
    data: CanceledTransactionDTO,
  ): Promise<CollectionTransactionEntity>;
}
