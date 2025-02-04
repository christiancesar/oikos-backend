import { WasteType } from "@modules/companies/entities/Item";
import { UnitOfMeasurement } from "@modules/companies/entities/MeasurementConst";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import { makeMaterial } from "@modules/material/factories/makeMaterial";
import { MaterialsRepositoryInMemory } from "@modules/material/repositories/inMemory/MaterialsRepositoryInMemory";
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import {
  CollectionType,
  TradingType,
  TransactionStatus,
} from "../entities/CollectionTransaction";
import { CollectionTransactionsRepositoryInMemory } from "../repositories/inMemory/CollectionTransactionsRepositoryInMemory";
import { CreateTransactionService } from "./CreateTransactionService";

import { CanceledTransactionService } from "./CanceledTransactionService";

let companiesRepository: CompaniesRepositoryInMemory;
let collectionTransactionsRepository: CollectionTransactionsRepositoryInMemory;
let materialsRepository: MaterialsRepositoryInMemory;
let createTransactionService: CreateTransactionService;
let canceledTransactionService: CanceledTransactionService;

describe("Cancelar um lançamento de coleta por empresa", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();
    collectionTransactionsRepository =
      new CollectionTransactionsRepositoryInMemory();
    materialsRepository = new MaterialsRepositoryInMemory();
    createTransactionService = new CreateTransactionService({
      collectionTransactionsRepository,
      companiesRepository,
      materialsRepository,
    });

    canceledTransactionService = new CanceledTransactionService({
      collectionTransactionsRepository,
      companiesRepository,
    });
  });

  it("Deve ser possível a empresa cancelar seus lançamento de coleta. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const material1 = await materialsRepository.create(
      makeMaterial({
        name: "Material 1",
      }),
    );

    await createTransactionService.execute({
      companyId: company.id,
      collectionType: CollectionType.COLLECTION,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 10,
    });

    const transaction = await createTransactionService.execute({
      companyId: company.id,
      collectionType: CollectionType.POINT,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 5,
      unitAmount: 0.5,
    });

    const transactions = await canceledTransactionService.execute({
      transactionId: transaction.id,
      companyId: company.id,
    });

    expect(transactions.status).toEqual(TransactionStatus.CANCELED);
  });

  it("Nao deve ser possível uma empresa não cadastrada cancelar lançamento de coleta. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const material1 = await materialsRepository.create(
      makeMaterial({
        name: "Material 1",
      }),
    );

    await createTransactionService.execute({
      companyId: company.id,
      collectionType: CollectionType.COLLECTION,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 10,
    });

    const transaction = await createTransactionService.execute({
      companyId: company.id,
      collectionType: CollectionType.POINT,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 5,
      unitAmount: 0.5,
    });

    await expect(async () => {
      await canceledTransactionService.execute({
        transactionId: transaction.id,
        companyId: "company-id-not-exists",
      });
    }).rejects.toThrowError("Company not found");
  });

  it("Nao deve ser possível uma empresa não cadastrada cancelar lançamento de coleta. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const material1 = await materialsRepository.create(
      makeMaterial({
        name: "Material 1",
      }),
    );

    await createTransactionService.execute({
      companyId: company.id,
      collectionType: CollectionType.COLLECTION,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 10,
    });

    await createTransactionService.execute({
      companyId: company.id,
      collectionType: CollectionType.POINT,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 5,
      unitAmount: 0.5,
    });

    await expect(async () => {
      await canceledTransactionService.execute({
        transactionId: "company-id-not-exists",
        companyId: company.id,
      });
    }).rejects.toThrowError("Transaction not found");
  });

  it("Nao deve ser possível uma empresa cadastrada cancelar lançamento de coleta pertecente a outra empresa. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const company2 = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const material1 = await materialsRepository.create(
      makeMaterial({
        name: "Material 1",
      }),
    );

    await createTransactionService.execute({
      companyId: company.id,
      collectionType: CollectionType.COLLECTION,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 10,
    });

    const transaction = await createTransactionService.execute({
      companyId: company.id,
      collectionType: CollectionType.POINT,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 5,
      unitAmount: 0.5,
    });

    await expect(async () => {
      await canceledTransactionService.execute({
        transactionId: transaction.id,
        companyId: company2.id,
      });
    }).rejects.toThrowError("Company does not own this transaction ");
  });
});
