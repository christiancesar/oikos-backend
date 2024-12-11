import { AppError } from "@common/errors/AppError";
import { WasteType } from "@modules/companies/entities/Item";
import {
  unitOfMeasurement,
  UnitOfMeasurement,
} from "@modules/companies/entities/MeasurementConst";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";
import { MaterialRepository } from "@modules/material/repositories/MaterialRegistrationRepository";
import {
  CollectionTransactionEntity,
  CollectionType,
  TradingType,
} from "../entities/CollectionTransaction";
import { ICollectionTransactionsRepository } from "../repositories/ICollectionTransactions";

type CreateCollectionTransaction = {
  companyId: string;
  collectionType: CollectionType;
  wasteId: string;
  wasteType: WasteType;
  tradingType: TradingType;
  measurement: UnitOfMeasurement;
  quantity: number;
  unitAmount?: number;
  grossAmount?: number;
  discountAmount?: number;
  netAmount?: number;
  latitude?: number;
  longitude?: number;
};

type CreateTransactionServiceConstructor = {
  collectionTransactionRepository: ICollectionTransactionsRepository;
  companiesRepository: ICompaniesRepository;
  materialsRepository: MaterialRepository;
};

export class CreateTransactionService {
  constructor(private repositories: CreateTransactionServiceConstructor) {}

  async execute(
    data: CreateCollectionTransaction,
  ): Promise<CollectionTransactionEntity> {
    const company = await this.repositories.companiesRepository.findCompayById(
      data.companyId,
    );

    if (!company) {
      throw new AppError("Company not found");
    }

    const material = await this.repositories.materialsRepository.findById(
      data.wasteId,
    );

    if (!material) {
      throw new AppError("Material not found");
    }

    const collectionTransaction = new CollectionTransactionEntity({
      company: {
        id: company.id,
        name: company.corporateName,
      },
      collectionType: data.collectionType,
      waste: {
        id: material.id,
        name: material.name,
      },
      wasteType: data.wasteType,
      tradingType: data.tradingType,
      measurement:
        unitOfMeasurement[data.measurement as keyof typeof UnitOfMeasurement],
      quantity: data.quantity,
      unitAmount: data.unitAmount,
      grossAmount: data.grossAmount,
      discountAmount: data.discountAmount,
      netAmount: data.netAmount,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    const colletion =
      await this.repositories.collectionTransactionRepository.createCollectionTransaction(
        {
          companyId: collectionTransaction.company.id,
          wasteId: collectionTransaction.waste.id,
          measurement: collectionTransaction.measurement.symbol,
          collectionType: collectionTransaction.collectionType,
          tradingType: collectionTransaction.tradingType,
          wasteType: collectionTransaction.wasteType,
          unitAmount: collectionTransaction.unitAmount,
          quantity: collectionTransaction.quantity,
          grossAmount: collectionTransaction.grossAmount,
          discountAmount: collectionTransaction.discountAmount,
          netAmount: collectionTransaction.netAmount,
          latitude: collectionTransaction.latitude,
          longitude: collectionTransaction.longitude,
        },
      );

    return colletion;
  }
}
