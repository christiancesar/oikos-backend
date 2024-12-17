import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateCompanyService } from "./CreateCompanyService";
import { FindCompanyService } from "./FindCompanyService";

let companiesRepository: CompaniesRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let createCompanyService: CreateCompanyService;
let findCompanyService: FindCompanyService;
describe("Procurar empresa", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    createCompanyService = new CreateCompanyService(
      usersRepository,
      companiesRepository,
    );

    findCompanyService = new FindCompanyService(companiesRepository);
  });

  it("Deve ser possível a pesquisar pelo identificador de uma empresa. [funcional] [positivo]", async () => {
    const userId1 = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    const company = await createCompanyService.execute({
      userId: userId1.id,
      company: makeCompany(),
    });

    const companyExist = await findCompanyService.execute(company.id);

    expect(companyExist).toHaveProperty("id");
  });

  it("Não deve ser possível a pesquisar empresa sem cadastrado. [funcional] [negativo]", async () => {
    await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    await expect(async () => {
      await findCompanyService.execute("company-not-exists");
    }).rejects.toThrow("Company not found");
  });
});
