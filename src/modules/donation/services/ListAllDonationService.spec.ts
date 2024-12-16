import { AppError } from "@common/errors/AppError";
import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { DonationCondition, DonationStatus } from "../entities/Donation";
import { DonationsRepositoryInMemory } from "../repositories/inMemory/DonationsRepositoryInMemory";
import { CreateDonationService } from "./CreateDonationService";
import { ListAllDonationService } from "./ListAllDonationService";

let donationsRepository: DonationsRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let createDonationService: CreateDonationService;
let listAllDonationService: ListAllDonationService;

describe("Criar uma doação", () => {
  beforeEach(() => {
    donationsRepository = new DonationsRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    createDonationService = new CreateDonationService(
      donationsRepository,
      usersRepository,
    );
    listAllDonationService = new ListAllDonationService(donationsRepository);
  });

  it("Deve ser possível o usuario criar uma doação. [funcional] [positivo]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.NEW,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    expect(await listAllDonationService.execute()).toHaveLength(3);
  });

  it("Deve ser possível o usuario filtrar doações que as condições são novas. [estrutural] [positivo]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.NEW,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    expect(
      await listAllDonationService.execute({
        condition: DonationCondition.NEW,
      }),
    ).toHaveLength(1);
  });

  it("Deve ser possível o usuario filtrar doações que as condições são usadas. [estrutural] [positivo]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.NEW,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    expect(
      await listAllDonationService.execute({
        condition: DonationCondition.USED,
      }),
    ).toHaveLength(2);
  });

  it("Deve ser possível o usuario filtrar doações que as condições e status. [estrutural] [positivo]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.NEW,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    expect(
      await listAllDonationService.execute({
        condition: DonationCondition.USED,
        status: DonationStatus.OPEN,
      }),
    ).toHaveLength(2);
  });

  it("Nao deve deve ser possível o usuario filtrar doações que as condições ou status não existam. [estrutural] [positivo]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.NEW,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    expect(
      async () =>
        await listAllDonationService.execute({
          condition: "non-existent-condition",
          status: "non-existent-status",
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Nao deve deve ser possível o usuario filtrar doações que as condições ou status não existam. [estrutural] [positivo]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.NEW,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    expect(
      async () =>
        await listAllDonationService.execute({
          condition: DonationCondition.USED,
          status: "non-existent-status",
        }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
