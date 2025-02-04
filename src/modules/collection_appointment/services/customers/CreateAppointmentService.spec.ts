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
import { AppError } from "@common/errors/AppError";

let companiesRepository: CompaniesRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let materialsRepository: MaterialsRepositoryInMemory;
let collectionAppointmentsRepository: CollectionAppointmentsRepositoryInMemory;
let createAppointmentService: CreateAppointmentService;

describe("Criar agendamento de coleta", () => {
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
  });

  it("Deve ser possível o usuario criar um agendamento de coleta. [funcional] [positivo]", async () => {
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

    expect(appointment).toHaveProperty("id");
  });

  it("Não deve ser possível o usuario criar agendamento de coletam caso empresa não for cadastrada. [funcional] [negativo]", async () => {
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

    await expect(async () => {
      await createAppointmentService.execute({
        companyId: "invalid-company-id",
        customerId: user.id,
        scheduleFor: new Date("2024/12/16 08:00:00"),
        wastes: [material1.id],
      });
    }).rejects.toThrow(AppError);
  });

  it("Não deve ser possível o usuario criar agendamento de coletam caso a empresa não aceitar agendamentos. [funcional] [negativo]", async () => {
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
        acceptAppointments: false,
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

    await expect(async () => {
      await createAppointmentService.execute({
        companyId: company.id,
        customerId: user.id,
        scheduleFor: new Date("2024/12/16 08:00:00"),
        wastes: [material1.id],
      });
    }).rejects.toThrow(AppError);
  });

  it("Não deve ser possível o usuario criar agendamento de coletam caso a empresa não tenha cadastrado horario de funcionamento. [funcional] [negativo]", async () => {
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

    await companiesRepository.createWasteItem({
      companyId: company.id,
      waste: {
        materialId: material1.id,
        amount: 0,
        unit: "KG",
        wasteType: WasteType.GARBAGE,
      },
    });

    await expect(async () => {
      await createAppointmentService.execute({
        companyId: company.id,
        customerId: user.id,
        scheduleFor: new Date("2024/12/16 08:00:00"),
        wastes: [material1.id],
      });
    }).rejects.toThrow(AppError);
  });

  it("Não deve ser possível o usuario criar agendamento de coletam caso não seja um usuario cadastrado. [funcional] [negativo]", async () => {
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

    await expect(async () => {
      await createAppointmentService.execute({
        companyId: company.id,
        customerId: "invalid-customer-id",
        scheduleFor: new Date("2024/12/16 08:00:00"),
        wastes: [material1.id],
      });
    }).rejects.toThrow("Customer not found");
  });

  it("Não deve ser possível o usuario criar agendamento de coletam caso perfil do usuario não exista. [funcional] [negativo]", async () => {
    const user = await usersRepository.createUser({
      email: "example@example.com",
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

    await expect(async () => {
      await createAppointmentService.execute({
        companyId: company.id,
        customerId: user.id,
        scheduleFor: new Date("2024/12/16 08:00:00"),
        wastes: [material1.id],
      });
    }).rejects.toThrow(
      "To create a schedule, the Profile information must be complete.",
    );
  });

  it("Não deve ser possível o usuario criar agendamento de coletam caso usuario informar um matarial não cadastrado. [funcional] [negativo]", async () => {
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

    await expect(async () => {
      await createAppointmentService.execute({
        companyId: company.id,
        customerId: user.id,
        scheduleFor: new Date("2024/12/16 08:00:00"),
        wastes: ["0d448be0-6af4-412f-8403-591eed81d2bc"],
      });
    }).rejects.toThrow("Waste not found");
  });

  it("Não deve ser possível o usuario criar agendamento de coletam caso perfil do usuario não exista. [funcional] [negativo]", async () => {
    const user = await usersRepository.createUser({
      email: "example@example.com",
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

    await expect(async () => {
      await createAppointmentService.execute({
        companyId: company.id,
        customerId: user.id,
        scheduleFor: new Date("2024/12/16 08:00:00"),
        wastes: [material1.id],
      });
    }).rejects.toThrow(
      "To create a schedule, the Profile information must be complete.",
    );
  });

  it("Não deve ser possível o usuario criar agendamento de coletam caso usuario informar um matarial no qual a empresa não trabalha. [funcional] [negativo]", async () => {
    const user = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    user.profile = makeProfile();

    const material1 = await materialsRepository.create({
      ...makeMaterial({ name: "Material A" }),
    });

    const material2 = await materialsRepository.create({
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

    await expect(async () => {
      await createAppointmentService.execute({
        companyId: company.id,
        customerId: user.id,
        scheduleFor: new Date("2024/12/16 08:00:00"),
        wastes: [material2.id],
      });
    }).rejects.toThrow(
      "The company does not have the waste items you selected",
    );
  });

  it("Não deve ser possível o usuario criar agendamento de coletam caso a empresa não informar item de reciclagem. [estrutural] [negativo]", async () => {
    const user = await usersRepository.createUser({
      email: "example@example.com",
      password: "123456",
    });

    user.profile = makeProfile();

    await materialsRepository.create({
      ...makeMaterial({ name: "Material A" }),
    });

    const material2 = await materialsRepository.create({
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

    await expect(async () => {
      await createAppointmentService.execute({
        companyId: company.id,
        customerId: user.id,
        scheduleFor: new Date("2024/12/16 08:00:00"),
        wastes: [material2.id],
      });
    }).rejects.toThrow("The company does not have waste items available");
  });
});
