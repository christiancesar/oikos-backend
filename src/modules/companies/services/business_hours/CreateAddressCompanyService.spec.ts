import { makeBusinessHoursDefault } from "@modules/companies/factories/makeBusinessHours";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateBusinessHoursService } from "./CreateBusinessHoursService";

let companiesRepository: CompaniesRepositoryInMemory;
let createBusinessHoursService: CreateBusinessHoursService;

describe("Criar endereço da empresa", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();

    createBusinessHoursService = new CreateBusinessHoursService(
      companiesRepository,
    );
  });

  it("Deve ser possível a empresa poder cadastrar seu horario de atendimento. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const business = await createBusinessHoursService.execute({
      companyId: company.id,
      businessHours: makeBusinessHoursDefault(),
    });

    expect(business).toHaveLength(7);
  });

  it("Deve ser possível a empresa poder atualizar seu horario de atendimento. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    await createBusinessHoursService.execute({
      companyId: company.id,
      businessHours: makeBusinessHoursDefault(),
    });

    const business = await createBusinessHoursService.execute({
      companyId: company.id,
      businessHours: makeBusinessHoursDefault(),
    });

    expect(business).toHaveLength(7);
  });

  it("Não deve ser possível uma empresa sem cadastro poder criar seu horario de atendimento. [funcional] [negativo]", async () => {
    const userId1 = randomUUID();

    await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    await expect(async () => {
      await createBusinessHoursService.execute({
        companyId: "company-id-not-exist",
        businessHours: makeBusinessHoursDefault(),
      });
    }).rejects.toThrow("Company not found");
  });
});
