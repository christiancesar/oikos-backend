import { StatusCollectionAppointment } from "@modules/collection_appointment/entities/CollectionAppointment";
import { CollectionAppointmentsRepositoryInMemory } from "@modules/collection_appointment/repositories/inMemory/CollectionAppointmentsRepositoryInMemory";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { ConfirmationAppointmentByCompanyService } from "./ConfirmationAppointmentByCompanyService";

let companiesRepository: CompaniesRepositoryInMemory;
let collectionAppointmentsRepository: CollectionAppointmentsRepositoryInMemory;
let confirmationAppointmentByCompanyService: ConfirmationAppointmentByCompanyService;
describe("Confirmar agendamento por empresa", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();
    collectionAppointmentsRepository =
      new CollectionAppointmentsRepositoryInMemory();
    confirmationAppointmentByCompanyService =
      new ConfirmationAppointmentByCompanyService({
        collectionAppointmentsRepository,
        companiesRepository,
      });
  });

  it("Deve ser possível a empresa confirmar o agendamento. [funcional] [positivo]", async () => {
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

    const appointment = await confirmationAppointmentByCompanyService.execute({
      companyId: company.id,
      appointmentId: newAppointment.id,
    });

    expect(appointment.status).toEqual(StatusCollectionAppointment.CONFIRMED);
  });

  it("Deve ser possível empresas confirmarem o agendamento. [funcional] [positivo]", async () => {
    const userId1 = randomUUID();
    const userIdCustomer1 = randomUUID();

    const company1 = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany({
        corporateName: "Company 1",
      }),
    });

    const randomWaste = randomUUID();
    const date1 = new Date("2024-12-21 08:00:00");

    const newAppointment1 =
      await collectionAppointmentsRepository.createCollectionAppointment({
        companyId: company1.id,
        customerId: userIdCustomer1,
        scheduleFor: date1,
        wastes: [randomWaste],
      });

    const confirmation1 = await confirmationAppointmentByCompanyService.execute(
      {
        companyId: company1.id,
        appointmentId: newAppointment1.id,
      },
    );

    const userId2 = randomUUID();
    const userIdCustomer2 = randomUUID();
    const date2 = new Date("2024-12-23 10:00:00");
    const company2 = await companiesRepository.createCompany({
      userId: userId2,
      company: makeCompany({
        corporateName: "Company 2",
      }),
    });

    const newAppointment2 =
      await collectionAppointmentsRepository.createCollectionAppointment({
        companyId: company2.id,
        customerId: userIdCustomer2,
        scheduleFor: date2,
        wastes: [randomWaste],
      });

    const confirmation2 = await confirmationAppointmentByCompanyService.execute(
      {
        companyId: company2.id,
        appointmentId: newAppointment2.id,
      },
    );

    expect(confirmation1.status).toEqual(StatusCollectionAppointment.CONFIRMED);
    expect(confirmation2.status).toEqual(StatusCollectionAppointment.CONFIRMED);
  });

  it("Não deve ser possível a empresa confirmar um agendamento que não é dela. [funcional] [negativo]", async () => {
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

    const newAppointment =
      await collectionAppointmentsRepository.createCollectionAppointment({
        companyId: company1.id,
        customerId: userId2,
        scheduleFor: date,
        wastes: [randomWaste],
      });

    await expect(async () => {
      await confirmationAppointmentByCompanyService.execute({
        companyId: company2.id,
        appointmentId: newAppointment.id,
      });
    }).rejects.toThrow(
      "Company does not have permission to confirm this appointment",
    );
  });

  it("Não deve ser possível a empresa confirmar um agendamento que não existe. [funcional] [negativo]", async () => {
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

    await collectionAppointmentsRepository.createCollectionAppointment({
      companyId: company1.id,
      customerId: userId2,
      scheduleFor: date,
      wastes: [randomWaste],
    });

    await expect(async () => {
      await confirmationAppointmentByCompanyService.execute({
        companyId: company2.id,
        appointmentId: "invalid-appointment-id",
      });
    }).rejects.toThrow("Appointment not found");
  });

  it("Não deve ser possível empresa sem cadastro confirmar um agendamento. [funcional] [negativo]", async () => {
    const userId1 = randomUUID();

    const company1 = await companiesRepository.createCompany({
      userId: userId1,
      company: makeCompany(),
    });

    const userId2 = randomUUID();
    await companiesRepository.createCompany({
      userId: userId2,
      company: makeCompany(),
    });

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
      await confirmationAppointmentByCompanyService.execute({
        companyId: "invalid-company-id",
        appointmentId: newAppointment.id,
      });
    }).rejects.toThrow("Company not found");
  });

  it("Não deve ser possível a empresa confirmar um agendamento que não existe. [funcional] [negativo]", async () => {
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

    await collectionAppointmentsRepository.createCollectionAppointment({
      companyId: company1.id,
      customerId: userId2,
      scheduleFor: date,
      wastes: [randomWaste],
    });

    await expect(async () => {
      await confirmationAppointmentByCompanyService.execute({
        companyId: company2.id,
        appointmentId: "invalid-appointment-id",
      });
    }).rejects.toThrow("Appointment not found");
  });

  it("Não deve ser possível empresa confirmar um agendamento já cancelado. [funcional] [negativo]", async () => {
    const userId1 = randomUUID();

    const company1 = await companiesRepository.createCompany({
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

    await collectionAppointmentsRepository.cancelCollectionAppointment({
      appointmentId: newAppointment.id,
      reason: "Motivo",
      customerId: userId2,
    });

    await expect(async () => {
      await confirmationAppointmentByCompanyService.execute({
        companyId: company1.id,
        appointmentId: newAppointment.id,
      });
    }).rejects.toThrow("Appointment already canceled");
  });

  it("Não deve ser possível empresa confirmar um agendamento já confirmado. [funcional] [negativo]", async () => {
    const userId1 = randomUUID();

    const company1 = await companiesRepository.createCompany({
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

    await collectionAppointmentsRepository.confirmationCollectionAppointmentCompayId(
      {
        appointmentId: newAppointment.id,
        companyId: company1.id,
      },
    );

    await expect(async () => {
      await confirmationAppointmentByCompanyService.execute({
        companyId: company1.id,
        appointmentId: newAppointment.id,
      });
    }).rejects.toThrow("Appointment already confirmed");
  });
});
