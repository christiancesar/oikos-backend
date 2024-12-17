import { AppError } from "@common/errors/AppError";
import { WasteType } from "@modules/companies/entities/Item";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import { makeMaterial } from "@modules/material/factories/makeMaterial";
import { MaterialsRepositoryInMemory } from "@modules/material/repositories/inMemory/MaterialsRepositoryInMemory";
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateWasteItemService } from "./CreateWasteItemService";
import { ListWasteItemsService } from "./ListWasteItemsService";

let materialRepository: MaterialsRepositoryInMemory;
let companiesRepository: CompaniesRepositoryInMemory;
let createWasteItemService: CreateWasteItemService;
let listWasteItemsService: ListWasteItemsService;

describe("Listar materiais pot um empresa", () => {
  beforeEach(() => {
    materialRepository = new MaterialsRepositoryInMemory();
    companiesRepository = new CompaniesRepositoryInMemory();
    createWasteItemService = new CreateWasteItemService(
      companiesRepository,
      materialRepository,
    );

    listWasteItemsService = new ListWasteItemsService(companiesRepository);
  });

  it("Deve ser possível a empresa listar todos os materiais cadastrados. [funcional] [positivo]", async () => {
    const userId = randomUUID();
    const company = await companiesRepository.createCompany({
      company: makeCompany(),
      userId,
    });

    const material1 = await materialRepository.create(
      makeMaterial({
        name: "Material 1",
      }),
    );

    const material2 = await materialRepository.create(
      makeMaterial({
        name: "Material 2",
      }),
    );

    const material3 = await materialRepository.create(
      makeMaterial({
        name: "Material 3",
      }),
    );

    await createWasteItemService.execute({
      companyId: company.id,
      waste: {
        materialId: material1.id,
        amount: 1,
        unit: "KG",
        wasteType: "RECYCLABLE" as WasteType,
      },
    });

    await createWasteItemService.execute({
      companyId: company.id,
      waste: {
        materialId: material2.id,
        amount: 1,
        unit: "KG",
        wasteType: "RECYCLABLE" as WasteType,
      },
    });

    await createWasteItemService.execute({
      companyId: company.id,
      waste: {
        materialId: material3.id,
        amount: 1,
        unit: "KG",
        wasteType: "RECYCLABLE" as WasteType,
      },
    });

    const wasteItems = await listWasteItemsService.execute({
      companyId: company.id,
    });

    expect(wasteItems).toHaveLength(3);
  });

  it("Não deve ser possível a empresa listar todos os materiais cadastrados, quando o identificar da empresa não existe. [funcional] [positivo]", async () => {
    const userId = randomUUID();
    const company = await companiesRepository.createCompany({
      company: makeCompany(),
      userId,
    });

    const material1 = await materialRepository.create(
      makeMaterial({
        name: "Material 1",
      }),
    );

    const material2 = await materialRepository.create(
      makeMaterial({
        name: "Material 2",
      }),
    );

    const material3 = await materialRepository.create(
      makeMaterial({
        name: "Material 3",
      }),
    );

    await createWasteItemService.execute({
      companyId: company.id,
      waste: {
        materialId: material1.id,
        amount: 1,
        unit: "KG",
        wasteType: "RECYCLABLE" as WasteType,
      },
    });

    await createWasteItemService.execute({
      companyId: company.id,
      waste: {
        materialId: material2.id,
        amount: 1,
        unit: "KG",
        wasteType: "RECYCLABLE" as WasteType,
      },
    });

    await createWasteItemService.execute({
      companyId: company.id,
      waste: {
        materialId: material3.id,
        amount: 1,
        unit: "KG",
        wasteType: "RECYCLABLE" as WasteType,
      },
    });

    expect(async () => {
      await listWasteItemsService.execute({ companyId: "invalid-id" });
    }).rejects.toBeInstanceOf(AppError);
  });
});
