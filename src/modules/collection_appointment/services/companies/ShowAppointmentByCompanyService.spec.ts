import { CollectionAppointmentsRepositoryInMemory } from "@modules/collection_appointment/repositories/inMemory/CollectionAppointmentsRepositoryInMemory";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { ShowAppointmentByCompanyService } from "./ShowAppointmentByCompanyService";

let companiesRepository: CompaniesRepositoryInMemory;
let collectionAppointmentsRepository: CollectionAppointmentsRepositoryInMemory;
let showAppointmentByCompanyService: ShowAppointmentByCompanyService;
describe("Mostrar um agendamento por empresa", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();
    collectionAppointmentsRepository =
      new CollectionAppointmentsRepositoryInMemory();
    showAppointmentByCompanyService = new ShowAppointmentByCompanyService({
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
    const appointment =
      await collectionAppointmentsRepository.createCollectionAppointment({
        companyId: company.id,
        customerId: userId2,
        scheduleFor: date,
        wastes: [randomWaste],
      });

    const showAppointment = await showAppointmentByCompanyService.execute({
      companyId: company.id,
      appointmentId: appointment.id,
    });

    expect(showAppointment).toEqual(appointment);
  });

  it("Não deve ser possível a empresa listar um agendamento que não é dela. [funcional] [negativo]", async () => {
    const userId1 = randomUUID();

    const company1 = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const userId2 = randomUUID();

    const company2 = await companiesRepository.createCompany({
      userId: userId2,
      company: makeCompany(),
    });

    const randomWaste = randomUUID();
    const date = new Date("2022-12-16 08:00:00");

    const appointment =
      await collectionAppointmentsRepository.createCollectionAppointment({
        companyId: company1.id,
        customerId: userId1,
        scheduleFor: date,
        wastes: [randomWaste],
      });

    await expect(async () => {
      await showAppointmentByCompanyService.execute({
        companyId: company2.id,
        appointmentId: appointment.id,
      });
    }).rejects.toThrow(
      "Company does not have permission to view this appointment",
    );
  });

  it("Não deve ser possível a empresa listar um agendamento que não existe. [funcional] [negativo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    await expect(async () => {
      await showAppointmentByCompanyService.execute({
        companyId: company.id,
        appointmentId: randomUUID(),
      });
    }).rejects.toThrow("Appointment not found");
  });

  it("Não deve ser possível empresa nao cadastrada listar um agendamento. [funcional] [negativo]", async () => {
    const userId1 = randomUUID();

    const company1 = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const randomWaste = randomUUID();
    const date = new Date("2022-12-16 08:00:00");

    const appointment =
      await collectionAppointmentsRepository.createCollectionAppointment({
        companyId: company1.id,
        customerId: userId1,
        scheduleFor: date,
        wastes: [randomWaste],
      });

    await expect(async () => {
      await showAppointmentByCompanyService.execute({
        companyId: "invalid-company-id",
        appointmentId: appointment.id,
      });
    }).rejects.toThrow("Company not found");
  });
});
