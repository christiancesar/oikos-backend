import { CollectionAppointmentsRepositoryInMemory } from "@modules/collection_appointment/repositories/inMemory/CollectionAppointmentsRepositoryInMemory";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { ListAppointmentsByCompanyService } from "./ListAppointmentsByCompanyService";

let companiesRepository: CompaniesRepositoryInMemory;
let collectionAppointmentsRepository: CollectionAppointmentsRepositoryInMemory;
let listAppointmentsByCompanyService: ListAppointmentsByCompanyService;
describe("Mostrar um agendamento por empresa", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();
    collectionAppointmentsRepository =
      new CollectionAppointmentsRepositoryInMemory();
    listAppointmentsByCompanyService = new ListAppointmentsByCompanyService({
      collectionAppointmentsRepository,
      companiesRepository,
    });
  });

  it("Deve ser possível a empresa listar todos seus agendamentos. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const userId2 = randomUUID();
    const randomWaste = randomUUID();

    const date = new Date("2022-12-16 08:00:00");

    await collectionAppointmentsRepository.createCollectionAppointment({
      companyId: company.id,
      customerId: userId2,
      scheduleFor: date,
      wastes: [randomWaste],
    });

    const appointments = await listAppointmentsByCompanyService.execute({
      companyId: company.id,
    });

    expect(appointments).toHaveLength(1);
  });

  it("Não deve ser possível a empresa listar um agendamento que não é dela. [estrutural] [negativo]", async () => {
    const userId1 = randomUUID();

    const company1 = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const userId2 = randomUUID();
    const randomWaste = randomUUID();

    const date = new Date("2022-12-16 08:00:00");

    await collectionAppointmentsRepository.createCollectionAppointment({
      companyId: company1.id,
      customerId: userId2,
      scheduleFor: date,
      wastes: [randomWaste],
    });

    await collectionAppointmentsRepository.createCollectionAppointment({
      companyId: company1.id,
      customerId: userId2,
      scheduleFor: date,
      wastes: [randomWaste],
    });

    const userId3 = randomUUID();

    const company2 = await companiesRepository.createCompany({
      userId: userId3,
      company: makeCompany(),
    });

    await collectionAppointmentsRepository.createCollectionAppointment({
      companyId: company2.id,
      customerId: userId2,
      scheduleFor: date,
      wastes: [randomWaste],
    });

    const appointments = await listAppointmentsByCompanyService.execute({
      companyId: company1.id,
    });

    expect(appointments).toHaveLength(2);
  });

  it("Deve ser possível a empresa listar todos seus agendamentos. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const userId2 = randomUUID();
    const randomWaste = randomUUID();

    const date = new Date("2022-12-16 08:00:00");

    await collectionAppointmentsRepository.createCollectionAppointment({
      companyId: company.id,
      customerId: userId2,
      scheduleFor: date,
      wastes: [randomWaste],
    });

    await expect(async () => {
      await listAppointmentsByCompanyService.execute({
        companyId: "company-id-not-exists",
      });
    }).rejects.toThrow("Company not found");
  });
});
