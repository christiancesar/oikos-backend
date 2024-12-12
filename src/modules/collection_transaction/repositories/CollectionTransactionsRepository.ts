import { prisma } from "prisma";
import {
  CanceledTransactionDTO,
  CreateCollectionTransactionDTO,
  ICollectionTransactionsRepository,
  UpdateTransactionDTO,
} from "./ICollectionTransactions";
import { CollectionTransactionMapper } from "./CollectionTransactionMapper";
import {
  CollectionTransactionEntity,
  TransactionStatus,
} from "../entities/CollectionTransaction";

export class CollectionTransactionsRepository
  implements ICollectionTransactionsRepository
{
  async createCollectionTransaction(
    raw: CreateCollectionTransactionDTO,
  ): Promise<CollectionTransactionEntity> {
    const collection = await prisma.collectionTransaction.create({
      data: {
        collectionType: raw.collectionType,
        appointmentId: raw.appointmentId,
        wasteType: raw.wasteType,
        tradingType: raw.tradingType,
        measurement: raw.measurement,
        quantity: raw.quantity,
        unitAmount: raw.unitAmount,
        grossAmount: raw.grossAmount,
        discountAmount: raw.discountAmount,
        netAmount: raw.netAmount,
        latitude: raw.latitude,
        longitude: raw.longitude,
        companyId: raw.companyId,
        wasteId: raw.wasteId,
      },
      include: { waste: true, company: true },
    });

    return CollectionTransactionMapper.toDomain(collection);
  }

  async listCollectionTransactionsByCompanyId(
    companyId: string,
  ): Promise<CollectionTransactionEntity[]> {
    const collections = await prisma.collectionTransaction.findMany({
      where: { companyId },
      include: { waste: true, company: true },
    });

    return collections.map(CollectionTransactionMapper.toDomain);
  }

  async findCollectionTransactionById(
    transactionId: string,
  ): Promise<CollectionTransactionEntity | null> {
    const collection = await prisma.collectionTransaction.findUnique({
      where: { id: transactionId },
      include: { waste: true, company: true },
    });

    return collection ? CollectionTransactionMapper.toDomain(collection) : null;
  }

  async updateCollectionTransaction(
    data: UpdateTransactionDTO,
  ): Promise<CollectionTransactionEntity> {
    const collection = await prisma.collectionTransaction.update({
      where: { id: data.transactionId },
      data: {
        collectionType: data.collectionType,
        wasteType: data.wasteType,
        tradingType: data.tradingType,
        measurement: data.measurement,
        quantity: data.quantity,
        unitAmount: data.unitAmount,
        grossAmount: data.grossAmount,
        discountAmount: data.discountAmount,
        netAmount: data.netAmount,
        latitude: data.latitude,
        longitude: data.longitude,
        companyId: data.companyId,
        wasteId: data.wasteId,
      },
      include: { waste: true, company: true },
    });

    return CollectionTransactionMapper.toDomain(collection);
  }

  async cancelCollectionTransaction({
    companyId,
    transactionId,
  }: CanceledTransactionDTO): Promise<CollectionTransactionEntity> {
    const transaction = await prisma.collectionTransaction.update({
      where: { id: transactionId, companyId },
      data: { status: TransactionStatus.CANCELED },
      include: { waste: true, company: true },
    });

    return CollectionTransactionMapper.toDomain(transaction);
  }
}
