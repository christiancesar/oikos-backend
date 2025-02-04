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
import { ListAllTransactionsServiceByCompany } from "./ListAllTransactionsServiceByCompany";

let companiesRepository: CompaniesRepositoryInMemory;
let collectionTransactionsRepository: CollectionTransactionsRepositoryInMemory;
let materialsRepository: MaterialsRepositoryInMemory;
let createTransactionService: CreateTransactionService;
let listAllTransactionsServiceByCompany: ListAllTransactionsServiceByCompany;
describe("Listar lançamento de coleta por empresa", () => {
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
    listAllTransactionsServiceByCompany =
      new ListAllTransactionsServiceByCompany({
        collectionTransactionsRepository,
        companiesRepository,
      });
  });

  it("Deve ser possível a empresa listar seus lançamento de sua coleta. [funcional] [positivo]", async () => {
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

    const transactions = await listAllTransactionsServiceByCompany.execute(
      company.id,
    );

    expect(transactions).toHaveLength(2);
  });

  it("Não deve ser possível empresa não cadastradas listar lançamento de sua coleta. [funcional] [negativo]", async () => {
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
      await listAllTransactionsServiceByCompany.execute("company-id-not-exist");
    }).rejects.toThrow("Company not found");
  });

  it("Deve listar apenas os lançamentos da empresa solicitada. [estrutural] [positivo]", async () => {
    const userId1 = randomUUID();
    const userId2 = randomUUID();

    const company1 = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const company2 = await companiesRepository.createCompany({
      userId: userId2,
      company: makeCompany(),
    });

    const material1 = await materialsRepository.create(
      makeMaterial({
        name: "Material 1",
      }),
    );

    await createTransactionService.execute({
      companyId: company1.id,
      collectionType: CollectionType.COLLECTION,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 10,
    });

    await createTransactionService.execute({
      companyId: company1.id,
      collectionType: CollectionType.POINT,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 5,
      unitAmount: 0.5,
    });

    await createTransactionService.execute({
      companyId: company2.id,
      collectionType: CollectionType.COLLECTION,
      wasteId: material1.id,
      wasteType: WasteType.RECYCLABLE,
      tradingType: TradingType.COLLECTION,
      measurement: UnitOfMeasurement.KG,
      quantity: 20,
    });

    const transactions = await listAllTransactionsServiceByCompany.execute(
      company2.id,
    );

    expect(transactions).toHaveLength(1);
  });
});
