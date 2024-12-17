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

let materialRepository: MaterialsRepositoryInMemory;
let companiesRepository: CompaniesRepositoryInMemory;
let createWasteItemService: CreateWasteItemService;

describe("Criar materiais para uma empresa", () => {
  beforeEach(() => {
    materialRepository = new MaterialsRepositoryInMemory();
    companiesRepository = new CompaniesRepositoryInMemory();
    createWasteItemService = new CreateWasteItemService(
      companiesRepository,
      materialRepository,
    );
  });

  it("Deve ser possível a empresa cadastrar produtos na qual ela recicla ou recolhe. [funcional] [positivo]", async () => {
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

    const wasteItem = await createWasteItemService.execute({
      companyId: company.id,
      waste: {
        materialId: material1.id,
        amount: 1,
        unit: "KG",
        wasteType: "RECYCLABLE" as WasteType,
      },
    });

    expect(wasteItem).toHaveProperty("id");
  });

  it("Não deve ser possível a empresa cadastrar produtos, quando o produto não esta cadastado. [funcional] [negativo]", async () => {
    const userId = randomUUID();
    const company = await companiesRepository.createCompany({
      company: makeCompany(),
      userId,
    });

    await materialRepository.create(
      makeMaterial({
        name: "Material 1",
      }),
    );

    await expect(async () => {
      await createWasteItemService.execute({
        companyId: company.id,
        waste: {
          materialId: "material-id-not-exists",
          amount: 1,
          unit: "KG",
          wasteType: "RECYCLABLE" as WasteType,
        },
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possível a empresa cadastrar produtos, quando identificador da empresa não existir. [funcional] [negativo]", async () => {
    const userId = randomUUID();
    await companiesRepository.createCompany({
      company: makeCompany(),
      userId,
    });

    const material = await materialRepository.create(
      makeMaterial({
        name: "Material 1",
      }),
    );

    await expect(async () => {
      await createWasteItemService.execute({
        companyId: "company-id-not-exists",
        waste: {
          materialId: material.id,
          amount: 1,
          unit: "KG",
          wasteType: "RECYCLABLE" as WasteType,
        },
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possível a empresa cadastrar produtos, quando a unidade de medida não for informada ou informada incorreta. [funcional] [negativo]", async () => {
    const userId = randomUUID();
    const company = await companiesRepository.createCompany({
      company: makeCompany(),
      userId,
    });

    const material = await materialRepository.create(
      makeMaterial({
        name: "Material 1",
      }),
    );

    await expect(async () => {
      await createWasteItemService.execute({
        companyId: company.id,
        waste: {
          materialId: material.id,
          amount: 1,
          unit: "unit-not-exists",
          wasteType: "RECYCLABLE" as WasteType,
        },
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
