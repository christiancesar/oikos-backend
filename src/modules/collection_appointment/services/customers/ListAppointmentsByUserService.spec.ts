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
import { ListAppointmentsByUserService } from "./ListAppointmentsByUserService";

let companiesRepository: CompaniesRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let materialsRepository: MaterialsRepositoryInMemory;
let collectionAppointmentsRepository: CollectionAppointmentsRepositoryInMemory;
let createAppointmentService: CreateAppointmentService;
let listAppointmentsByUserService: ListAppointmentsByUserService;

describe("Listar agendamentos de coleta por usuario", () => {
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

    listAppointmentsByUserService = new ListAppointmentsByUserService({
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

    await createAppointmentService.execute({
      companyId: company.id,
      customerId: user.id,
      scheduleFor: new Date("2024/12/16 08:00:00"),
      wastes: [material1.id],
    });

    const appointments = await listAppointmentsByUserService.execute({
      userId: user.id,
    });

    expect(appointments).toHaveLength(1);
  });

  it("Não deve ser possível usuario não cadastrado listar agendamentos criados. [funcional] [negativo]", async () => {
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
      await listAppointmentsByUserService.execute({
        userId: "invalid-user-id",
      });
    }).rejects.toThrow("User not found");
  });
});
