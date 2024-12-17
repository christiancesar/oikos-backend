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

let companiesRepository: CompaniesRepositoryInMemory;
let collectionTransactionsRepository: CollectionTransactionsRepositoryInMemory;
let materialsRepository: MaterialsRepositoryInMemory;
let createTransactionService: CreateTransactionService;

describe("Criar um lançamento de coleta", () => {
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
  });

  it("Deve ser possível a empresa criar um lançamento de sua coleta. [funcional] [positivo]", async () => {
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

    expect(transaction).toHaveProperty("id");
  });

  it("Deve ser possível a empresa criar um lançamento de sua coleta quando recebe diretamente na empresa. [funcional] [positivo]", async () => {
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
      collectionType: CollectionType.POINT,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 10,
    });

    expect(transaction).toHaveProperty("id");
  });

  it("Deve ser possível a empresa criar um lançamento de sua coleta quando recebe diretamente na empresa. [funcional] [positivo]", async () => {
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
      collectionType: CollectionType.POINT,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 10,
      unitAmount: 0.5,
    });

    expect(transaction.grossAmount).toEqual(10 * 0.5);
  });

  it("Não deve ser possível criar lançamento de coleta quando empresa não for cadastrada. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const material1 = await materialsRepository.create(
      makeMaterial({
        name: "Material 1",
      }),
    );

    await expect(async () => {
      await createTransactionService.execute({
        companyId: "company-id-not-exists",
        collectionType: CollectionType.POINT,
        wasteId: material1.id,
        wasteType: WasteType.RECYCLABLE,
        tradingType: TradingType.COLLECTION,
        measurement: UnitOfMeasurement.KG,
        quantity: 10,
        unitAmount: 0.5,
      });
    }).rejects.toThrow("Company not found");
  });

  it("Não deve ser possível criar lançamento de coleta quando material não cadastrado. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    await materialsRepository.create(
      makeMaterial({
        name: "Material 1",
      }),
    );

    await expect(async () => {
      await createTransactionService.execute({
        companyId: company.id,
        collectionType: CollectionType.POINT,
        wasteId: "material-id-not-exists",
        wasteType: WasteType.RECYCLABLE,
        tradingType: TradingType.COLLECTION,
        measurement: UnitOfMeasurement.KG,
        quantity: 10,
        unitAmount: 0.5,
      });
    }).rejects.toThrow("Material not found");
  });

  it("Deve ser possível criar uma transação validando a estrutura da transação. [estrutural] [positivo]", async () => {
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
      collectionType: CollectionType.POINT,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 10,
      unitAmount: 0.5,
    });

    expect(transaction).toHaveProperty("id");
    expect(transaction.company).toHaveProperty("id", company.id);
    expect(transaction).toHaveProperty("collectionType", CollectionType.POINT);
    expect(transaction.waste).toHaveProperty("id", material1.id);
    expect(transaction).toHaveProperty("wasteType", WasteType.RECYCLABLE);
    expect(transaction).toHaveProperty("tradingType", TradingType.COLLECTION);
    expect(transaction).toHaveProperty("quantity", 10);
    expect(transaction).toHaveProperty("unitAmount", 0.5);
    expect(transaction).toHaveProperty("grossAmount", 10 * 0.5);
  });

  it("Não deve ser possível criar uma transação com dados inválidos. [estrutural] [negativo]", async () => {
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

    await expect(async () => {
      await createTransactionService.execute({
        companyId: company.id,
        collectionType: "INVALID_COLLECTION_TYPE" as CollectionType,
        wasteId: material1.id,
        wasteType: "INVALID_WASTE_TYPE" as WasteType,
        tradingType: "INVALID_TRADING_TYPE" as TradingType,
        measurement: "INVALID_MEASUREMENT" as UnitOfMeasurement,
        quantity: -10,
        unitAmount: -0.5,
      });
    }).rejects.toThrow();
  });
});
