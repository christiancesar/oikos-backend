import { makeAddress } from "@modules/addresses/factories/makeAddress";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateAddressCompanyService } from "./CreateAddressCompanyService";
import { UpdateAddressCompanyService } from "./UpdateAddressProfileService";

let companiesRepository: CompaniesRepositoryInMemory;
let createAddressCompanyService: CreateAddressCompanyService;
let updateAddressCompanyService: UpdateAddressCompanyService;
describe("Atualizar endereço da empresa", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();
    createAddressCompanyService = new CreateAddressCompanyService(
      companiesRepository,
    );
    updateAddressCompanyService = new UpdateAddressCompanyService(
      companiesRepository,
    );
  });

  it("Deve ser possível a empresa poder atauliazar seu endereço. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const addressCreated = await createAddressCompanyService.execute({
      address: {
        ...makeAddress(),
      },
      companyId: company.id,
    });

    const updateAddress = await updateAddressCompanyService.execute({
      address: {
        ...addressCreated,
        city: "São Paulo",
      },
      companyId: company.id,
    });

    expect(updateAddress.city).toEqual("São Paulo");
  });

  it("Nao deve ser possível empresa não cadastrada atualizar um endereço. [funcional] [negativo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const addressCreated = await createAddressCompanyService.execute({
      address: {
        ...makeAddress(),
      },
      companyId: company.id,
    });

    await expect(async () => {
      await updateAddressCompanyService.execute({
        address: {
          ...addressCreated,
          city: "São Paulo",
        },
        companyId: "company-id-not-exists",
      });
    }).rejects.toThrow("Company does not exist");
  });
});
