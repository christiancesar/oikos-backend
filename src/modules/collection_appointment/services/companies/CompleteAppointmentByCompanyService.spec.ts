import { StatusCollectionAppointment } from "@modules/collection_appointment/entities/CollectionAppointment";
import { CollectionAppointmentsRepositoryInMemory } from "@modules/collection_appointment/repositories/inMemory/CollectionAppointmentsRepositoryInMemory";
import { CollectionTransactionsRepositoryInMemory } from "@modules/collection_transaction/repositories/inMemory/CollectionTransactionsRepositoryInMemory";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { CompletedAppointmentByCompanyService } from "./CompleteAppointmentByCompanyService";

let companiesRepository: CompaniesRepositoryInMemory;
let collectionAppointmentsRepository: CollectionAppointmentsRepositoryInMemory;
let collectionTransactionsRepository: CollectionTransactionsRepositoryInMemory;
let completedAppointmentByCompanyService: CompletedAppointmentByCompanyService;

describe("Marcar como completo o agendamento por empresa", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();
    collectionAppointmentsRepository =
      new CollectionAppointmentsRepositoryInMemory();
    collectionTransactionsRepository =
      new CollectionTransactionsRepositoryInMemory();
    completedAppointmentByCompanyService =
      new CompletedAppointmentByCompanyService({
        collectionAppointmentsRepository,
        companiesRepository,
        collectionTransactionsRepository,
      });
  });

  it("Deve ser possível a empresa marcar como completo/concluido o agendamento. [funcional] [positivo]", async () => {
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

    const appointment = await completedAppointmentByCompanyService.execute({
      companyId: company.id,
      appointmentId: newAppointment.id,
    });

    expect(appointment.status).toEqual(StatusCollectionAppointment.COMPLETED);
  });

  it("Não deve ser possivel ao tentar marcar como completo um agendamento que não existe. [funcional] [negativo]", async () => {
    const userId1 = randomUUID();

    const company = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    await expect(async () => {
      await completedAppointmentByCompanyService.execute({
        companyId: company.id,
        appointmentId: "non-existent-id",
      });
    }).rejects.toThrow("Appointment not found");
  });

  it("Não deve ser possivel uma empresa não cadastrada tentar marcar como completo um agendamento. [funcional] [positivo]", async () => {
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
      await completedAppointmentByCompanyService.execute({
        companyId: "non-existent-id",
        appointmentId: newAppointment.id,
      });
    }).rejects.toThrow("Company not found");
  });

  it("Não deve ser possivel uma empresa tentar marcar como completo um agendamento que não pertence a ela. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();

    const company1 = await companiesRepository.createCompany({
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
        companyId: company1.id,
        customerId: userId2,
        scheduleFor: date,
        wastes: [randomWaste],
      });

    await expect(async () => {
      await completedAppointmentByCompanyService.execute({
        companyId: company2.id,
        appointmentId: newAppointment.id,
      });
    }).rejects.toThrow("Company does not have permission to complete");
  });

  it("Não deve ser possivel uma empresa tentar marcar como completo um agendamento que já foi cancelado. [funcional] [positivo]", async () => {
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

    await collectionAppointmentsRepository.cancelCollectionAppointment({
      appointmentId: newAppointment.id,
      customerId: userId2,
      reason: "Teste",
    });

    await expect(async () => {
      await completedAppointmentByCompanyService.execute({
        companyId: company.id,
        appointmentId: newAppointment.id,
      });
    }).rejects.toThrow("Appointment is canceled");
  });

  it("Não deve ser possivel uma empresa tentar marcar como completo um agendamento que já foi concluido. [funcional] [positivo]", async () => {
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

    await completedAppointmentByCompanyService.execute({
      companyId: company.id,
      appointmentId: newAppointment.id,
    });

    await expect(async () => {
      await completedAppointmentByCompanyService.execute({
        companyId: company.id,
        appointmentId: newAppointment.id,
      });
    }).rejects.toThrow("Appointment is already completed");
  });

  it("Deve ser possível a empresa ao marcar como completo/concluido o agendamento, criar uma transação de coleta. [estrutural] [positivo]", async () => {
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

    await completedAppointmentByCompanyService.execute({
      companyId: company.id,
      appointmentId: newAppointment.id,
    });

    const transactions =
      await collectionTransactionsRepository.listCollectionTransactionsByCompanyId(
        company.id,
      );

    expect(transactions).toHaveLength(1);
  });
});
