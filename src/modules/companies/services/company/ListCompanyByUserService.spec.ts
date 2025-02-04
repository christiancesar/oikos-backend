import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateCompanyService } from "./CreateCompanyService";
import { ListCompanyByUserService } from "./ListCompanyByUserService";

let companiesRepository: CompaniesRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let createCompanyService: CreateCompanyService;
let listCompanyByUserService: ListCompanyByUserService;

describe("Listar empresas por Usuario", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    createCompanyService = new CreateCompanyService(
      usersRepository,
      companiesRepository,
    );

    listCompanyByUserService = new ListCompanyByUserService(
      usersRepository,
      companiesRepository,
    );
  });

  it("Deve ser possível a listar todas as empresas por usuario. [funcional] [positivo]", async () => {
    const userId1 = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    await createCompanyService.execute({
      userId: userId1.id,
      company: makeCompany({
        identity: "000000000000-67",
        corporateName: "Company Test A",
      }),
    });

    await createCompanyService.execute({
      userId: userId1.id,
      company: makeCompany({
        identity: "000000000000-65",
        corporateName: "Company Test B",
      }),
    });

    const companies = await listCompanyByUserService.execute(userId1.id);

    expect(companies).toHaveLength(2);
  });

  it("Nao deve ser possível efetuar pesquisa, caso usuario não esteja cadastrado. [funcional] [negativo]", async () => {
    const userId1 = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    await createCompanyService.execute({
      userId: userId1.id,
      company: makeCompany({
        identity: "000000000000-67",
        corporateName: "Company Test A",
      }),
    });

    await createCompanyService.execute({
      userId: userId1.id,
      company: makeCompany({
        identity: "000000000000-65",
        corporateName: "Company Test B",
      }),
    });

    await expect(async () => {
      await listCompanyByUserService.execute("user-not-exists");
    }).rejects.toThrow("User not exists");
  });
});
