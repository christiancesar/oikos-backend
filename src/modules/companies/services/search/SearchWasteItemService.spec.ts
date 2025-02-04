import { unitOfMeasurement } from "@modules/companies/entities/MeasurementConst";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { SearchWasteItemService } from "./SearchWasteItemService";

let companiesRepository: CompaniesRepositoryInMemory;
let searchWasteItemService: SearchWasteItemService;

describe("Pesquisar residuo das empresa cadastradas", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();

    searchWasteItemService = new SearchWasteItemService(companiesRepository);
  });

  it("Deve ser possível a pesquisar residuos pela categoria. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    await companiesRepository.createWasteItem({
      companyId: company.id,
      waste: {
        materialId: randomUUID(),
        amount: 10,
        unit: unitOfMeasurement.KG.symbol,
        wasteType: "RECYCLABLE",
      },
    });

    const search = await searchWasteItemService.execute({
      category: "plasticos",
    });

    expect(search).toHaveLength(1);
  });

  it("Deve ser possível a pesquisar residuos pelo nome do residuo. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    await companiesRepository.createWasteItem({
      companyId: company.id,
      waste: {
        materialId: randomUUID(),
        amount: 10,
        unit: unitOfMeasurement.KG.symbol,
        wasteType: "RECYCLABLE",
      },
    });

    const search = await searchWasteItemService.execute({
      waste: "garrafa",
    });

    expect(search).toHaveLength(1);
  });

  it("Deve ser possível a pesquisar residuos pelo nome da empresa. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    await companiesRepository.createWasteItem({
      companyId: company.id,
      waste: {
        materialId: randomUUID(),
        amount: 10,
        unit: unitOfMeasurement.KG.symbol,
        wasteType: "RECYCLABLE",
      },
    });

    const search = await searchWasteItemService.execute({
      company: "Oikos",
    });

    expect(search).toHaveLength(1);
  });

  it("Deve ser possível a pesquisar residuos pelo nome da empresa. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    await companiesRepository.createWasteItem({
      companyId: company.id,
      waste: {
        materialId: randomUUID(),
        amount: 10,
        unit: unitOfMeasurement.KG.symbol,
        wasteType: "RECYCLABLE",
      },
    });

    const search = await searchWasteItemService.execute({
      company: "Oikos",
      category: "plasticos",
      waste: "garrafa",
    });

    expect(search).toHaveLength(1);
  });
});
