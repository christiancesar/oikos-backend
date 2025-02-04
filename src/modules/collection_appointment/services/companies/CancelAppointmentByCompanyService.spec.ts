import { StatusCollectionAppointment } from "@modules/collection_appointment/entities/CollectionAppointment";
import { CollectionAppointmentsRepositoryInMemory } from "@modules/collection_appointment/repositories/inMemory/CollectionAppointmentsRepositoryInMemory";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { CancelAppointmentByCompanyService } from "./CancelAppointmentByCompanyService";

let companiesRepository: CompaniesRepositoryInMemory;
let collectionAppointmentsRepository: CollectionAppointmentsRepositoryInMemory;
let cancelAppointmentByCompanyService: CancelAppointmentByCompanyService;

describe("Cancelar o agendamento por empresa", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();
    collectionAppointmentsRepository =
      new CollectionAppointmentsRepositoryInMemory();
    cancelAppointmentByCompanyService = new CancelAppointmentByCompanyService({
      collectionAppointmentsRepository,
      companiesRepository,
    });
  });

  it("Deve ser possível a empresa marcar como cancelado o agendamento. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const userId2 = randomUUID();
    const randomWaste = randomUUID();

    const date = new Date("2022-12-16 08:00:00");

    const newAppointment =
      await collectionAppointmentsRepository.createCollectionAppointment({
        companyId: company.id,
        customerId: userId2,
        scheduleFor: date,
        wastes: [randomWaste],
      });

    const appointment = await cancelAppointmentByCompanyService.execute({
      companyId: company.id,
      appointmentId: newAppointment.id,
      reason: "Teste de cancelamento",
    });

    expect(appointment.status).toEqual(StatusCollectionAppointment.CANCELED);
  });

  it("Não deve ser possível a empresa marcar como cancelado o agendamento se a empresa não existir. [funcional] [negativo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const userId2 = randomUUID();
    const randomWaste = randomUUID();

    const date = new Date("2022-12-16 08:00:00");

    const newAppointment =
      await collectionAppointmentsRepository.createCollectionAppointment({
        companyId: company.id,
        customerId: userId2,
        scheduleFor: date,
        wastes: [randomWaste],
      });

    await expect(async () => {
      await cancelAppointmentByCompanyService.execute({
        companyId: "company-id-not-exists",
        appointmentId: newAppointment.id,
        reason: "Teste de cancelamento",
      });
    }).rejects.toThrow("Company not found");
  });

  it("Não deve ser possível a empresa marcar como cancelado se o agendamento não existir. [funcional] [negativo]", async () => {
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
      await cancelAppointmentByCompanyService.execute({
        companyId: company.id,
        appointmentId: "appointment-id-not-exists",
        reason: "Teste de cancelamento",
      });
    }).rejects.toThrow("Appointment not found");
  });

  it("Não deve ser possível a empresa marcar como cancelado se o agendamento não existir. [funcional] [negativo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const company2 = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const userId2 = randomUUID();
    const randomWaste = randomUUID();

    const date = new Date("2022-12-16 08:00:00");

    const newAppointment =
      await collectionAppointmentsRepository.createCollectionAppointment({
        companyId: company.id,
        customerId: userId2,
        scheduleFor: date,
        wastes: [randomWaste],
      });

    await expect(async () => {
      await cancelAppointmentByCompanyService.execute({
        companyId: company2.id,
        appointmentId: newAppointment.id,
        reason: "Teste de cancelamento",
      });
    }).rejects.toThrow(
      "Company does not have permission to cancel this appointment",
    );
  });

  it("Não deve ser possível a empresa marcar como cancelado se o agendamento não existir. [funcional] [negativo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const userId2 = randomUUID();
    const randomWaste = randomUUID();

    const date = new Date("2022-12-16 08:00:00");

    const newAppointment =
      await collectionAppointmentsRepository.createCollectionAppointment({
        companyId: company.id,
        customerId: userId2,
        scheduleFor: date,
        wastes: [randomWaste],
      });

    await cancelAppointmentByCompanyService.execute({
      companyId: company.id,
      appointmentId: newAppointment.id,
      reason: "Teste de cancelamento",
    });

    await expect(async () => {
      await cancelAppointmentByCompanyService.execute({
        companyId: company.id,
        appointmentId: newAppointment.id,
        reason: "Teste de cancelamento",
      });
    }).rejects.toThrow("Appointment already canceled");
  });
});
