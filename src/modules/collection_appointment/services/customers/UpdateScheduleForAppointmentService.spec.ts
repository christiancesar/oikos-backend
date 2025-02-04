import { makeAddress } from "@modules/addresses/factories/makeAddress";
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
import { CreateAppointmentService } from "./CreateAppointmentService";
import { UpdateScheduleForAppointmentService } from "./UpdateScheduleForAppointmentService";

let companiesRepository: CompaniesRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let materialsRepository: MaterialsRepositoryInMemory;
let collectionAppointmentsRepository: CollectionAppointmentsRepositoryInMemory;
let createAppointmentService: CreateAppointmentService;
let updateScheduleForAppointmentService: UpdateScheduleForAppointmentService;

describe("Atualizar um agendamento", () => {
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

    updateScheduleForAppointmentService =
      new UpdateScheduleForAppointmentService({
        collectionAppointmentsRepository,
        usersRepository,
      });
  });

  it("Deve ser possível o usuario atualizar um agendamento especifico. [funcional] [positivo]", async () => {
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

    const date = new Date("2024/12/16 09:00:00");
    const appointmentShow = await updateScheduleForAppointmentService.execute({
      userId: user.id,
      appointmentId: appointment.id,
      scheduleFor: date,
    });

    expect(appointmentShow.scheduleFor).toBeInstanceOf(Date);
    expect(appointmentShow.scheduleFor).toEqual(date);
  });

  it("Não deve ser possível um usuario não cadastrado atualizar um agendamento. [funcional] [negativo]", async () => {
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

    const date = new Date("2024/12/16 09:00:00");

    await expect(async () => {
      await updateScheduleForAppointmentService.execute({
        userId: "invalid-user-id",
        appointmentId: appointment.id,
        scheduleFor: date,
      });
    }).rejects.toThrow("User not found");
  });

  it("Não deve ser possível um usuario atualizar um agendamento que não foi cadastrado. [funcional] [negativo]", async () => {
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

    const date = new Date("2024/12/16 09:00:00");

    await expect(async () => {
      await updateScheduleForAppointmentService.execute({
        userId: user.id,
        appointmentId: "invalid-appointment-id",
        scheduleFor: date,
      });
    }).rejects.toThrow("Appointment not found");
  });

  it("Não deve ser possível um usuario atualizar um agendamento que não foi cadastrado. [funcional] [negativo]", async () => {
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

    const date = new Date("2024/12/16 09:00:00");

    await expect(async () => {
      await updateScheduleForAppointmentService.execute({
        userId: user2.id,
        appointmentId: appointment.id,
        scheduleFor: date,
      });
    }).rejects.toThrow("User not authorized get this appointment");
  });

  it("Não deve ser possível um usuario atualizar um agendamento que foi cancelado previamente. [funcional] [negativo]", async () => {
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

    await collectionAppointmentsRepository.cancelCollectionAppointment({
      appointmentId: appointment.id,
      customerId: user.id,
      reason: "Reason for cancel",
    });

    const date = new Date("2024/12/16 09:00:00");

    await expect(async () => {
      await updateScheduleForAppointmentService.execute({
        userId: user.id,
        appointmentId: appointment.id,
        scheduleFor: date,
      });
    }).rejects.toThrow(
      "Appointment already canceled, you can't update the schedule",
    );
  });
});
