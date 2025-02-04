import { WasteType } from "@modules/companies/entities/Item";
import { UnitOfMeasurement } from "@modules/companies/entities/MeasurementConst";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import { makeMaterial } from "@modules/material/factories/makeMaterial";
import { MaterialsRepositoryInMemory } from "@modules/material/repositories/inMemory/MaterialsRepositoryInMemory";
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { CollectionType, TradingType } from "../entities/CollectionTransaction";
import { CollectionTransactionsRepositoryInMemory } from "../repositories/inMemory/CollectionTransactionsRepositoryInMemory";
import { CreateTransactionService } from "./CreateTransactionService";

import { UpdateTransactionService } from "./UpdateTransactionService";
import { AppError } from "@common/errors/AppError";

let companiesRepository: CompaniesRepositoryInMemory;
let collectionTransactionsRepository: CollectionTransactionsRepositoryInMemory;
let materialsRepository: MaterialsRepositoryInMemory;
let createTransactionService: CreateTransactionService;

let updateTransactionService: UpdateTransactionService;

describe("Atualizar um lançamento de coleta por empresa", () => {
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

    updateTransactionService = new UpdateTransactionService({
      collectionTransactionsRepository,
      companiesRepository,
      materialsRepository,
    });
  });

  it("Deve ser possível a empresa atualizar seus lançamento de sua coleta. [funcional] [positivo]", async () => {
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

    const transactions = await updateTransactionService.execute({
      transactionId: transaction.id,
      companyId: company.id,
      collectionType: CollectionType.COLLECTION,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.BUY,
      measurement: UnitOfMeasurement.KG,
      quantity: 10,
      unitAmount: 0.5,
    });

    expect(transactions.collectionType).toEqual(CollectionType.COLLECTION);
    expect(transactions.tradingType).toEqual(TradingType.BUY);
    expect(transactions.grossAmount).toEqual(10 * 0.5);
  });

  it("Não deve ser possível uma empresa não cadastrada atualizar lançamento de sua coleta. [funcional] [positivo] [funcional] [positivo]", async () => {
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

    expect(async () => {
      await updateTransactionService.execute({
        transactionId: transaction.id,
        companyId: "invalid-company-id",
        collectionType: CollectionType.COLLECTION,
        wasteId: material1.id,
        wasteType: WasteType.RECYCLABLE,
        tradingType: TradingType.BUY,
        measurement: UnitOfMeasurement.KG,
        quantity: 5,
      });
    }).rejects.toThrow("Company not found");
  });

  it("Não deve ser possível uma empresa atualizar lançamento de sua coleta não cadastrado. [funcional] [positivo] [funcional] [positivo]", async () => {
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

    expect(async () => {
      await updateTransactionService.execute({
        transactionId: "invalid-transaction-id",
        companyId: company.id,
        collectionType: CollectionType.COLLECTION,
        wasteId: material1.id,
        wasteType: WasteType.RECYCLABLE,
        tradingType: TradingType.BUY,
        measurement: UnitOfMeasurement.KG,
        quantity: 5,
      });
    }).rejects.toThrow("Transaction not found");
  });

  it("Não deve ser possível uma empresa não cadastrada atualizar lançamento de sua coleta. [funcional] [positivo] [funcional] [positivo]", async () => {
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

    expect(async () => {
      await updateTransactionService.execute({
        transactionId: transaction.id,
        companyId: "invalid-company-id",
        collectionType: CollectionType.COLLECTION,
        wasteId: material1.id,
        wasteType: WasteType.RECYCLABLE,
        tradingType: TradingType.BUY,
        measurement: UnitOfMeasurement.KG,
        quantity: 5,
      });
    }).rejects.toThrow("Company not found");
  });

  it("Não deve ser possível uma empresa atualizar lançamento de sua coleta com material não cadastrado. [funcional] [positivo] [funcional] [positivo]", async () => {
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

    expect(async () => {
      await updateTransactionService.execute({
        transactionId: transaction.id,
        companyId: company.id,
        collectionType: CollectionType.COLLECTION,
        wasteId: "invalid-material-id",
        wasteType: WasteType.RECYCLABLE,
        tradingType: TradingType.BUY,
        measurement: UnitOfMeasurement.KG,
        quantity: 5,
      });
    }).rejects.toThrow("Material not found");
  });

  it("Deve validar os campos enum corretamente. [estrutural] [positivo]", async () => {
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

    const transaction = await createTransactionService.execute({
      companyId: company.id,
      collectionType: CollectionType.COLLECTION,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 10,
    });

    const updatedTransaction = await updateTransactionService.execute({
      transactionId: transaction.id,
      companyId: company.id,
      collectionType: CollectionType.POINT,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.BUY,
      measurement: UnitOfMeasurement.KG,
      quantity: 5,
      unitAmount: 0.5,
    });

    expect(updatedTransaction.collectionType).toEqual(CollectionType.POINT);
    expect(updatedTransaction.wasteType).toEqual(WasteType.RECYCLABLE);
    expect(updatedTransaction.tradingType).toEqual(TradingType.BUY);
  });

  it("Deve lançar erro ao passar valor inválido para o campo tipo de coleta. [estrutural] [negativo]", async () => {
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

    const transaction = await createTransactionService.execute({
      companyId: company.id,
      collectionType: CollectionType.COLLECTION,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 10,
    });

    await expect(async () => {
      await updateTransactionService.execute({
        transactionId: transaction.id,
        companyId: company.id,
        collectionType: "INVALID_COLLECTION_TYPE" as CollectionType,
        wasteId: material1.id,
        wasteType: "INVALID_WASTE_TYPE" as WasteType,
        tradingType: "INVALID_TRADING_TYPE" as TradingType,
        measurement: UnitOfMeasurement.KG,
        quantity: 5,
        unitAmount: 0.5,
      });
    }).rejects.toThrow();
  });

  it("Deve lançar erro ao passar valor inválido para o campo tipo de residuo. [estrutural] [negativo]", async () => {
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

    const transaction = await createTransactionService.execute({
      companyId: company.id,
      collectionType: CollectionType.COLLECTION,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 10,
    });

    await expect(async () => {
      await updateTransactionService.execute({
        transactionId: transaction.id,
        companyId: company.id,
        collectionType: CollectionType.COLLECTION,
        wasteId: material1.id,
        wasteType: "INVALID_WASTE_TYPE" as WasteType,
        tradingType: "INVALID_TRADING_TYPE" as TradingType,
        measurement: UnitOfMeasurement.KG,
        quantity: 5,
        unitAmount: 0.5,
      });
    }).rejects.toThrow();
  });

  it("Deve lançar erro ao passar valor inválido para o campo tipo de transação. [estrutural] [negativo]", async () => {
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

    const transaction = await createTransactionService.execute({
      companyId: company.id,
      collectionType: CollectionType.COLLECTION,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 10,
    });

    await expect(async () => {
      await updateTransactionService.execute({
        transactionId: transaction.id,
        companyId: company.id,
        collectionType: CollectionType.COLLECTION,
        wasteId: material1.id,
        wasteType: WasteType.RECYCLABLE,
        tradingType: "INVALID_TRADING_TYPE" as TradingType,
        measurement: UnitOfMeasurement.KG,
        quantity: 5,
        unitAmount: 0.5,
      });
    }).rejects.toThrow(AppError);
  });

  it("Deve lançar erro ao passar valor inválido para campo de unidade. [estrutural] [negativo]", async () => {
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

    const transaction = await createTransactionService.execute({
      companyId: company.id,
      collectionType: CollectionType.COLLECTION,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 10,
    });

    await expect(async () => {
      await updateTransactionService.execute({
        transactionId: transaction.id,
        companyId: company.id,
        collectionType: CollectionType.COLLECTION,
        wasteId: material1.id,
        wasteType: WasteType.RECYCLABLE,
        tradingType: TradingType.BUY,
        measurement: "LL" as UnitOfMeasurement,
        quantity: 5,
        unitAmount: 0.5,
      });
    }).rejects.toThrow(AppError);
  });
});
