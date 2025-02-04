import { makeAddress } from "@modules/addresses/factories/makeAddress";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateAddressCompanyService } from "./CreateAddressCompanyService";

let companiesRepository: CompaniesRepositoryInMemory;
let createAddressCompanyService: CreateAddressCompanyService;

describe("Criar endereço da empresa", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();
    createAddressCompanyService = new CreateAddressCompanyService(
      companiesRepository,
    );
  });

  it("Deve ser possível a empresa poder cadastrar seu endereço. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const address = await createAddressCompanyService.execute({
      address: {
        ...makeAddress({
          city: "São Paulo",
          state: "SP",
          street: "Rua do teste",
          number: "123",
          district: "Bairro do teste",
          zipCode: "12345678",
        }),
      },
      companyId: company.id,
    });

    expect(address.city).toEqual("São Paulo");
    expect(address.state).toEqual("SP");
  });

  it("Nao deve ser possível empresa não cadastrada cadastrar um endereço. [funcional] [negativo]", async () => {
    const userId1 = randomUUID();

    await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    await expect(async () => {
      await createAddressCompanyService.execute({
        address: {
          ...makeAddress(),
        },
        companyId: "company-id-not-exists",
      });
    }).rejects.toThrow("Company does not exist");
  });
});
