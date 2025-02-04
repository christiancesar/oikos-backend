import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateCompanyService } from "./CreateCompanyService";
import { UpdateCompanyService } from "./UpdateCompanyService";
import { makeAddress } from "@modules/addresses/factories/makeAddress";
import { makeBusinessHoursDefault } from "@modules/companies/factories/makeBusinessHours";
import { randomUUID } from "node:crypto";

let companiesRepository: CompaniesRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let createCompanyService: CreateCompanyService;
let updateCompanyService: UpdateCompanyService;

describe("Atualizar informações da empresa", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    createCompanyService = new CreateCompanyService(
      usersRepository,
      companiesRepository,
    );
    updateCompanyService = new UpdateCompanyService(
      usersRepository,
      companiesRepository,
    );
  });

  it("Deve ser possível a atualizar o cadastro de uma empresa. [funcional] [positivo]", async () => {
    const userId1 = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    const company = await createCompanyService.execute({
      userId: userId1.id,
      company: makeCompany(),
    });

    const updated = await updateCompanyService.execute({
      userId: userId1.id,
      company: {
        ...company,
        email: "update@example.com",
      },
    });

    expect(updated).toHaveProperty("id");
  });

  it("Não deve ser possível a atualizar o cadastro de uma empresa, sem um usuario valido. [funcional] [negativo]", async () => {
    const userId1 = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    const company = await createCompanyService.execute({
      userId: userId1.id,
      company: makeCompany(),
    });

    await expect(async () => {
      await updateCompanyService.execute({
        userId: "user-not-exists",
        company: {
          ...company,
          email: "update@example.com",
        },
      });
    }).rejects.toThrow("User not found");
  });

  it("Não deve ser possível a atualizar o cadastro de uma empresa com um identificador invalido. [funcional] [negativo]", async () => {
    const userId1 = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    const company = await createCompanyService.execute({
      userId: userId1.id,
      company: makeCompany(),
    });

    await expect(async () => {
      await updateCompanyService.execute({
        userId: userId1.id,
        company: {
          ...company,
          id: "company-not-exists",
          email: "update@example.com",
        },
      });
    }).rejects.toThrow("Company not found");
  });

  it("Não deve ser possível a atualizar o cadastro de uma empresa para aceita agendamentos, caso ela não tenha endereço cadastrado. [estrutural] [negativo]", async () => {
    const userId1 = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    const company = await createCompanyService.execute({
      userId: userId1.id,
      company: makeCompany(),
    });

    await expect(async () => {
      await updateCompanyService.execute({
        userId: userId1.id,
        company: {
          ...company,
          acceptAppointments: true,
          email: "update@example.com",
        },
      });
    }).rejects.toThrow(
      "Company needs to have address, business hours and waste items registered to accept appointments",
    );
  });

  it("Não deve ser possível a atualizar o cadastro de uma empresa para aceita agendamentos, caso ela não tenha horario de atendimento cadastrado. [estrutural] [negativo]", async () => {
    const userId1 = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    const company = await createCompanyService.execute({
      userId: userId1.id,
      company: makeCompany(),
    });

    await companiesRepository.createAddress({
      companyId: company.id,
      address: makeAddress(),
    });

    await expect(async () => {
      await updateCompanyService.execute({
        userId: userId1.id,
        company: {
          ...company,
          acceptAppointments: true,
          email: "update@example.com",
        },
      });
    }).rejects.toThrow(
      "Company needs to have address, business hours and waste items registered to accept appointments",
    );
  });

  it("Não deve ser possível a atualizar o cadastro de uma empresa para aceita agendamentos, caso ela não tenha residuo cadastradado. [estrutural] [negativo]", async () => {
    const userId1 = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    const company = await createCompanyService.execute({
      userId: userId1.id,
      company: makeCompany(),
    });

    await companiesRepository.createAddress({
      companyId: company.id,
      address: makeAddress(),
    });

    makeBusinessHoursDefault().map(async (businessHours) => {
      await companiesRepository.createBusinessHours({
        companyId: company.id,
        businessHours,
      });
    });

    await expect(async () => {
      await updateCompanyService.execute({
        userId: userId1.id,
        company: {
          ...company,
          acceptAppointments: true,
          email: "update@example.com",
        },
      });
    }).rejects.toThrow(
      "Company needs to have address, business hours and waste items registered to accept appointments",
    );
  });

  it("Deve ser possível a atualizar o cadastro de uma empresa para aceita agendamentos, caso ela tenha horarios de atendimentos, endereço e residuo cadastrado. [estrutural] [positivo]", async () => {
    const userId1 = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    const company = await createCompanyService.execute({
      userId: userId1.id,
      company: makeCompany(),
    });

    await companiesRepository.createAddress({
      companyId: company.id,
      address: makeAddress(),
    });

    makeBusinessHoursDefault().map(async (businessHours) => {
      await companiesRepository.createBusinessHours({
        companyId: company.id,
        businessHours,
      });
    });

    await companiesRepository.createWasteItem({
      companyId: company.id,
      waste: {
        amount: 1,
        materialId: randomUUID(),
        unit: "kg",
        wasteType: "recyclable",
      },
    });
    const updated = await updateCompanyService.execute({
      userId: userId1.id,
      company: {
        ...company,
        acceptAppointments: true,
        email: "update@example.com",
      },
    });

    expect(updated).toHaveProperty("id");
  });
});
