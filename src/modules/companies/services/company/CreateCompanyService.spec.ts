import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateCompanyService } from "./CreateCompanyService";

let companiesRepository: CompaniesRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let createCompanyService: CreateCompanyService;

describe("Criar empresa", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    createCompanyService = new CreateCompanyService(
      usersRepository,
      companiesRepository,
    );
  });

  it("Deve ser possível a criar uma empresa. [funcional] [positivo]", async () => {
    const userId1 = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    const company = await createCompanyService.execute({
      userId: userId1.id,
      company: makeCompany(),
    });

    expect(company).toHaveProperty("id");
  });

  it("Deve ser possível de identificar o cadastro de uma empresa duplicada através do identificador(CNPJ) da empresa. [funcional] [positivo]", async () => {
    const userId1 = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    await createCompanyService.execute({
      userId: userId1.id,
      company: makeCompany(),
    });

    const company = await createCompanyService.execute({
      userId: userId1.id,
      company: makeCompany(),
    });

    expect(company).toHaveProperty("id");
  });

  it("Não deve ser possível a criar uma empresa sem usuario cadastrado. [funcional] [negativo]", async () => {
    await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    await expect(async () => {
      await createCompanyService.execute({
        userId: "user-not-exists",
        company: makeCompany(),
      });
    }).rejects.toThrow("User not exists");
  });
});
