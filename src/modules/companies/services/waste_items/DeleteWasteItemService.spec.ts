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
import { DeleteWasteItemService } from "./DeleteWasteItemService";

let materialRepository: MaterialsRepositoryInMemory;
let companiesRepository: CompaniesRepositoryInMemory;
let createWasteItemService: CreateWasteItemService;
let deleteWasteItemService: DeleteWasteItemService;

describe("Deletar um material para de uma empresa", () => {
  beforeEach(() => {
    materialRepository = new MaterialsRepositoryInMemory();
    companiesRepository = new CompaniesRepositoryInMemory();
    createWasteItemService = new CreateWasteItemService(
      companiesRepository,
      materialRepository,
    );

    deleteWasteItemService = new DeleteWasteItemService(companiesRepository);
  });

  it("Deve ser possível a empresa deletar produtos na qual ela recicla ou recolhe. [funcional] [positivo]", async () => {
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

    const wasteId = await createWasteItemService.execute({
      companyId: company.id,
      waste: {
        materialId: material1.id,
        amount: 1,
        unit: "KG",
        wasteType: "RECYCLABLE" as WasteType,
      },
    });

    await deleteWasteItemService.execute({
      companyId: company.id,
      wasteId: wasteId.id,
    });

    const wasteItems = await companiesRepository.listWasteItemsByCompanyId(
      company.id,
    );

    expect(wasteItems).toHaveLength(0);
  });

  it("Não deve ser possível a empresa deletar produtos quando o indentificador do material não existe. [funcional] [negativo]", async () => {
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

    await createWasteItemService.execute({
      companyId: company.id,
      waste: {
        materialId: material1.id,
        amount: 1,
        unit: "KG",
        wasteType: "RECYCLABLE" as WasteType,
      },
    });

    await expect(
      async () =>
        await deleteWasteItemService.execute({
          companyId: company.id,
          wasteId: "material-id-not-exists",
        }),
    ).rejects.toThrowError(AppError);
  });

  it("Não deve ser possível a empresa deletar produtos quando não estiver cadastrada. [funcional] [negativo]", async () => {
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

    const material = await createWasteItemService.execute({
      companyId: company.id,
      waste: {
        materialId: material1.id,
        amount: 1,
        unit: "KG",
        wasteType: "RECYCLABLE" as WasteType,
      },
    });

    await expect(
      async () =>
        await deleteWasteItemService.execute({
          companyId: "company-id-not-exists",
          wasteId: material.id,
        }),
    ).rejects.toThrowError(AppError);
  });
});
