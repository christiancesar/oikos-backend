import {
  CollectionTransactionEntity,
  CollectionType,
  TradingType,
  TransactionStatus,
} from "@modules/collection_transaction/entities/CollectionTransaction";
import {
  CanceledTransactionDTO,
  CreateCollectionTransactionDTO,
  ICollectionTransactionsRepository,
  UpdateTransactionDTO,
} from "../ICollectionTransactions";
import { unitOfMeasurement } from "@modules/companies/entities/MeasurementConst";
import { WasteType } from "@modules/companies/entities/Item";

type CollectionTransactionInMemory = CollectionTransactionEntity & {
  companyId: string;
  appointmentId?: string | null;
};
export class CollectionTransactionsRepositoryInMemory
  implements ICollectionTransactionsRepository
{
  private collectionTransactions: CollectionTransactionInMemory[] = [];

  async createCollectionTransaction({
    collectionType,
    companyId,
    discountAmount,
    grossAmount,
    latitude,
    longitude,
    measurement,
    netAmount,
    quantity,
    tradingType,
    unitAmount,
    wasteId,
    wasteType,
    appointmentId,
  }: CreateCollectionTransactionDTO): Promise<CollectionTransactionEntity> {
    const transaction = new CollectionTransactionEntity({
      collectionType: collectionType as CollectionType,
      discountAmount,
      grossAmount,
      latitude,
      longitude,
      measurement:
        unitOfMeasurement[measurement as keyof typeof unitOfMeasurement],
      netAmount,
      quantity,
      tradingType: tradingType as TradingType,
      unitAmount,
      wasteType: wasteType as WasteType,
      company: {
        id: companyId,
        corporateName: "Company",
      },
      waste: {
        id: wasteId,
        name: "Waste",
      },
      status: TransactionStatus.ACTIVE,
    });

    this.collectionTransactions.push({
      companyId,
      appointmentId,
      ...transaction,
    });

    return transaction;
  }

  async listCollectionTransactionsByCompanyId(
    companyId: string,
  ): Promise<CollectionTransactionEntity[]> {
    const transactions = this.collectionTransactions.filter(
      (transaction) => transaction.companyId === companyId,
    );
    return transactions;
  }

  async findCollectionTransactionById(
    transactionId: string,
  ): Promise<CollectionTransactionEntity | null> {
    const transaction = this.collectionTransactions.find(
      (transaction) => transaction.id === transactionId,
    );

    return transaction || null;
  }

  async updateCollectionTransaction({
    transactionId,
    collectionType,
    companyId,
    discountAmount,
    grossAmount,
    latitude,
    longitude,
    measurement,
    netAmount,
    quantity,
    tradingType,
    unitAmount,
    wasteId,
    wasteType,
  }: UpdateTransactionDTO): Promise<CollectionTransactionEntity> {
    const transactionIndex = this.collectionTransactions.findIndex(
      (transaction) => transaction.id === transactionId,
    );

    this.collectionTransactions[transactionIndex] = {
      collectionType: collectionType as CollectionType,
      discountAmount: discountAmount ?? 0,
      grossAmount: grossAmount ?? 0,
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
      measurement:
        unitOfMeasurement[measurement as keyof typeof unitOfMeasurement],
      netAmount: netAmount ?? 0,
      quantity,
      tradingType: tradingType as TradingType,
      unitAmount: unitAmount ?? 0,
      wasteType: wasteType as WasteType,
      company: {
        id: companyId,
        corporateName: "Company",
      },
      waste: {
        id: wasteId,
        name: "Waste",
      },
      status: TransactionStatus.ACTIVE,
    } as CollectionTransactionInMemory;

    return this.collectionTransactions[transactionIndex];
  }

  async cancelCollectionTransaction({
    companyId,
    transactionId,
  }: CanceledTransactionDTO): Promise<CollectionTransactionEntity> {
    const transactionIndex = this.collectionTransactions.findIndex(
      (transaction) =>
        transaction.id === transactionId && transaction.companyId === companyId,
    );

    this.collectionTransactions[transactionIndex].status =
      TransactionStatus.CANCELED;

    return this.collectionTransactions[transactionIndex];
  }
}
