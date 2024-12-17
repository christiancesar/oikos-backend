import { AppError } from "@common/errors/AppError";
import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { DonationCondition, DonationStatus } from "../entities/Donation";
import { DonationsRepositoryInMemory } from "../repositories/inMemory/DonationsRepositoryInMemory";
import { CreateDonationService } from "./CreateDonationService";
import { RegisterIrregularityService } from "./RegisterIrregularityService";

let donationsRepository: DonationsRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let createDonationService: CreateDonationService;
let registerIrregularityService: RegisterIrregularityService;

describe("Registrar uma irregularidade em doação", () => {
  beforeEach(() => {
    donationsRepository = new DonationsRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    createDonationService = new CreateDonationService(
      donationsRepository,
      usersRepository,
    );
    registerIrregularityService = new RegisterIrregularityService(
      donationsRepository,
      usersRepository,
    );
  });

  it("Deve ser possível o usuario registrar uma irregularidade em uma doação. [funcional] [positivo]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const user2 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const donation = await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    const irregularity = await registerIrregularityService.execute(
      donation.id,
      user2.id,
      "Irregularidade na doação",
    );

    expect(irregularity.irregularitiesQuantity).toBe(1);
    expect(irregularity.irregularities![0].description).toEqual(
      "Irregularidade na doação",
    );
  });

  it("Não deve ser possível o usuario registrar uma irregularidade em uma doação, caso o identificador da doação não existir. [funcional] [negativo]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const user2 = await usersRepository.createUser({
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

    await expect(async () => {
      await registerIrregularityService.execute(
        "non-existent-id",
        user2.id,
        "Irregularidade na doação",
      );
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possível o próprio usuario da doação registrar uma irregularidade. [funcional] [negativo]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const donation = await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await expect(async () => {
      await registerIrregularityService.execute(
        donation.id,
        user1.id,
        "Irregularidade na doação",
      );
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possível um usuario não cadastrado registrar uma irregularidade. [funcional] [negativo]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const donation = await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await expect(async () => {
      await registerIrregularityService.execute(
        donation.id,
        "non-existent-id",
        "Irregularidade na doação",
      );
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possível um usuario registrar irregularidade repetidas vezes. [funcional] [negativo]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const user2 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const donation = await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await registerIrregularityService.execute(
      donation.id,
      user2.id,
      "Irregularidade na doação",
    );

    await expect(async () => {
      await registerIrregularityService.execute(
        donation.id,
        user2.id,
        "Irregularidade na doação",
      );
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possível um usuario registrar irregularidade quando o status for diferente de aberto e atribuido. [funcional] [negativo]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const user2 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const donation1 = await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    const donation2 = await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await donationsRepository.markDonationAsCancelled({
      donationId: donation1.id,
      reason: "Doação cancelada devido a teste",
    });

    await donationsRepository.closeDonation({
      donationId: donation2.id,
      reason: "Doação fechada devido a teste",
    });

    await expect(async () => {
      await registerIrregularityService.execute(
        donation1.id,
        user2.id,
        "Irregularidade na doação 1",
      );
    }).rejects.toBeInstanceOf(AppError);

    await expect(async () => {
      await registerIrregularityService.execute(
        donation2.id,
        user1.id,
        "Irregularidade na doação 2",
      );
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Deve ser possível quando uma doação tiver 25 ou mais irregularidades mudar o status para fechado. [funcional] [negativo]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const user2 = await usersRepository.createUser({
      email: `user-two@mail,com`,
      password: "123456",
    });

    const donation = await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    for (let i = 0; i < 25; i++) {
      const randomUser = await usersRepository.createUser({
        email: `random-user${i}@mail,com`,
        password: "123456",
      });

      await registerIrregularityService.execute(
        donation.id,
        randomUser.id,
        `Irregularidade ${i}`,
      );
    }

    const irregularity = await registerIrregularityService.execute(
      donation.id,
      user2.id,
      "Irregularidade na doação 1",
    );

    expect(irregularity.status).toEqual(DonationStatus.CLOSED);
  });
});
