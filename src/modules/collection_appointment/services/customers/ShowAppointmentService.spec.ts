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
import { ShowAppointmentService } from "./ShowAppointmentService";

let companiesRepository: CompaniesRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let materialsRepository: MaterialsRepositoryInMemory;
let collectionAppointmentsRepository: CollectionAppointmentsRepositoryInMemory;
let createAppointmentService: CreateAppointmentService;
let showAppointmentService: ShowAppointmentService;

describe("Mostrar um agendamento", () => {
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

    showAppointmentService = new ShowAppointmentService({
      collectionAppointmentsRepository,
      usersRepository,
    });
  });

  it("Deve ser possível o usuario listar todos seus agendamentos criados. [funcional] [positivo]", async () => {
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

    const appointmentShow = await showAppointmentService.execute({
      userId: user.id,
      appointmentId: appointment.id,
    });

    expect(appointmentShow).toHaveProperty("id");
  });

  it("Não deve ser possível usuario não cadastrado mostrar agendamento. [funcional] [negativo]", async () => {
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
      await showAppointmentService.execute({
        userId: "invalid-user-id",
        appointmentId: appointment.id,
      });
    }).rejects.toThrow("User not found");
  });

  it("Não deve ser possível usuario listar um agendamento nao cadastrado. [funcional] [negativo]", async () => {
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
      await showAppointmentService.execute({
        userId: user.id,
        appointmentId: "invalid-appointment-id",
      });
    }).rejects.toThrow("Appointment not found");
  });

  it("Não deve ser possível um usuario listar agendamento de outro usuario. [funcional] [negativo]", async () => {
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
      await showAppointmentService.execute({
        userId: user2.id,
        appointmentId: appointment.id,
      });
    }).rejects.toThrow("User not authorized get this appointment");
  });
});
