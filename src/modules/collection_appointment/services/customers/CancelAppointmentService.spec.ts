import { makeAddress } from "@modules/addresses/factories/makeAddress";
import { StatusCollectionAppointment } from "@modules/collection_appointment/entities/CollectionAppointment";
import { CollectionAppointmentsRepositoryInMemory } from "@modules/collection_appointment/repositories/inMemory/CollectionAppointmentsRepositoryInMemory";
import { WasteType } from "@modules/companies/entities/Item";
import { makeBusinessHoursDefault } from "@modules/companies/factories/makeBusinessHours";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import { makeMaterial } from "@modules/material/factories/makeMaterial";
import { MaterialsRepositoryInMemory } from "@modules/material/repositories/inMemory/MaterialsRepositoryInMemory";
import { makeProfile } from "@modules/profiles/tests/factories/makeProfile";
import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { CancelAppointmentService } from "./CancelAppointmentService";
import { CreateAppointmentService } from "./CreateAppointmentService";

let companiesRepository: CompaniesRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let materialsRepository: MaterialsRepositoryInMemory;
let collectionAppointmentsRepository: CollectionAppointmentsRepositoryInMemory;
let createAppointmentService: CreateAppointmentService;
let cancelAppointmentService: CancelAppointmentService;

describe("Cancelar agendamento de coleta", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    materialsRepository = new MaterialsRepositoryInMemory();
    collectionAppointmentsRepository =
      new CollectionAppointmentsRepositoryInMemory();

    createAppointmentService = new CreateAppointmentService({
      companiesRepository,
      usersRepository,
      materialsRepository,
      collectionAppointmentsRepository,
    });

    cancelAppointmentService = new CancelAppointmentService({
      collectionAppointmentsRepository,
      usersRepository,
    });
  });

  it("Deve ser possível o usuario cancelar seu agendamento. [funcional] [positivo]", async () => {
    const user = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    user.profile = makeProfile();

    const material1 = await materialsRepository.create({
      ...makeMaterial({ name: "Material A" }),
    });

    const company = await companiesRepository.createCompany({
      userId: user.id,
      company: makeCompany({
        acceptAppointments: true,
      }),
    });

    await companiesRepository.createAddress({
      address: { ...makeAddress() },
      companyId: company.id,
    });

    await Promise.all([
      makeBusinessHoursDefault().map(async (businessHour) => {
        await companiesRepository.createBusinessHours({
          companyId: company.id,
          businessHours: businessHour,
        });
      }),
    ]);

    await companiesRepository.createWasteItem({
      companyId: company.id,
      waste: {
        materialId: material1.id,
        amount: 0,
        unit: "KG",
        wasteType: WasteType.GARBAGE,
      },
    });

    const appointment = await createAppointmentService.execute({
      companyId: company.id,
      customerId: user.id,
      scheduleFor: new Date("2024/12/16 08:00:00"),
      wastes: [material1.id],
    });

    const canceledAppointment = await cancelAppointmentService.execute({
      appointmentId: appointment.id,
      reason: "Motivo do cancelamento",
      userId: user.id,
    });

    expect(canceledAppointment.status).toEqual(
      StatusCollectionAppointment.CANCELED,
    );
  });

  it("Não deve ser possível cancelar agendamento com um usuario nao cadastrado. [funcional] [negativo]", async () => {
    const user = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    user.profile = makeProfile();

    const material1 = await materialsRepository.create({
      ...makeMaterial({ name: "Material A" }),
    });

    const company = await companiesRepository.createCompany({
      userId: user.id,
      company: makeCompany({
        acceptAppointments: true,
      }),
    });

    await companiesRepository.createAddress({
      address: { ...makeAddress() },
      companyId: company.id,
    });

    await Promise.all([
      makeBusinessHoursDefault().map(async (businessHour) => {
        await companiesRepository.createBusinessHours({
          companyId: company.id,
          businessHours: businessHour,
        });
      }),
    ]);

    await companiesRepository.createWasteItem({
      companyId: company.id,
      waste: {
        materialId: material1.id,
        amount: 0,
        unit: "KG",
        wasteType: WasteType.GARBAGE,
      },
    });

    const appointment = await createAppointmentService.execute({
      companyId: company.id,
      customerId: user.id,
      scheduleFor: new Date("2024/12/16 08:00:00"),
      wastes: [material1.id],
    });

    await expect(async () => {
      await cancelAppointmentService.execute({
        appointmentId: appointment.id,
        reason: "Motivo do cancelamento",
        userId: "invalid-user-id",
      });
    }).rejects.toThrow("User not found");
  });

  it("Não deve ser possível cancelar agendamento caso ele não for cadastrado. [funcional] [negativo]", async () => {
    const user = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    user.profile = makeProfile();

    const material1 = await materialsRepository.create({
      ...makeMaterial({ name: "Material A" }),
    });

    const company = await companiesRepository.createCompany({
      userId: user.id,
      company: makeCompany({
        acceptAppointments: true,
      }),
    });

    await companiesRepository.createAddress({
      address: { ...makeAddress() },
      companyId: company.id,
    });

    await Promise.all([
      makeBusinessHoursDefault().map(async (businessHour) => {
        await companiesRepository.createBusinessHours({
          companyId: company.id,
          businessHours: businessHour,
        });
      }),
    ]);

    await companiesRepository.createWasteItem({
      companyId: company.id,
      waste: {
        materialId: material1.id,
        amount: 0,
        unit: "KG",
        wasteType: WasteType.GARBAGE,
      },
    });

    await createAppointmentService.execute({
      companyId: company.id,
      customerId: user.id,
      scheduleFor: new Date("2024/12/16 08:00:00"),
      wastes: [material1.id],
    });

    await expect(async () => {
      await cancelAppointmentService.execute({
        appointmentId: "invalid-appointment-id",
        reason: "Motivo do cancelamento",
        userId: user.id,
      });
    }).rejects.toThrow("Appointment not found");
  });

  it("Não deve ser possível cancelar agendamento caso o usuario não for dono do agendamento. [funcional] [negativo]", async () => {
    const user = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    user.profile = makeProfile();

    const user2 = await usersRepository.createUser({
      email: "example2@example.com",
      password: "123456",
    });

    const material1 = await materialsRepository.create({
      ...makeMaterial({ name: "Material A" }),
    });

    const company = await companiesRepository.createCompany({
      userId: user.id,
      company: makeCompany({
        acceptAppointments: true,
      }),
    });

    await companiesRepository.createAddress({
      address: { ...makeAddress() },
      companyId: company.id,
    });

    await Promise.all([
      makeBusinessHoursDefault().map(async (businessHour) => {
        await companiesRepository.createBusinessHours({
          companyId: company.id,
          businessHours: businessHour,
        });
      }),
    ]);

    await companiesRepository.createWasteItem({
      companyId: company.id,
      waste: {
        materialId: material1.id,
        amount: 0,
        unit: "KG",
        wasteType: WasteType.GARBAGE,
      },
    });

    const appointment = await createAppointmentService.execute({
      companyId: company.id,
      customerId: user.id,
      scheduleFor: new Date("2024/12/16 08:00:00"),
      wastes: [material1.id],
    });

    await expect(async () => {
      await cancelAppointmentService.execute({
        appointmentId: appointment.id,
        reason: "Motivo do cancelamento",
        userId: user2.id,
      });
    }).rejects.toThrow("User not authorized to cancel this appointment");
  });

  it("Não deve ser possível cancelar agendamento caso cancelado previamente. [funcional] [negativo]", async () => {
    const user = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    user.profile = makeProfile();

    const material1 = await materialsRepository.create({
      ...makeMaterial({ name: "Material A" }),
    });

    const company = await companiesRepository.createCompany({
      userId: user.id,
      company: makeCompany({
        acceptAppointments: true,
      }),
    });

    await companiesRepository.createAddress({
      address: { ...makeAddress() },
      companyId: company.id,
    });

    await Promise.all([
      makeBusinessHoursDefault().map(async (businessHour) => {
        await companiesRepository.createBusinessHours({
          companyId: company.id,
          businessHours: businessHour,
        });
      }),
    ]);

    await companiesRepository.createWasteItem({
      companyId: company.id,
      waste: {
        materialId: material1.id,
        amount: 0,
        unit: "KG",
        wasteType: WasteType.GARBAGE,
      },
    });

    const appointment = await createAppointmentService.execute({
      companyId: company.id,
      customerId: user.id,
      scheduleFor: new Date("2024/12/16 08:00:00"),
      wastes: [material1.id],
    });

    await cancelAppointmentService.execute({
      appointmentId: appointment.id,
      reason: "Motivo do cancelamento",
      userId: user.id,
    });

    await expect(async () => {
      await cancelAppointmentService.execute({
        appointmentId: appointment.id,
        reason: "Motivo do cancelamento",
        userId: user.id,
      });
    }).rejects.toThrow("Appointment already canceled");
  });
});
