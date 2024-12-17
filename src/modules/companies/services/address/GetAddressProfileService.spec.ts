import { makeAddress } from "@modules/addresses/factories/makeAddress";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateAddressCompanyService } from "./CreateAddressCompanyService";
import { GetAddressCompanyService } from "./GetAddressProfileService";

let companiesRepository: CompaniesRepositoryInMemory;
let createAddressCompanyService: CreateAddressCompanyService;
let getAddressCompanyService: GetAddressCompanyService;

describe("Listar o endereço da empresa", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();
    createAddressCompanyService = new CreateAddressCompanyService(
      companiesRepository,
    );
    getAddressCompanyService = new GetAddressCompanyService(
      companiesRepository,
    );
  });

  it("Deve ser possível a empresa litar seu endereço informando o indentificador da empresa. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    await createAddressCompanyService.execute({
      address: {
        ...makeAddress({
          id: "898d37bb-e397-4c9a-a56f-7c0530f53280",
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

    const getAddress = await getAddressCompanyService.execute(company.id);

    expect(getAddress?.city).toEqual("São Paulo");
    expect(getAddress?.id).toEqual("898d37bb-e397-4c9a-a56f-7c0530f53280");
  });

  it("Nao deve ser possível empresa não cadastrada cadastrar um endereço. [funcional] [negativo]", async () => {
    const userId1 = randomUUID();

    await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    await expect(async () => {
      await getAddressCompanyService.execute("company-id-not-exists");
    }).rejects.toThrow("Company not found");
  });
});
