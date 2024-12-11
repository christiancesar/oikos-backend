import { WasteType } from "@modules/companies/entities/Item";
import { unitOfMeasurement } from "@modules/companies/entities/MeasurementConst";
import { Prisma } from "@prisma/client";
import {
  CollectionTransactionEntity,
  CollectionType,
  TradingType,
  TransactionStatus,
} from "../entities/CollectionTransaction";
type CollectionTransactionPrisma = Prisma.CollectionTransactionGetPayload<{
  include: { waste: true; company: true };
}>;
export class CollectionTransactionMapper {
  static toDomain(
    raw: CollectionTransactionPrisma,
  ): CollectionTransactionEntity {
    return new CollectionTransactionEntity({
      id: raw.id,
      status: TransactionStatus[raw.status as keyof typeof TransactionStatus],
      collectionType:
        CollectionType[raw.collectionType as keyof typeof CollectionType],
      wasteType: WasteType[raw.wasteType as keyof typeof WasteType],
      tradingType: TradingType[raw.tradingType as keyof typeof TradingType],
      measurement:
        unitOfMeasurement[raw.measurement as keyof typeof unitOfMeasurement],
      quantity: raw.quantity,
      unitAmount: raw.unitAmount,
      grossAmount: raw.grossAmount,
      discountAmount: raw.discountAmount,
      netAmount: raw.netAmount,
      latitude: raw.latitude,
      longitude: raw.longitude,
      waste: {
        id: raw.waste.id,
        name: raw.waste.name,
      },
      company: {
        id: raw.company.id,
        name: raw.company.corporateName,
      },
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
